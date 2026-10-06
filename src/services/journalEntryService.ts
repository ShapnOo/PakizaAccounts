import { VoucherEntry, Attachment } from '../types/journalEntry';
import { MOCK_JOURNAL_ENTRIES } from '../mock/journalEntries';
import { delay } from '../lib/delay';

const LS_KEY = 'journal-entries-v5';

export async function listEntries(): Promise<VoucherEntry[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(MOCK_JOURNAL_ENTRIES));
    return MOCK_JOURNAL_ENTRIES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length < MOCK_JOURNAL_ENTRIES.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(MOCK_JOURNAL_ENTRIES));
      return MOCK_JOURNAL_ENTRIES;
    }
    return parsed;
  } catch (e) {
    return MOCK_JOURNAL_ENTRIES;
  }
}

export async function getEntry(id: string): Promise<VoucherEntry | null> {
  await delay(200);
  const all = await listEntries();
  return all.find((e) => e.id === id) ?? null;
}

export async function createEntry(
  payload: Omit<VoucherEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<VoucherEntry> {
  await delay(350);
  const all = await listEntries();
  const now = new Date().toISOString();

  // Auto-generate next sequence number if needed
  const nextNumber = payload.voucherNo || `VCH-${Date.now().toString().slice(-6)}`;

  const next: VoucherEntry = {
    ...payload,
    voucherNo: nextNumber,
    id: `vch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [next, ...all];
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return next;
}

export async function updateEntry(
  id: string,
  patch: Partial<VoucherEntry>
): Promise<VoucherEntry> {
  await delay(300);
  const all = await listEntries();
  const now = new Date().toISOString();

  let target: VoucherEntry | null = null;
  const updated = all.map((e) => {
    if (e.id === id) {
      target = { ...e, ...patch, updatedAt: now };
      return target;
    }
    return e;
  });

  if (!target) {
    throw new Error('Voucher entry not found');
  }

  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return target;
}

export async function voidEntry(id: string): Promise<void> {
  await delay(250);
  const all = await listEntries();
  const updated = all.map((e) =>
    e.id === id ? { ...e, voided: true, updatedAt: new Date().toISOString() } : e
  );
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
}

export async function unvoidEntry(id: string): Promise<void> {
  await delay(250);
  const all = await listEntries();
  const updated = all.map((e) =>
    e.id === id ? { ...e, voided: false, updatedAt: new Date().toISOString() } : e
  );
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
}

export async function deleteEntry(id: string): Promise<void> {
  await delay(250);
  const all = await listEntries();
  const remaining = all.filter((e) => e.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(remaining));
}

export async function addAttachment(
  entryId: string,
  attachment: Attachment
): Promise<VoucherEntry> {
  await delay(200);
  const all = await listEntries();
  let updatedEntry: VoucherEntry | null = null;

  const updated = all.map((e) => {
    if (e.id === entryId) {
      updatedEntry = {
        ...e,
        attachments: [...(e.attachments || []), attachment],
        updatedAt: new Date().toISOString(),
      };
      return updatedEntry;
    }
    return e;
  });

  if (!updatedEntry) throw new Error('Voucher entry not found');
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return updatedEntry;
}

export async function removeAttachment(
  entryId: string,
  attachmentId: string
): Promise<VoucherEntry> {
  await delay(200);
  const all = await listEntries();
  let updatedEntry: VoucherEntry | null = null;

  const updated = all.map((e) => {
    if (e.id === entryId) {
      updatedEntry = {
        ...e,
        attachments: (e.attachments || []).filter((a) => a.id !== attachmentId),
        updatedAt: new Date().toISOString(),
      };
      return updatedEntry;
    }
    return e;
  });

  if (!updatedEntry) throw new Error('Voucher entry not found');
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return updatedEntry;
}
