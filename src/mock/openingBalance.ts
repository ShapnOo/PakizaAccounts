import { OpeningBalance } from '../types/openingBalance';

export const MOCK_OPENING_BALANCE: OpeningBalance = {
  id: 'ob-1',
  openingDate: '2026-07-01',
  lines: [
    {
      id: 'l1',
      accountHeadId: 'acc-01-01-adv',
      subsidiaryId: 's1',
      costCenterId: 'cc-1',
      employeeId: 'emp-101',
      reference: 'PO-2026-091',
      description: 'Advance payment for packaging materials',
      currency: 'BDT',
      exchangeRate: 1,
      debitBDT: 150000,
    },
    {
      id: 'l2',
      accountHeadId: 'acc-01-01-01-01',
      costCenterId: 'cc-1',
      reference: 'CASH-MAIN',
      description: 'Head office operational petty cash float',
      currency: 'BDT',
      exchangeRate: 1,
      debitBDT: 50000,
    },
    {
      id: 'l3',
      accountHeadId: 'acc-02-01-adv',
      subsidiaryId: 's2',
      costCenterId: 'cc-1',
      reference: 'SO-2026-441',
      description: 'Customer advance received for export fabrics order',
      currency: 'BDT',
      exchangeRate: 1,
      creditBDT: 200000,
    },
  ],
  note: 'Initial fiscal year 2026-2027 opening balance configuration for Pakiza Software Ltd.',
  updatedAt: new Date().toISOString(),
};
