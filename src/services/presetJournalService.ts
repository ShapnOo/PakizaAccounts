import { JournalPreset, VoucherType } from '../types/presetJournal';
import { MOCK_PRESET_JOURNALS } from '../mock/presetJournals';
import { delay } from '../lib/delay';

const LS_KEY = 'journal-presets-v2';

export async function listPresets(
  voucherType?: VoucherType
): Promise<JournalPreset[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(MOCK_PRESET_JOURNALS));
    return voucherType
      ? MOCK_PRESET_JOURNALS.filter((p) => p.voucherType === voucherType)
      : MOCK_PRESET_JOURNALS;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length < MOCK_PRESET_JOURNALS.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(MOCK_PRESET_JOURNALS));
      return voucherType
        ? MOCK_PRESET_JOURNALS.filter((p) => p.voucherType === voucherType)
        : MOCK_PRESET_JOURNALS;
    }
    return voucherType
      ? parsed.filter((p: JournalPreset) => p.voucherType === voucherType)
      : parsed;
  } catch (e) {
    return MOCK_PRESET_JOURNALS;
  }
}

export async function getPreset(id: string): Promise<JournalPreset | null> {
  await delay(200);
  const all = await listPresets();
  return all.find((p) => p.id === id) ?? null;
}

export async function createPreset(
  payload: Omit<JournalPreset, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
): Promise<JournalPreset> {
  await delay(400);
  const all = await listPresets();
  const now = new Date().toISOString();
  const next: JournalPreset = {
    ...payload,
    id: `preset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  const updated = [next, ...all];
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return next;
}

export async function updatePreset(
  id: string,
  patch: Partial<JournalPreset>
): Promise<JournalPreset> {
  await delay(350);
  const all = await listPresets();
  const next = all.map((p) =>
    p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
  );
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next.find((p) => p.id === id)!;
}

export async function deletePreset(id: string): Promise<void> {
  await delay(250);
  const all = await listPresets();
  const filtered = all.filter((p) => p.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(filtered));
}

export async function incrementUsage(id: string): Promise<void> {
  await delay(100);
  const all = await listPresets();
  const next = all.map((p) =>
    p.id === id
      ? {
          ...p,
          usageCount: (p.usageCount || 0) + 1,
          lastUsedAt: new Date().toISOString(),
        }
      : p
  );
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

export async function duplicatePreset(id: string): Promise<JournalPreset> {
  const source = await getPreset(id);
  if (!source) throw new Error('Preset not found');

  return createPreset({
    profileName: `${source.profileName} (copy)`,
    voucherType: source.voucherType,
    lines: source.lines.map((l) => ({
      ...l,
      id: `pl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    })),
    narration: source.narration,
  });
}
