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
    date: '2026-09-01',
    narration: 'Depreciation charge on spinning machinery and factory vehicles for August 2026',
    totals: { debit: 185000, credit: 185000, debitBDT: 185000, creditBDT: 185000 },
    lines: [
      { id: 'l1', accountHeadId: 'acc-05-01-01', accountHeadName: 'Depreciation Expense - Machinery', debit: 145000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Plant machinery' },
      { id: 'l2', accountHeadId: 'acc-05-01-02', accountHeadName: 'Depreciation Expense - Vehicles', debit: 40000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Transport pool' },
      { id: 'l3', accountHeadId: 'acc-01-02-01', accountHeadName: 'Accumulated Depreciation - Machinery', debit: 0, credit: 145000, currency: 'BDT', exchangeRate: 1, description: 'Monthly allowance' },
      { id: 'l4', accountHeadId: 'acc-01-02-02', accountHeadName: 'Accumulated Depreciation - Vehicles', debit: 0, credit: 40000, currency: 'BDT', exchangeRate: 1, description: 'Monthly allowance' },
    ],
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'vch-2',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0042',
    date: '2026-09-03',
    narration: 'Yarn procurement payment to Square Yarns Ltd net of TDS 3%',
    totals: { debit: 450000, credit: 450000, debitBDT: 450000, creditBDT: 450000 },
    lines: [
      { id: 'l2-1', accountHeadId: 'acc-01-03-01', accountHeadName: 'Raw Materials Inventory - Yarn', debit: 450000, credit: 0, currency: 'BDT', exchangeRate: 1, description: '100% Cotton 30/1 Yarn' },
      { id: 'l2-2', accountHeadId: 'acc-02-01-03', accountHeadName: 'TDS Payable on Supplier Bills', debit: 0, credit: 13500, currency: 'BDT', exchangeRate: 1, description: 'TDS 3%' },
      { id: 'l2-3', accountHeadId: 'acc-01-01-01-02-01-01', accountHeadName: 'Cash at Bank DBBL', debit: 0, credit: 436500, currency: 'BDT', exchangeRate: 1, description: 'CQ26000001' },
    ],
    createdAt: '2026-09-03T11:30:00Z',
  },
  {
    id: 'vch-3',
    voucherType: 'Receive Voucher',
    voucherNumber: 'BRV-2026-0018',
    date: '2026-09-05',
    narration: 'Export proceeds remittance received from Next Sourcing Ltd UK',
    totals: { debit: 1185000, credit: 1185000, debitBDT: 1185000, creditBDT: 1185000 },
    lines: [
      { id: 'l3-1', accountHeadId: 'acc-01-01-01-02-01-03', accountHeadName: 'Standard Chartered USD Account', debit: 1185000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'SWIFT Inward USD 10,000 @ 118.50' },
      { id: 'l3-2', accountHeadId: 'acc-01-01-adv-01', accountHeadName: 'Accounts Receivable - Next Sourcing', debit: 0, credit: 1180000, currency: 'BDT', exchangeRate: 1, description: 'Invoice #EXP-88 settlement' },
      { id: 'l3-3', accountHeadId: 'acc-04-02-01', accountHeadName: 'Exchange Rate Gain / Loss', debit: 0, credit: 5000, currency: 'BDT', exchangeRate: 1, description: 'Realized FX gain' },
    ],
    createdAt: '2026-09-05T14:20:00Z',
  },
  {
    id: 'vch-4',
    voucherType: 'Contra Voucher',
    voucherNumber: 'CV-2026-0009',
    date: '2026-09-08',
    narration: 'Cash withdrawal from DBBL for Head Office petty cash replenishment',
    totals: { debit: 50000, credit: 50000, debitBDT: 50000, creditBDT: 50000 },
    lines: [
      { id: 'l4-1', accountHeadId: 'acc-01-01-01-01-01', accountHeadName: 'Petty Cash In Hand', debit: 50000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Replenishment self cheque' },
      { id: 'l4-2', accountHeadId: 'acc-01-01-01-02-01-01', accountHeadName: 'Cash at Bank DBBL', debit: 0, credit: 50000, currency: 'BDT', exchangeRate: 1, description: 'CQ26000002' },
    ],
    createdAt: '2026-09-08T09:15:00Z',
  },
  {
    id: 'vch-5',
    voucherType: 'Payment Voucher',
    voucherNumber: 'CPV-2026-0055',
    date: '2026-09-10',
    narration: 'Office refreshment, cleaning, and courier charges paid from petty cash',
    totals: { debit: 12500, credit: 12500, debitBDT: 12500, creditBDT: 12500 },
    lines: [
      { id: 'l5-1', accountHeadId: 'acc-05-02-01', accountHeadName: 'Office Refreshment Expense', debit: 6500, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Staff tea & coffee' },
      { id: 'l5-2', accountHeadId: 'acc-05-02-02', accountHeadName: 'Courier & Postage Charges', debit: 3800, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Sample document dispatch' },
      { id: 'l5-3', accountHeadId: 'acc-05-02-03', accountHeadName: 'General Office Cleaning Supplies', debit: 2200, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Toiletries & disinfectants' },
      { id: 'l5-4', accountHeadId: 'acc-01-01-01-01-01', accountHeadName: 'Petty Cash In Hand', debit: 0, credit: 12500, currency: 'BDT', exchangeRate: 1, description: 'Cash vouchers summary' },
    ],
    createdAt: '2026-09-10T16:00:00Z',
  },
  {
    id: 'vch-6',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0043',
    date: '2026-09-12',
    narration: 'Monthly industrial gas utility bill paid to Titas Gas Transmission Co.',
    totals: { debit: 745000, credit: 745000, debitBDT: 745000, creditBDT: 745000 },
    lines: [
      { id: 'l6-1', accountHeadId: 'acc-05-03-01', accountHeadName: 'Factory Gas & Electricity Expense', debit: 745000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Dhamrai Spinning Units' },
      { id: 'l6-2', accountHeadId: 'acc-01-01-01-02-01-05', accountHeadName: 'Cash at Bank EBL', debit: 0, credit: 745000, currency: 'BDT', exchangeRate: 1, description: 'EBL770201' },
    ],
    createdAt: '2026-09-12T11:00:00Z',
  },
  {
    id: 'vch-7',
    voucherType: 'Journal Voucher',
    voucherNumber: 'JV-2026-0002',
    date: '2026-09-15',
    narration: 'Accrual of monthly staff salaries & wages for August 2026',
    totals: { debit: 1250000, credit: 1250000, debitBDT: 1250000, creditBDT: 1250000 },
    lines: [
      { id: 'l7-1', accountHeadId: 'acc-05-04-01', accountHeadName: 'Executive & Staff Salaries', debit: 850000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Head office payroll' },
      { id: 'l7-2', accountHeadId: 'acc-05-04-02', accountHeadName: 'Factory Workers Wages', debit: 400000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Production floor payroll' },
      { id: 'l7-3', accountHeadId: 'acc-02-02-01', accountHeadName: 'Salaries & Wages Payable', debit: 0, credit: 1250000, currency: 'BDT', exchangeRate: 1, description: 'August salary liability' },
    ],
    createdAt: '2026-09-15T15:30:00Z',
  },
  {
    id: 'vch-8',
    voucherType: 'Receive Voucher',
    voucherNumber: 'CRV-2026-0012',
    date: '2026-09-18',
    narration: 'Cash receipt against scrap fabric and recycled yarn sale',
    totals: { debit: 65000, credit: 65000, debitBDT: 65000, creditBDT: 65000 },
    lines: [
      { id: 'l8-1', accountHeadId: 'acc-01-01-01-01-02', accountHeadName: 'General Cash In Hand', debit: 65000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'MR #00882' },
      { id: 'l8-2', accountHeadId: 'acc-04-01-02', accountHeadName: 'Scrap & Waste Sales Income', debit: 0, credit: 65000, currency: 'BDT', exchangeRate: 1, description: '4.5 tons mill waste' },
    ],
    createdAt: '2026-09-18T12:45:00Z',
  },
  {
    id: 'vch-9',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0044',
    date: '2026-09-20',
    narration: 'Advance income tax quarterly installment deposited via treasury challan',
    totals: { debit: 520000, credit: 520000, debitBDT: 520000, creditBDT: 520000 },
    lines: [
      { id: 'l9-1', accountHeadId: 'acc-01-04-01', accountHeadName: 'Advance Corporate Income Tax (AIT)', debit: 520000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Q1 FY 2026-2027 NBR Challan' },
      { id: 'l9-2', accountHeadId: 'acc-01-01-01-02-01-06', accountHeadName: 'Cash at Bank City Bank', debit: 0, credit: 520000, currency: 'BDT', exchangeRate: 1, description: 'CBL330011' },
    ],
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'vch-10',
    voucherType: 'Contra Voucher',
    voucherNumber: 'CV-2026-0010',
    date: '2026-09-22',
    narration: 'Fund transfer from DBBL CD Account to MTB Collection Account',
    totals: { debit: 300000, credit: 300000, debitBDT: 300000, creditBDT: 300000 },
    lines: [
      { id: 'l10-1', accountHeadId: 'acc-01-01-01-02-01-02', accountHeadName: 'Cash at Bank MTB', debit: 300000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Inter-bank fund transfer' },
      { id: 'l10-2', accountHeadId: 'acc-01-01-01-02-01-01', accountHeadName: 'Cash at Bank DBBL', debit: 0, credit: 300000, currency: 'BDT', exchangeRate: 1, description: 'Transfer auth #9012' },
    ],
    createdAt: '2026-09-22T14:10:00Z',
  },
  {
    id: 'vch-11',
    voucherType: 'Journal Voucher',
    voucherNumber: 'JV-2026-0003',
    date: '2026-09-25',
    narration: 'Adjustment of employee IOU advances against audited tour vouchers',
    totals: { debit: 85000, credit: 85000, debitBDT: 85000, creditBDT: 85000 },
    lines: [
      { id: 'l11-1', accountHeadId: 'acc-05-05-01', accountHeadName: 'Travel & Conveyance Expense', debit: 60000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Riazul Islam audit tour' },
      { id: 'l11-2', accountHeadId: 'acc-05-05-02', accountHeadName: 'Hotel & Accommodation Allowance', debit: 25000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Factory inspection stay' },
      { id: 'l11-3', accountHeadId: 'acc-01-01-adv', accountHeadName: 'Advance to Employees (IOU)', debit: 0, credit: 85000, currency: 'BDT', exchangeRate: 1, description: 'Settlement of MR/260000001' },
    ],
    createdAt: '2026-09-25T16:30:00Z',
  },
  {
    id: 'vch-12',
    voucherType: 'Receive Voucher',
    voucherNumber: 'BRV-2026-0019',
    date: '2026-09-27',
    narration: 'Customer collection received from Aarong Lifestyle Retailers via BEFTN',
    totals: { debit: 250000, credit: 250000, debitBDT: 250000, creditBDT: 250000 },
    lines: [
      { id: 'l12-1', accountHeadId: 'acc-01-01-01-02-01-06', accountHeadName: 'City Bank Ltd. Collection A/C', debit: 250000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'BEFTN transfer #EFT-8841' },
      { id: 'l12-2', accountHeadId: 'acc-01-01-adv-02', accountHeadName: 'Accounts Receivable - Aarong', debit: 0, credit: 250000, currency: 'BDT', exchangeRate: 1, description: 'Settlement of invoice #AAR-1029' },
    ],
    createdAt: '2026-09-27T11:15:00Z',
  },
  {
    id: 'vch-13',
    voucherType: 'Payment Voucher',
    voucherNumber: 'BPV-2026-0045',
    date: '2026-09-29',
    narration: 'Reactive dyes & chemicals consignment payment to Meghna Dyes Ltd.',
    totals: { debit: 185000, credit: 185000, debitBDT: 185000, creditBDT: 185000 },
    lines: [
      { id: 'l13-1', accountHeadId: 'acc-01-03-02', accountHeadName: 'Raw Materials - Dyes & Chemicals', debit: 185000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Bill #BL/260000005' },
      { id: 'l13-2', accountHeadId: 'acc-01-01-01-02-01-02', accountHeadName: 'Cash at Bank MTB', debit: 0, credit: 185000, currency: 'BDT', exchangeRate: 1, description: 'MTB500102' },
    ],
    createdAt: '2026-09-29T13:40:00Z',
  },
  {
    id: 'vch-14',
    voucherType: 'Journal Voucher',
    voucherNumber: 'JV-2026-0004',
    date: '2026-10-01',
    narration: 'Insurance premium amortized for September 2026 industrial fire policy',
    totals: { debit: 45000, credit: 45000, debitBDT: 45000, creditBDT: 45000 },
    lines: [
      { id: 'l14-1', accountHeadId: 'acc-05-06-01', accountHeadName: 'Factory Fire Insurance Expense', debit: 45000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Green Delta policy #GD-992' },
      { id: 'l14-2', accountHeadId: 'acc-01-05-01', accountHeadName: 'Prepaid Insurance & Expenses', debit: 0, credit: 45000, currency: 'BDT', exchangeRate: 1, description: 'Monthly amortization' },
    ],
    createdAt: '2026-10-01T09:00:00Z',
  },
];

const LOCAL_STORAGE_VOUCHERS_KEY = 'pakiza_vouchers_definitions_v1';
const LOCAL_STORAGE_POSTED_KEY = 'pakiza_posted_vouchers_v1';

export function getStoredVouchers(): VoucherDefinition[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VOUCHERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_VOUCHER_DEFINITIONS.length) {
        return parsed;
      }
    }
  } catch (e) {}
  localStorage.setItem(LOCAL_STORAGE_VOUCHERS_KEY, JSON.stringify(INITIAL_VOUCHER_DEFINITIONS));
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
      if (Array.isArray(parsed) && parsed.length >= INITIAL_POSTED_VOUCHERS.length) {
        return parsed;
      }
    }
  } catch (e) {}
  localStorage.setItem(LOCAL_STORAGE_POSTED_KEY, JSON.stringify(INITIAL_POSTED_VOUCHERS));
  return INITIAL_POSTED_VOUCHERS;
}

export function saveStoredPostedVouchers(entries: VoucherEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTED_KEY, JSON.stringify(entries));
  } catch (e) {}
}
