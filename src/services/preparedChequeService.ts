import { ChequePrepare, PrepareLine } from '../types/chequePrepare';
import { MOCK_PREPARED_CHEQUES } from '../mock/preparedCheques';
import { delay } from '../lib/delay';
import { listChequeBooks, updateChequeBook } from './chequeBookService';

const LS_PREP = 'prepared-cheques';

// Normalize seed data to multi-line model if needed
function normalizePreparedList(items: any[]): ChequePrepare[] {
  return items.map((item) => {
    if (item.lines && Array.isArray(item.lines) && item.lines.length > 0) {
      return item as ChequePrepare;
    }
    // Convert legacy single-line item to multi-line
    const line: PrepareLine = {
      id: `line-${item.id || '1'}`,
      chequeType: item.chequeType || 'AC Payee',
      chequeNo: item.chequeNo || '',
      chequeDate: item.chequeDate || '',
      payTo: item.payTo || '',
      chequeFor: item.chequeFor,
      name: item.partyName || item.name,
      glAccountId: item.glAccountId || 'acc-02-01-01-01',
      amount: item.amount || 0,
    };
    return {
      ...item,
      lines: [line],
    } as ChequePrepare;
  });
}

export async function listPreparedCheques(): Promise<ChequePrepare[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_PREP);
  if (!raw) {
    const normalized = normalizePreparedList(MOCK_PREPARED_CHEQUES);
    localStorage.setItem(LS_PREP, JSON.stringify(normalized));
    return normalized;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length < MOCK_PREPARED_CHEQUES.length) {
      const normalized = normalizePreparedList(MOCK_PREPARED_CHEQUES);
      localStorage.setItem(LS_PREP, JSON.stringify(normalized));
      return normalized;
    }
    return normalizePreparedList(parsed);
  } catch (e) {
    const normalized = normalizePreparedList(MOCK_PREPARED_CHEQUES);
    return normalized;
  }
}

export async function getPreparedCheque(id: string): Promise<ChequePrepare | null> {
  await delay(200);
  const list = await listPreparedCheques();
  return list.find((p) => p.id === id) ?? null;
}

export async function createPreparedCheque(
  payload: Omit<ChequePrepare, 'id' | 'createdAt'>
): Promise<ChequePrepare> {
  await delay(450);
  const all = await listPreparedCheques();
  const now = new Date().toISOString();

  const next: ChequePrepare = {
    ...payload,
    id: `prep-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now,
  };

  const updated = [next, ...all];
  localStorage.setItem(LS_PREP, JSON.stringify(updated));

  // Mark all cheque numbers in payload as used in their corresponding books
  const books = await listChequeBooks();
  for (const line of payload.lines) {
    if (!line.chequeNo) continue;
    const targetBook = books.find((b) =>
      b.cheques.some((c) => c.chequeNo === line.chequeNo)
    );
    if (targetBook) {
      const patchedCheques = targetBook.cheques.map((c) =>
        c.chequeNo === line.chequeNo
          ? { ...c, used: true, usedOnVoucherId: next.voucherId || next.id }
          : c
      );
      await updateChequeBook(targetBook.id, { cheques: patchedCheques });
    }
  }

  return next;
}

export async function voidPreparedCheque(id: string): Promise<void> {
  await delay(350);
  const all = await listPreparedCheques();
  const target = all.find((p) => p.id === id);

  if (!target) {
    throw new Error('Prepared cheque record not found');
  }

  // Free up all cheque numbers across all lines in this record
  const books = await listChequeBooks();
  for (const line of target.lines || []) {
    if (!line.chequeNo) continue;
    const targetBook = books.find((b) =>
      b.cheques.some((c) => c.chequeNo === line.chequeNo)
    );
    if (targetBook) {
      const patchedCheques = targetBook.cheques.map((c) =>
        c.chequeNo === line.chequeNo
          ? { ...c, used: false, usedOnVoucherId: undefined }
          : c
      );
      await updateChequeBook(targetBook.id, { cheques: patchedCheques });
    }
  }

  // Remove from register
  const remaining = all.filter((p) => p.id !== id);
  localStorage.setItem(LS_PREP, JSON.stringify(remaining));
}

export async function updatePreparedCheque(
  id: string,
  updates: Partial<ChequePrepare>
): Promise<ChequePrepare> {
  await delay(250);
  const all = await listPreparedCheques();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) {
    throw new Error('Prepared cheque record not found');
  }
  const updatedItem = { ...all[idx], ...updates };
  all[idx] = updatedItem;
  localStorage.setItem(LS_PREP, JSON.stringify(all));
  return updatedItem;
}

