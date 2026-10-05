import { delay } from '../lib/delay';

export async function getActiveFiscalYear(): Promise<string> {
  await delay(100);
  return localStorage.getItem('config:fy') ?? '2026-2027';
}
