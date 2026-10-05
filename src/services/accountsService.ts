import { AccountOption } from '../types/openingBalance';
import { MOCK_ACCOUNTS } from '../mock/accounts';
import { delay } from '../lib/delay';

export async function listAccounts(): Promise<AccountOption[]> {
  await delay(200);
  return MOCK_ACCOUNTS;
}
