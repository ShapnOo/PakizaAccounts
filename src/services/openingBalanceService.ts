import { OpeningBalance, OpeningBalanceLine } from '../types/openingBalance';
import { MOCK_OPENING_BALANCE } from '../mock/openingBalance';
import { delay } from '../lib/delay';

const LS_KEY = 'ob:current';

export async function getOpeningBalance(): Promise<OpeningBalance> {
  await delay(300);
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse stored opening balance', err);
  }
  return MOCK_OPENING_BALANCE;
}

export async function saveOpeningBalance(
  payload: OpeningBalance
): Promise<OpeningBalance> {
  await delay(400);
  const next: OpeningBalance = {
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next;
}

export async function importOpeningBalance(
  fileRows: OpeningBalanceLine[]
): Promise<OpeningBalanceLine[]> {
  await delay(500);
  return fileRows;
}
