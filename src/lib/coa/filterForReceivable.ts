import { Account } from '../../types/coa';

/**
 * Filter COA accounts for Accounts Receivable selection.
 * Matches accounts categorized under Trade & Others Receivable, Accounts Receivable, or current asset receivable accounts.
 */
export function filterForReceivable(accounts: Account[]): Account[] {
  return accounts.filter((acc) => {
    const type = (acc.accountsType || '').toLowerCase();
    const name = acc.name.toLowerCase();
    return (
      type.includes('receivable') ||
      type.includes('trade') ||
      name.includes('receivable') ||
      name.includes('debtor') ||
      name.includes('customer')
    );
  });
}
