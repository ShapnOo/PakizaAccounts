import { MOCK_COA_BANK_ACCOUNTS, CoaBankAccount } from '../mock/coaBankAccounts';
import { INITIAL_ACCOUNTS } from '../mock/accounts';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listCoaBankAccounts(): Promise<CoaBankAccount[]> {
  await delay(200);

  // Read live stored accounts or fallback to initial
  const raw = localStorage.getItem('pakiza_accounts_list');
  if (raw) {
    try {
      const stored = JSON.parse(raw);
      const bankAccounts = stored.filter((a: any) => a.detailsType === 'Bank');
      if (bankAccounts.length > 0) {
        return bankAccounts.map((a: any) => ({
          id: a.id,
          accountName: a.name,
          accountsType: a.bankDetails?.accountType || 'CD',
          accountsNumber: a.bankDetails?.accountNumber || a.code.slice(-9),
          bankName: a.bankDetails?.bankName || a.name,
          parentPath: a.path || [],
        }));
      }
    } catch (e) {
      // ignore
    }
  }

  return MOCK_COA_BANK_ACCOUNTS;
}
