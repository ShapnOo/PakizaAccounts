import { PreparedCheque } from '../types/cheque';
import { MOCK_PREPARED_CHEQUES } from '../mock/preparedCheques';
import { delay } from '../lib/delay';
import { markChequeUsed, markChequeUnused } from './chequeBookService';

const LS_PREP = 'prepared-cheques';

export async function listPreparedCheques(): Promise<PreparedCheque[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_PREP);
  if (!raw) {
    localStorage.setItem(LS_PREP, JSON.stringify(MOCK_PREPARED_CHEQUES));
    return MOCK_PREPARED_CHEQUES;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return MOCK_PREPARED_CHEQUES;
  }
}

export async function getPreparedCheque(id: string): Promise<PreparedCheque | null> {
  await delay(200);
  const list = await listPreparedCheques();
  return list.find((p) => p.id === id) ?? null;
}

export async function createPreparedCheque(
  payload: Omit<PreparedCheque, 'id' | 'createdAt'>
): Promise<PreparedCheque> {
  await delay(450);
  const all = await listPreparedCheques();
  const now = new Date().toISOString();

  const next: PreparedCheque = {
    ...payload,
    id: `prep-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now,
  };

  const updated = [next, ...all];
  localStorage.setItem(LS_PREP, JSON.stringify(updated));

  // Mark the cheque as used in the underlying book
  await markChequeUsed(payload.chequeBookId, payload.chequeNo, next.id);

  return next;
}

export async function voidPreparedCheque(id: string): Promise<void> {
  await delay(350);
  const all = await listPreparedCheques();
  const target = all.find((p) => p.id === id);

  if (!target) {
    throw new Error('Prepared cheque record not found');
  }

  // Free up the cheque number in its book (used -> false)
  await markChequeUnused(target.chequeBookId, target.chequeNo);

  // Remove from register
  const remaining = all.filter((p) => p.id !== id);
  localStorage.setItem(LS_PREP, JSON.stringify(remaining));
}
