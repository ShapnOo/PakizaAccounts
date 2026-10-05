import { Account } from '../../types/coa';

/**
 * Filter COA accounts for Advance Receive selection.
 * Matches accounts categorized under Advance, Deposit & Prepayments or Advance liability/asset accounts.
 */
export function filterForAdvanceReceive(accounts: Account[]): Account[] {
  return accounts.filter((acc) => {
    const type = (acc.accountsType || '').toLowerCase();
    const name = acc.name.toLowerCase();
    return (
      type.includes('advance') ||
      type.includes('deposit') ||
      name.includes('advance') ||
      name.includes('prepayment') ||
      name.includes('unearned')
    );
  });
}
