import { SubledgerEntry, SubledgerType } from '../types/subledger';
import { MOCK_SUBLEDGER } from '../mock/subledger';
import { delay } from '../lib/delay';

const LS_KEY = 'subledger:entries';

function getStoredEntries(): SubledgerEntry[] {
  if (typeof window === 'undefined') return MOCK_SUBLEDGER;
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(MOCK_SUBLEDGER));
    return MOCK_SUBLEDGER;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length < MOCK_SUBLEDGER.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(MOCK_SUBLEDGER));
      return MOCK_SUBLEDGER;
    }
    // Ensure all items conform to SubledgerEntry
    return parsed.map((item: any) => ({
      ...item,
      effectiveCompanyIds: Array.isArray(item.effectiveCompanyIds)
        ? item.effectiveCompanyIds
        : item.effectiveCompanyId
        ? [item.effectiveCompanyId]
        : ['PSL'],
    }));
  } catch (e) {
    console.error('Failed to parse subledger entries from localStorage', e);
    return MOCK_SUBLEDGER;
  }
}

function saveStoredEntries(entries: SubledgerEntry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
  }
}

export async function listSubledger(type?: SubledgerType): Promise<SubledgerEntry[]> {
  await delay(300);
  const all = getStoredEntries();
  return type ? all.filter((e) => e.type === type) : all;
}

export async function getSubledgerById(id: string): Promise<SubledgerEntry | null> {
  await delay(200);
  const all = getStoredEntries();
  return all.find((e) => e.id === id) || null;
}

export async function createSubledger(
  payload: Omit<SubledgerEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SubledgerEntry> {
  await delay(400);
  const all = getStoredEntries();
  const now = new Date().toISOString();
  const next: SubledgerEntry = {
    ...payload,
    id: `${payload.type.slice(0, 2)}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  const updatedList = [next, ...all];
  saveStoredEntries(updatedList);
  return next;
}

export async function updateSubledger(
  id: string,
  patch: Partial<SubledgerEntry>
): Promise<SubledgerEntry> {
  await delay(300);
  const all = getStoredEntries();
  const index = all.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error(`Subledger entry with ID "${id}" not found`);
  }

  const updated: SubledgerEntry = {
    ...all[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  saveStoredEntries([...all]);
  return updated;
}

export async function deleteSubledger(id: string): Promise<void> {
  await delay(300);
  const all = getStoredEntries();
  const filtered = all.filter((e) => e.id !== id);
  saveStoredEntries(filtered);
}

/**
 * Checks if a subledger entry is used in any active voucher or opening balance line.
 * For now returns 0 mock usage to allow safe deletion, but validates the check flow.
 */
export async function checkSubledgerUsage(id: string): Promise<number> {
  await delay(150);
  // Wire check: could inspect localStorage for voucher or opening balance records
  try {
    const obRaw = localStorage.getItem('opening_balance_data');
    if (obRaw) {
      const ob = JSON.parse(obRaw);
      const lines = ob.lines || [];
      const matchCount = lines.filter((l: any) => l.costCenterId === id || l.subledgerId === id).length;
      if (matchCount > 0) return matchCount;
    }
  } catch (err) {
    // Non-blocking fallback
  }
  return 0;
}
