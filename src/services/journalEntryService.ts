import { VoucherEntry, Attachment } from '../types/journalEntry';
import { MOCK_JOURNAL_ENTRIES } from '../mock/journalEntries';
import { delay } from '../lib/delay';

const LS_KEY = 'journal-entries-v6';

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
    versionCount: 0,
    history: [
      {
        version: 0,
        timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        user: 'Tahmid Afsar',
        userRole: 'Creator',
        action: 'Created',
        notes: `Initial voucher generation from ${payload.source || 'Manual'}`,
        amount: payload.amount,
        linesCount: payload.lines?.length || 0,
      },
    ],
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
      const prevHistory = e.history || [];
      const currentModCount = typeof e.versionCount === 'number'
        ? e.versionCount
        : prevHistory.length > 0
          ? Math.max(0, ...prevHistory.map((h) => h.version))
          : 0;
      const nextVersion = currentModCount + 1;
      const newRev = {
        version: nextVersion,
        timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        user: 'Tahmid Afsar Shapno',
        userRole: 'Head of Accounts & Finance',
        action: 'Modified' as const,
        notes: 'Voucher lines and ledger distributions modified',
        amount: patch.amount ?? e.amount,
        linesCount: patch.lines ? patch.lines.length : (e.lines?.length || 0),
      };

      target = {
        ...e,
        ...patch,
        versionCount: nextVersion,
        history: [newRev, ...prevHistory],
        updatedAt: now,
      };
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
