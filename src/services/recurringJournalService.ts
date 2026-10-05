import { RecurringProfile, Cadence } from '../types/recurringJournal';
import { MOCK_RECURRING_PROFILES } from '../mock/recurringProfiles';
import { computeNextRun } from '../lib/recurrence';
import { delay } from '../lib/delay';
import { createEntry } from './journalEntryService';

const LS_KEY = 'recurring-profiles';

export async function listProfiles(): Promise<RecurringProfile[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(MOCK_RECURRING_PROFILES));
    return MOCK_RECURRING_PROFILES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length < MOCK_RECURRING_PROFILES.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(MOCK_RECURRING_PROFILES));
      return MOCK_RECURRING_PROFILES;
    }
    return parsed;
  } catch (e) {
    return MOCK_RECURRING_PROFILES;
  }
}

export async function getProfile(id: string): Promise<RecurringProfile | null> {
  await delay(200);
  const all = await listProfiles();
  return all.find((p) => p.id === id) ?? null;
}

export async function createProfile(
  payload: Omit<RecurringProfile, 'id' | 'createdAt' | 'updatedAt' | 'totalRunsCount'>
): Promise<RecurringProfile> {
  await delay(350);
  const all = await listProfiles();
  const now = new Date().toISOString();

  const nextRun = payload.nextRunAt || computeNextRun(payload.startsOn, payload.repeatEvery);

  const next: RecurringProfile = {
    ...payload,
    id: `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    nextRunAt: nextRun,
    totalRunsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [next, ...all];
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return next;
}

export async function updateProfile(
  id: string,
  patch: Partial<RecurringProfile>
): Promise<RecurringProfile> {
  await delay(300);
  const all = await listProfiles();
  const now = new Date().toISOString();

  let target: RecurringProfile | null = null;
  const updated = all.map((p) => {
    if (p.id === id) {
      const merged = { ...p, ...patch, updatedAt: now };
      if (patch.startsOn || patch.repeatEvery) {
        merged.nextRunAt = computeNextRun(
          patch.startsOn || merged.startsOn,
          patch.repeatEvery || merged.repeatEvery
        );
      }
      target = merged;
      return merged;
    }
    return p;
  });

  if (!target) {
    throw new Error('Recurring profile not found');
  }

  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return target;
}

export async function deleteProfile(id: string): Promise<void> {
  await delay(250);
  const all = await listProfiles();
  const remaining = all.filter((p) => p.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(remaining));
}

export async function toggleActiveProfile(id: string): Promise<RecurringProfile> {
  await delay(200);
  const all = await listProfiles();
  const now = new Date().toISOString();
  let updatedItem: RecurringProfile | null = null;

  const updated = all.map((p) => {
    if (p.id === id) {
      updatedItem = { ...p, active: !p.active, updatedAt: now };
      return updatedItem;
    }
    return p;
  });

  if (!updatedItem) throw new Error('Recurring profile not found');
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return updatedItem;
}

export async function duplicateProfile(id: string): Promise<RecurringProfile> {
  await delay(300);
  const all = await listProfiles();
  const source = all.find((p) => p.id === id);
  if (!source) throw new Error('Source profile not found');

  const now = new Date().toISOString();
  const cloned: RecurringProfile = {
    ...source,
    id: `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    profileName: `${source.profileName} (Copy)`,
    totalRunsCount: 0,
    lastRunAt: undefined,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [cloned, ...all];
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return cloned;
}

export async function runProfileNow(id: string): Promise<{ profile: RecurringProfile; voucherNo: string }> {
  await delay(400);
  const profile = await getProfile(id);
  if (!profile) throw new Error('Profile not found');

  const todayStr = new Date().toISOString().slice(0, 10);
  const prefixMap = { Journal: 'JV', Receive: 'RV', Payment: 'PV', Contra: 'CV' };
  const voucherNo = `${prefixMap[profile.voucherType]}-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  // 1. Post actual voucher to Journal Entries module
  await createEntry({
    voucherNo,
    voucherType: profile.voucherType,
    source: 'Recurring Journal',
    voucherDate: todayStr,
    narration: `[Auto-Generated from Profile: "${profile.profileName}"] ${profile.narration || ''}`,
    amount: profile.amount,
    lines: profile.lines.map((l, idx) => ({
      ...l,
      id: `line-gen-${Date.now().toString(36)}-${idx}`,
    })),
    attachments: [],
    voided: false,
  });

  // 2. Advance nextRunAt
  const nextDate = computeNextRun(profile.startsOn, profile.repeatEvery, new Date(Date.now() + 86400000));

  const updated = await updateProfile(id, {
    lastRunAt: todayStr,
    nextRunAt: nextDate,
    totalRunsCount: (profile.totalRunsCount || 0) + 1,
  });

  return { profile: updated, voucherNo };
}
