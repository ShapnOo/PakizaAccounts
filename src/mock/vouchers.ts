import { VoucherDefinition, VoucherEntry } from '../types/voucher';

export const INITIAL_VOUCHER_DEFINITIONS: VoucherDefinition[] = [
  {
    id: 'vdef-01',
    name: 'Journal Voucher',
    shortName: 'JV',
    voucherType: 'Journal Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
  {
    id: 'vdef-02',
    name: 'Cash Payment Voucher',
    shortName: 'CPV',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-01',
        accountId: 'acc-01-01-01-01-01',
        accountName: 'Petty Cash In Hand',
        nature: 'CR',
        companyId: 'PSL',
        active: true,
      },
      {
        id: 'da-02',
        accountId: 'acc-01-01-01-01-02',
        accountName: 'General Cash In Hand',
        nature: 'CR',
        companyId: 'PKCL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-03',
    name: 'Cash Receive Voucher',
    shortName: 'CRV',
    voucherType: 'Receive Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-03',
        accountId: 'acc-01-01-01-01-01',
        accountName: 'Petty Cash In Hand',
        nature: 'DR',
        companyId: 'PSL',
        active: true,
      },
      {
        id: 'da-04',
        accountId: 'acc-01-01-01-01-02',
        accountName: 'General Cash In Hand',
        nature: 'DR',
        companyId: 'PKCL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-04',
    name: 'Bank Payment Voucher',
    shortName: 'BPV',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-05',
        accountId: 'acc-01-01-01-02-01-01',
        accountName: 'Cash at Bank DBBL',
        nature: 'CR',
        companyId: 'PSL',
        active: true,
      },
      {
        id: 'da-06',
        accountId: 'acc-01-01-01-02-01-02',
        accountName: 'Cash at Bank MTB',
        nature: 'CR',
        companyId: 'PKCL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-05',
    name: 'Bank Receive Voucher',
    shortName: 'BRV',
    voucherType: 'Receive Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-07',
        accountId: 'acc-01-01-01-02-01-01',
        accountName: 'Cash at Bank DBBL',
        nature: 'DR',
        companyId: 'PSL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-06',
    name: 'Contra Voucher',
    shortName: 'CV',
    voucherType: 'Contra Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
  {
    id: 'vdef-07',
    name: 'Foreign Currency Adjustment Voucher',
    shortName: 'FXV',
    voucherType: 'Journal Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
  {
    id: 'vdef-08',
    name: 'Employee Salary & Wages Voucher',
    shortName: 'SAL',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
  {
    id: 'vdef-09',
    name: 'Direct Tax & VAT Payment Voucher',
    shortName: 'TAXV',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
  {
    id: 'vdef-10',
    name: 'Asset Depreciation & Amortization Voucher',
    shortName: 'DEPR',
    voucherType: 'Journal Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
];

export const INITIAL_POSTED_VOUCHERS: VoucherEntry[] = [
  {
    id: 'vch-1',
    voucherType: 'Journal Voucher',
    voucherNumber: 'JV-2026-0001',
    voucherDate: '2026-09-01',
    status: 'Approved',
    narration: 'Depreciation charge on spinning machinery and factory vehicles for August 2026',
    totalDebit: 185000,
    totalCredit: 185000,
    lines: [
      { id: 'l1', accountId: 'acc-05-01-01', accountName: 'Depreciation Expense - Machinery', debit: 145000, credit: 0, narration: 'Plant machinery' },
      { id: 'l2', accountId: 'acc-05-01-02', accountName: 'Depreciation Expense - Vehicles', debit: 40000, credit: 0, narration: 'Transport pool' },
      { id: 'l3', accountId: 'acc-01-02-01', accountName: 'Accumulated Depreciation - Machinery', debit: 0, credit: 145000, narration: 'Monthly allowance' },
      { id: 'l4', accountId: 'acc-01-02-02', accountName: 'Accumulated Depreciation - Vehicles', debit: 0, credit: 40000, narration: 'Monthly allowance' },
    ],
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'vch-2',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0042',
    voucherDate: '2026-09-03',
    status: 'Approved',
    narration: 'Yarn procurement payment to Square Yarns Ltd net of TDS 3%',
    totalDebit: 450000,
    totalCredit: 450000,
    lines: [
      { id: 'l2-1', accountId: 'acc-01-03-01', accountName: 'Raw Materials Inventory - Yarn', debit: 450000, credit: 0, narration: '100% Cotton 30/1 Yarn' },
      { id: 'l2-2', accountId: 'acc-02-01-03', accountName: 'TDS Payable on Supplier Bills', debit: 0, credit: 13500, narration: 'TDS 3%' },
      { id: 'l2-3', accountId: 'acc-01-01-01-02-01-01', accountName: 'Cash at Bank DBBL', debit: 0, credit: 436500, narration: 'CQ26000001' },
    ],
    createdAt: '2026-09-03T11:30:00Z',
  },
  {
    id: 'vch-3',
    voucherType: 'Receive Voucher',
    voucherNumber: 'BRV-2026-0018',
    voucherDate: '2026-09-05',
    status: 'Approved',
    narration: 'Export proceeds remittance received from Next Sourcing Ltd UK',
    totalDebit: 1185000,
    totalCredit: 1185000,
    lines: [
      { id: 'l3-1', accountId: 'acc-01-01-01-02-01-03', accountName: 'Standard Chartered USD Account', debit: 1185000, credit: 0, narration: 'SWIFT Inward USD 10,000 @ 118.50' },
      { id: 'l3-2', accountId: 'acc-01-01-adv-01', accountName: 'Accounts Receivable - Next Sourcing', debit: 0, credit: 1180000, narration: 'Invoice #EXP-88 settlement' },
      { id: 'l3-3', accountId: 'acc-04-02-01', accountName: 'Exchange Rate Gain / Loss', debit: 0, credit: 5000, narration: 'Realized FX gain' },
    ],
    createdAt: '2026-09-05T14:20:00Z',
  },
  {
    id: 'vch-4',
    voucherType: 'Contra Voucher',
    voucherNumber: 'CV-2026-0009',
    voucherDate: '2026-09-08',
    status: 'Approved',
    narration: 'Cash withdrawal from DBBL for Head Office petty cash replenishment',
    totalDebit: 50000,
    totalCredit: 50000,
    lines: [
      { id: 'l4-1', accountId: 'acc-01-01-01-01-01', accountName: 'Petty Cash In Hand', debit: 50000, credit: 0, narration: 'Replenishment self cheque' },
      { id: 'l4-2', accountId: 'acc-01-01-01-02-01-01', accountName: 'Cash at Bank DBBL', debit: 0, credit: 50000, narration: 'CQ26000002' },
    ],
    createdAt: '2026-09-08T09:15:00Z',
  },
  {
    id: 'vch-5',
    voucherType: 'Payment Voucher',
    voucherNumber: 'CPV-2026-0055',
    voucherDate: '2026-09-10',
    status: 'Approved',
    narration: 'Office refreshment, cleaning, and courier charges paid from petty cash',
    totalDebit: 12500,
    totalCredit: 12500,
    lines: [
      { id: 'l5-1', accountId: 'acc-05-02-01', accountName: 'Office Refreshment Expense', debit: 6500, credit: 0, narration: 'Staff tea & coffee' },
      { id: 'l5-2', accountId: 'acc-05-02-02', accountName: 'Courier & Postage Charges', debit: 3800, credit: 0, narration: 'Sample document dispatch' },
      { id: 'l5-3', accountId: 'acc-05-02-03', accountName: 'General Office Cleaning Supplies', debit: 2200, credit: 0, narration: 'Toiletries & disinfectants' },
      { id: 'l5-4', accountId: 'acc-01-01-01-01-01', accountName: 'Petty Cash In Hand', debit: 0, credit: 12500, narration: 'Cash vouchers summary' },
    ],
    createdAt: '2026-09-10T16:00:00Z',
  },
  {
    id: 'vch-6',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0043',
    voucherDate: '2026-09-12',
    status: 'Approved',
    narration: 'Monthly industrial gas utility bill paid to Titas Gas Transmission Co.',
    totalDebit: 745000,
    totalCredit: 745000,
    lines: [
      { id: 'l6-1', accountId: 'acc-05-03-01', accountName: 'Factory Gas & Electricity Expense', debit: 745000, credit: 0, narration: 'Dhamrai Spinning Units' },
      { id: 'l6-2', accountId: 'acc-01-01-01-02-01-05', accountName: 'Cash at Bank EBL', debit: 0, credit: 745000, narration: 'EBL770201' },
    ],
    createdAt: '2026-09-12T11:00:00Z',
  },
  {
    id: 'vch-7',
    voucherType: 'Journal Voucher',
    voucherNumber: 'JV-2026-0002',
    voucherDate: '2026-09-15',
    status: 'Approved',
    narration: 'Accrual of monthly staff salaries & wages for August 2026',
    totalDebit: 1250000,
    totalCredit: 1250000,
    lines: [
      { id: 'l7-1', accountId: 'acc-05-04-01', accountName: 'Executive & Staff Salaries', debit: 850000, credit: 0, narration: 'Head office payroll' },
      { id: 'l7-2', accountId: 'acc-05-04-02', accountName: 'Factory Workers Wages', debit: 400000, credit: 0, narration: 'Production floor payroll' },
      { id: 'l7-3', accountId: 'acc-02-02-01', accountName: 'Salaries & Wages Payable', debit: 0, credit: 1250000, narration: 'August salary liability' },
    ],
    createdAt: '2026-09-15T15:30:00Z',
  },
  {
    id: 'vch-8',
    voucherType: 'Receive Voucher',
    voucherNumber: 'CRV-2026-0012',
    voucherDate: '2026-09-18',
    status: 'Approved',
    narration: 'Cash receipt against scrap fabric and recycled yarn sale',
    totalDebit: 65000,
    totalCredit: 65000,
    lines: [
      { id: 'l8-1', accountId: 'acc-01-01-01-01-02', accountName: 'General Cash In Hand', debit: 65000, credit: 0, narration: 'MR #00882' },
      { id: 'l8-2', accountId: 'acc-04-01-02', accountName: 'Scrap & Waste Sales Income', debit: 0, credit: 65000, narration: '4.5 tons mill waste' },
    ],
    createdAt: '2026-09-18T12:45:00Z',
  },
  {
    id: 'vch-9',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0044',
    voucherDate: '2026-09-20',
    status: 'Approved',
    narration: 'Advance income tax quarterly installment deposited via treasury challan',
    totalDebit: 520000,
    totalCredit: 520000,
    lines: [
      { id: 'l9-1', accountId: 'acc-01-04-01', accountName: 'Advance Corporate Income Tax (AIT)', debit: 520000, credit: 0, narration: 'Q1 FY 2026-2027 NBR Challan' },
      { id: 'l9-2', accountId: 'acc-01-01-01-02-01-06', accountName: 'Cash at Bank City Bank', debit: 0, credit: 520000, narration: 'CBL330011' },
    ],
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'vch-10',
    voucherType: 'Contra Voucher',
    voucherNumber: 'CV-2026-0010',
    voucherDate: '2026-09-22',
    status: 'Approved',
    narration: 'Fund transfer from DBBL CD Account to MTB Collection Account',
    totalDebit: 300000,
    totalCredit: 300000,
    lines: [
      { id: 'l10-1', accountId: 'acc-01-01-01-02-01-02', accountName: 'Cash at Bank MTB', debit: 300000, credit: 0, narration: 'Inter-bank fund transfer' },
      { id: 'l10-2', accountId: 'acc-01-01-01-02-01-01', accountName: 'Cash at Bank DBBL', debit: 0, credit: 300000, narration: 'Transfer auth #9012' },
    ],
    createdAt: '2026-09-22T14:10:00Z',
  },
  {
    id: 'vch-11',
    voucherType: 'Journal Voucher',
    voucherNumber: 'JV-2026-0003',
    voucherDate: '2026-09-25',
    status: 'Approved',
    narration: 'Adjustment of employee IOU advances against audited tour vouchers',
    totalDebit: 85000,
    totalCredit: 85000,
    lines: [
      { id: 'l11-1', accountId: 'acc-05-05-01', accountName: 'Travel & Conveyance Expense', debit: 60000, credit: 0, narration: 'Riazul Islam audit tour' },
      { id: 'l11-2', accountId: 'acc-05-05-02', accountName: 'Hotel & Accommodation Allowance', debit: 25000, credit: 0, narration: 'Factory inspection stay' },
      { id: 'l11-3', accountId: 'acc-01-01-adv', accountName: 'Advance to Employees (IOU)', debit: 0, credit: 85000, narration: 'Settlement of MR/260000001' },
    ],
    createdAt: '2026-09-25T16:30:00Z',
  },
  {
    id: 'vch-12',
    voucherType: 'Receive Voucher',
    voucherNumber: 'BRV-2026-0019',
    voucherDate: '2026-09-27',
    status: 'Approved',
    narration: 'Customer collection received from Aarong Lifestyle Retailers via BEFTN',
    totalDebit: 250000,
    totalCredit: 250000,
    lines: [
      { id: 'l12-1', accountId: 'acc-01-01-01-02-01-06', accountName: 'City Bank Ltd. Collection A/C', debit: 250000, credit: 0, narration: 'BEFTN transfer #EFT-8841' },
      { id: 'l12-2', accountId: 'acc-01-01-adv-02', accountName: 'Accounts Receivable - Aarong', debit: 0, credit: 250000, narration: 'Settlement of invoice #AAR-1029' },
    ],
    createdAt: '2026-09-27T11:15:00Z',
  },
  {
    id: 'vch-13',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0045',
    voucherDate: '2026-09-29',
    status: 'Pending',
    narration: 'Reactive dyes & chemicals consignment payment to Meghna Dyes Ltd.',
    totalDebit: 185000,
    totalCredit: 185000,
    lines: [
      { id: 'l13-1', accountId: 'acc-01-03-02', accountName: 'Raw Materials - Dyes & Chemicals', debit: 185000, credit: 0, narration: 'Bill #BL/260000005' },
      { id: 'l13-2', accountId: 'acc-01-01-01-02-01-02', accountName: 'Cash at Bank MTB', debit: 0, credit: 185000, narration: 'MTB500102' },
    ],
    createdAt: '2026-09-29T13:40:00Z',
  },
  {
    id: 'vch-14',
    voucherType: 'Journal Voucher',
    voucherNumber: 'JV-2026-0004',
    voucherDate: '2026-10-01',
    status: 'Draft',
    narration: 'Insurance premium amortized for September 2026 industrial fire policy',
    totalDebit: 45000,
    totalCredit: 45000,
    lines: [
      { id: 'l14-1', accountId: 'acc-05-06-01', accountName: 'Factory Fire Insurance Expense', debit: 45000, credit: 0, narration: 'Green Delta policy #GD-992' },
      { id: 'l14-2', accountId: 'acc-01-05-01', accountName: 'Prepaid Insurance & Expenses', debit: 0, credit: 45000, narration: 'Monthly amortization' },
    ],
    createdAt: '2026-10-01T09:00:00Z',
  },
];

const LOCAL_STORAGE_VOUCHERS_KEY = 'pakiza_vouchers_definitions_v1';
const LOCAL_STORAGE_POSTED_KEY = 'pakiza_posted_vouchers_v1';

export function getStoredVouchers(): VoucherDefinition[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VOUCHERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_VOUCHER_DEFINITIONS;
}

export function saveStoredVouchers(data: VoucherDefinition[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_VOUCHERS_KEY, JSON.stringify(data));
  } catch (e) {}
}

export function getStoredPostedVouchers(): VoucherEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_POSTED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_POSTED_VOUCHERS;
}

export function saveStoredPostedVouchers(entries: VoucherEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTED_KEY, JSON.stringify(entries));
  } catch (e) {}
}
