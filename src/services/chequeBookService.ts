import { ChequeBook } from '../types/cheque';
import { MOCK_CHEQUE_BOOKS } from '../mock/chequeBooks';
import { delay } from '../lib/delay';

const LS_BOOKS = 'cheque-books';

export async function listChequeBooks(): Promise<ChequeBook[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_BOOKS);
  if (!raw) {
    localStorage.setItem(LS_BOOKS, JSON.stringify(MOCK_CHEQUE_BOOKS));
    return MOCK_CHEQUE_BOOKS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return MOCK_CHEQUE_BOOKS;
  }
}

export async function getChequeBook(id: string): Promise<ChequeBook | null> {
  await delay(200);
  const books = await listChequeBooks();
  return books.find((b) => b.id === id) ?? null;
}

export async function createChequeBook(
  payload: Omit<ChequeBook, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ChequeBook> {
  await delay(400);
  const all = await listChequeBooks();

  // Validate no duplicate first cheque number across books
  const duplicate = all.some(
    (b) => b.firstChequeNo.toLowerCase() === payload.firstChequeNo.toLowerCase()
  );
  if (duplicate) {
    throw new Error(`A cheque book starting with "${payload.firstChequeNo}" already exists.`);
  }

  const now = new Date().toISOString();
  const next: ChequeBook = {
    ...payload,
    id: `cb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [next, ...all];
  localStorage.setItem(LS_BOOKS, JSON.stringify(updated));
  return next;
}

export async function updateChequeBook(
  id: string,
  patch: Partial<ChequeBook>
): Promise<ChequeBook> {
  await delay(350);
  const all = await listChequeBooks();
  const now = new Date().toISOString();

  let target: ChequeBook | null = null;
  const updated = all.map((b) => {
    if (b.id === id) {
      target = { ...b, ...patch, updatedAt: now };
      return target;
    }
    return b;
  });

  if (!target) {
    throw new Error('Cheque book not found');
  }

  localStorage.setItem(LS_BOOKS, JSON.stringify(updated));
  return target;
}

export async function deleteChequeBook(id: string): Promise<void> {
  await delay(300);
  const all = await listChequeBooks();
  const target = all.find((b) => b.id === id);

  if (target && target.cheques.some((c) => c.used)) {
    throw new Error('Cannot delete a cheque book that contains already consumed/used cheques.');
  }

  const remaining = all.filter((b) => b.id !== id);
  localStorage.setItem(LS_BOOKS, JSON.stringify(remaining));
}

export async function markChequeUsed(
  bookId: string,
  chequeNo: string,
  voucherId?: string
): Promise<void> {
  const all = await listChequeBooks();
  const updated = all.map((b) => {
    if (b.id === bookId) {
      return {
        ...b,
        cheques: b.cheques.map((c) =>
          c.chequeNo === chequeNo
            ? { ...c, used: true, usedOnVoucherId: voucherId || 'manual' }
            : c
        ),
        updatedAt: new Date().toISOString(),
      };
    }
    return b;
  });
  localStorage.setItem(LS_BOOKS, JSON.stringify(updated));
}

export async function markChequeUnused(
  bookId: string,
  chequeNo: string
): Promise<void> {
  const all = await listChequeBooks();
  const updated = all.map((b) => {
    if (b.id === bookId) {
      return {
        ...b,
        cheques: b.cheques.map((c) =>
          c.chequeNo === chequeNo
            ? { ...c, used: false, usedOnVoucherId: undefined }
            : c
        ),
        updatedAt: new Date().toISOString(),
      };
    }
    return b;
  });
  localStorage.setItem(LS_BOOKS, JSON.stringify(updated));
}
