import { VoucherDefinition, VoucherEntry } from '../types/voucher';

export const INITIAL_VOUCHER_DEFINITIONS: VoucherDefinition[] = [
  {
    id: 'vdef-01',
    name: 'Journal Voucher',
    shortName: 'JV',
    voucherType: 'Journal Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
    narrationTemplate: 'Being general adjustment / accrual entry passed for {purpose} for the month of {month} {year}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-jv-1',
        title: 'General Expense Accrual',
        template: 'Being provision created for {purpose} bill for the period of {month} {year} payable to {party_name}.',
        isDefault: true,
      },
      {
        id: 'n-jv-2',
        title: 'Monthly Asset Depreciation',
        template: 'Being monthly depreciation provided on Fixed Assets under straight-line method for {month} {year}.',
        isDefault: false,
      },
      {
        id: 'n-jv-3',
        title: 'Rectification & Reclassification',
        template: 'Being ledger reclassification entry passed to rectify booking of {purpose} as per audit instruction.',
        isDefault: false,
      },
    ],
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
    narrationTemplate: 'Being cash payment disbursed to {party_name} against cash memo/bill #{invoice_no} for {purpose}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-cpv-1',
        title: 'Petty Cash Vendor Bill Settlement',
        template: 'Being cash payment disbursed to {party_name} against cash memo/bill #{invoice_no} for {purpose}.',
        isDefault: true,
      },
      {
        id: 'n-cpv-2',
        title: 'Daily Office Refreshments & Entertainment',
        template: 'Being cash disbursed for daily staff entertainment & office refreshment expenses.',
        isDefault: false,
      },
      {
        id: 'n-cpv-3',
        title: 'Local Travel & Conveyance Reimbursement',
        template: 'Being local travel, taxi, and conveyance expenses reimbursed to {party_name} for factory visit.',
        isDefault: false,
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
    narrationTemplate: 'Being cash collected from customer {party_name} against sales memo #{invoice_no}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-crv-1',
        title: 'Counter Cash Sales Collection',
        template: 'Being cash collected from counter customer {party_name} against sales memo #{invoice_no}.',
        isDefault: true,
      },
      {
        id: 'n-crv-2',
        title: 'Unspent Petty Cash Return',
        template: 'Being unspent petty cash advance returned to cashier by {party_name}.',
        isDefault: false,
      },
      {
        id: 'n-crv-3',
        title: 'Scrap & Waste Cash Sale',
        template: 'Being cash proceeds received from spot sale of factory scrap materials against receipt #{invoice_no}.',
        isDefault: false,
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
    narrationTemplate: 'Being payment made to {party_name} against bill/invoice #{invoice_no} via Cheque #{cheque_no} drawn on {bank_name}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-bpv-1',
        title: 'Supplier Cheque Bill Settlement',
        template: 'Being payment made to {party_name} against bill/invoice #{invoice_no} via Cheque #{cheque_no} drawn on {bank_name}.',
        isDefault: true,
      },
      {
        id: 'n-bpv-2',
        title: 'Office Rent Payment',
        template: 'Being monthly office rent paid to landlord {party_name} for the period of {month} {year} via Cheque #{cheque_no} drawn on {bank_name}.',
        isDefault: false,
      },
      {
        id: 'n-bpv-3',
        title: 'Utility & Power Bill Payment',
        template: 'Being payment cleared towards electricity / utility bill of {month} {year} to {party_name} from {bank_name}.',
        isDefault: false,
      },
      {
        id: 'n-bpv-4',
        title: 'Bank Charges & Excise Duty',
        template: 'Being bank maintenance fees and regulatory excise duty debited by {bank_name}.',
        isDefault: false,
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
    narrationTemplate: 'Being amount received from customer {party_name} against invoice #{invoice_no} deposited into {bank_name}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-brv-1',
        title: 'Customer Invoice Receipt',
        template: 'Being amount received from customer {party_name} against invoice #{invoice_no} deposited into {bank_name}.',
        isDefault: true,
      },
      {
        id: 'n-brv-2',
        title: 'Bank Interest & Profit Credit',
        template: 'Being quarterly savings account profit/interest credited directly by {bank_name}.',
        isDefault: false,
      },
      {
        id: 'n-brv-3',
        title: 'Customer Advance Deposit',
        template: 'Being order advance received from {party_name} deposited into {bank_name} account.',
        isDefault: false,
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
    narrationTemplate: 'Being cash deposited to / withdrawn from {bank_name} for office use via Cheque #{cheque_no}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-cv-1',
        title: 'Cash Deposit into Bank',
        template: 'Being cash withdrawn from petty cash / cash in hand deposited directly into {bank_name} account.',
        isDefault: true,
      },
      {
        id: 'n-cv-2',
        title: 'Cash Withdrawal for Petty Cash',
        template: 'Being cash withdrawn from {bank_name} via Self Cheque #{cheque_no} for office petty cash replenishment.',
        isDefault: false,
      },
      {
        id: 'n-cv-3',
        title: 'Inter-Bank Account Transfer',
        template: 'Being fund transfer made from primary account {bank_name} to operating branch account.',
        isDefault: false,
      },
    ],
  },
  {
    id: 'vdef-07',
    name: 'Foreign Currency Adjustment Voucher',
    shortName: 'FXV',
    voucherType: 'Journal Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
    narrationTemplate: 'Being exchange gain or loss recognized upon foreign currency revaluation at closing rate for {month} {year}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-fxv-1',
        title: 'Foreign Exchange Revaluation',
        template: 'Being exchange gain or loss recognized upon foreign currency revaluation at closing rate for {month} {year}.',
        isDefault: true,
      },
      {
        id: 'n-fxv-2',
        title: 'Export Proceeds Realization Gain/Loss',
        template: 'Being variance recognized on realization of export bill #{invoice_no} against standard exchange rate.',
        isDefault: false,
      },
    ],
  },
  {
    id: 'vdef-08',
    name: 'Employee Salary & Wages Voucher',
    shortName: 'SAL',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
    narrationTemplate: 'Being staff salary and allowances disbursed for the month of {month} {year} via bank transfer from {bank_name}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-sal-1',
        title: 'Monthly Staff Salary Disbursal',
        template: 'Being staff salary and allowances disbursed for the month of {month} {year} via bank transfer from {bank_name}.',
        isDefault: true,
      },
      {
        id: 'n-sal-2',
        title: 'Festival / Eid Bonus Payment',
        template: 'Being festival allowance and Eid bonus disbursed to all employees for {year} from {bank_name}.',
        isDefault: false,
      },
      {
        id: 'n-sal-3',
        title: 'Worker Overtime & Attendance Bonus',
        template: 'Being worker factory floor overtime and production bonus disbursed for {month} {year}.',
        isDefault: false,
      },
    ],
  },
  {
    id: 'vdef-09',
    name: 'Direct Tax & VAT Payment Voucher',
    shortName: 'TAXV',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
    narrationTemplate: 'Being statutory TDS / VDS deposited to Government Treasury via Challan for the month of {month} {year}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-tax-1',
        title: 'Treasury Challan VAT / TDS Payment',
        template: 'Being statutory TDS / VDS deposited to Government Treasury via Challan for the month of {month} {year}.',
        isDefault: true,
      },
      {
        id: 'n-tax-2',
        title: 'Quarterly Advance Income Tax (AIT)',
        template: 'Being quarterly Advance Income Tax installment deposited to National Board of Revenue via Treasury Challan.',
        isDefault: false,
      },
    ],
  },
  {
    id: 'vdef-10',
    name: 'Asset Depreciation & Amortization Voucher',
    shortName: 'DEPR',
    voucherType: 'Journal Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
    narrationTemplate: 'Being monthly depreciation provided on Fixed Assets under straight-line method for the period of {month} {year}.',
    autoNarrationEnabled: true,
    narrations: [
      {
        id: 'n-depr-1',
        title: 'Monthly Fixed Asset Depreciation',
        template: 'Being monthly depreciation provided on Fixed Assets under straight-line method for the period of {month} {year}.',
        isDefault: true,
      },
      {
        id: 'n-depr-2',
        title: 'ERP & Software License Amortization',
        template: 'Being intangible asset and ERP software subscription amortization booked for {month} {year}.',
        isDefault: false,
      },
    ],
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
    voucherNumber: 'PV-2026-0001',
    date: '2026-09-02',
    narration: 'Cheque payment to Meghna Fibre Mills for raw cotton lot procurement',
    totals: { debit: 420000, credit: 420000, debitBDT: 420000, creditBDT: 420000 },
    lines: [
      { id: 'l5', accountHeadId: 'acc-01-02-01', accountHeadName: 'Accounts Payable - Trade Creditors', debit: 420000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Invoice MF-8812' },
      { id: 'l6', accountHeadId: 'acc-01-01-01-02-01-01', accountHeadName: 'Cash at Bank DBBL', debit: 0, credit: 420000, currency: 'BDT', exchangeRate: 1, description: 'Cheque 441029' },
    ],
    createdAt: '2026-09-02T11:30:00Z',
  },
  {
    id: 'vch-3',
    voucherType: 'Receive Voucher',
    voucherNumber: 'RV-2026-0001',
    date: '2026-09-03',
    narration: 'Cash received from Apex Spinning against yarn sales consignment invoice',
    totals: { debit: 95000, credit: 95000, debitBDT: 95000, creditBDT: 95000 },
    lines: [
      { id: 'l7', accountHeadId: 'acc-01-01-01-01-01', accountHeadName: 'Petty Cash In Hand', debit: 95000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Counter deposit' },
      { id: 'l8', accountHeadId: 'acc-01-01-02-01', accountHeadName: 'Accounts Receivable - Customers', debit: 0, credit: 95000, currency: 'BDT', exchangeRate: 1, description: 'Invoice AS-3011' },
    ],
    createdAt: '2026-09-03T14:15:00Z',
  },
  {
    id: 'vch-4',
    voucherType: 'Contra Voucher',
    voucherNumber: 'CV-2026-0001',
    date: '2026-09-04',
    narration: 'Cash withdrawn from DBBL account for factory floor petty cash replenishment',
    totals: { debit: 50000, credit: 50000, debitBDT: 50000, creditBDT: 50000 },
    lines: [
      { id: 'l9', accountHeadId: 'acc-01-01-01-01-01', accountHeadName: 'Petty Cash In Hand', debit: 50000, credit: 0, currency: 'BDT', exchangeRate: 1, description: 'Petty cash top-up' },
      { id: 'l10', accountHeadId: 'acc-01-01-01-02-01-01', accountHeadName: 'Cash at Bank DBBL', debit: 0, credit: 50000, currency: 'BDT', exchangeRate: 1, description: 'Cheque 441030' },
    ],
    createdAt: '2026-09-04T16:00:00Z',
  },
];

const LOCAL_STORAGE_VOUCHERS_KEY = 'pakiza_voucher_definitions_v2';
const LOCAL_STORAGE_POSTED_KEY = 'pakiza_posted_vouchers_v1';

export function getStoredVouchers(): VoucherDefinition[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VOUCHERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_VOUCHER_DEFINITIONS.length) {
        return parsed.map((item: VoucherDefinition) => {
          const init = INITIAL_VOUCHER_DEFINITIONS.find((iv) => iv.id === item.id);
          return {
            ...item,
            narrationTemplate: item.narrationTemplate ?? init?.narrationTemplate ?? '',
            autoNarrationEnabled: item.autoNarrationEnabled ?? init?.autoNarrationEnabled ?? true,
            narrations: item.narrations && item.narrations.length > 0 ? item.narrations : (init?.narrations ?? []),
          };
        });
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

export function saveStoredPostedVouchers(data: VoucherEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTED_KEY, JSON.stringify(data));
  } catch (e) {}
}
