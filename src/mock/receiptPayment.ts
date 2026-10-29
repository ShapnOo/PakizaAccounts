import {
  RPFilterState,
  RPTransaction,
  BreakdownItem,
} from '../types/receiptPayment';

export const MOCK_RP_FILTERS: RPFilterState = {
  reportType: 'Comprehensive',
  accountsType: 'Cash & Cash Equivalent',
  approvalStatus: 'All',
  currency: 'BDT',
  dateRangePreset: 'This Month',
  startDate: '2026-10-01',
  endDate: '2026-10-20',
  accountsDetailsTypes: ['Cash', 'Non-Restricted Bank'],
  valueShowIn: 'N/A',
  accountsHead: '',
  advancedFilterCollapsed: true, // Collapsed by default as requested!
};

export const MOCK_OPENING_BREAKDOWN: BreakdownItem[] = [
  { key: 'cash', label: 'Cash', amount: 1200000 },
  { key: 'bank', label: 'Bank', amount: 1200000 },
  { key: 'cashEquivalent', label: 'Cash Equivalent', amount: 1200000 },
];

export const MOCK_RECEIPT_TRANSACTIONS: RPTransaction[] = [
  {
    id: 'rcpt-1',
    date: '2026-10-01',
    voucherNo: 'RV2600001',
    particulars: 'Being the amount receive from H/O',
    oppositeAccounts: 'General Cash',
    amount: 200000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
];

export const MOCK_PAYMENT_TRANSACTIONS: RPTransaction[] = [
  {
    id: 'pmt-1',
    date: '2026-10-10',
    voucherNo: 'PV2600001',
    particulars: 'Being the payment for Stationery',
    oppositeAccounts: 'Stationery expenses',
    amount: 20000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
  {
    id: 'pmt-2',
    date: '2026-10-11',
    voucherNo: 'PV2600002',
    particulars: 'Being the payment for Daily Labour',
    oppositeAccounts: 'Daily Labour',
    amount: 20000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
  {
    id: 'pmt-3',
    date: '2026-10-12',
    voucherNo: 'PV2600003',
    particulars: 'Being the payment for IOU',
    oppositeAccounts: 'Advance Against IOU',
    amount: 25000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
  {
    id: 'pmt-4',
    date: '2026-10-14',
    voucherNo: 'PV2600004',
    particulars: 'Being the payment for Office Expense',
    oppositeAccounts: 'Stationery expenses',
    amount: 15000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
  {
    id: 'pmt-5',
    date: '2026-10-15',
    voucherNo: 'PV2600005',
    particulars: 'Being the payment for Printing & Paper',
    oppositeAccounts: 'Stationery expenses',
    amount: 30000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
  {
    id: 'pmt-6',
    date: '2026-10-16',
    voucherNo: 'PV2600006',
    particulars: 'Being the payment for Toner & Cartridge',
    oppositeAccounts: 'Stationery expenses',
    amount: 25000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
  {
    id: 'pmt-7',
    date: '2026-10-17',
    voucherNo: 'PV2600007',
    particulars: 'Being the payment for Computer Supplies',
    oppositeAccounts: 'Stationery expenses',
    amount: 15000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
  {
    id: 'pmt-8',
    date: '2026-10-18',
    voucherNo: 'PV2600008',
    particulars: 'Being the payment for Notebooks & Files',
    oppositeAccounts: 'Stationery expenses',
    amount: 25000,
    accountType: 'Cash',
    approvalStatus: 'Approved',
  },
];
