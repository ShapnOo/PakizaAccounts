import { CurrencyMaster } from '../types/currency';
import { CURRENCY_MASTER } from '../mock/currencyMaster';
import { delay } from '../lib/delay';

export async function listCurrencyMaster(): Promise<CurrencyMaster[]> {
  await delay(150);
  return CURRENCY_MASTER;
}
