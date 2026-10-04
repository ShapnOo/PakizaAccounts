export type Nature = 'Assets' | 'Liabilities' | 'Equity' | 'Income' | 'Expenses';

export interface AccountsTypeNode {
  nature: Nature;
  natureCode: string; // '01', '02', '03', '04', '05'
  category?: string;
  categoryRaw?: string;
  type: string;
  typeRaw?: string;
  detailsTypeOptions?: string[];
  detailsMandatory: boolean;
}

export const BASE_DIGIT = 2;
export const MAX_LEVEL = 6;
export const MAX_CODE_LEN = BASE_DIGIT * MAX_LEVEL; // 12
export const COMPANY = 'Pakiza Software Ltd.';
export const DEFAULT_CURRENCY = 'BDT';

export const NATURE_CODES: Record<Nature, string> = {
  Assets: '01',
  Liabilities: '02',
  Equity: '03',
  Income: '04',
  Expenses: '05',
};

export const ACCOUNTS_TYPE_TREE: AccountsTypeNode[] = [
  // ── NATURE: Assets ──
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Current Assets',
    type: 'Trade & Others Receivable',
    detailsTypeOptions: ['Accounts Receivable', 'Others Receivable'],
    detailsMandatory: true,
  },
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Current Assets',
    type: 'Cash & Cash Equivalent',
    detailsTypeOptions: ['Bank', 'Cash'],
    detailsMandatory: true,
  },
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Current Assets',
    type: 'Inventory',
    detailsMandatory: false,
  },
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Current Assets',
    type: 'Advance, Deposit & Prepayments',
    detailsMandatory: false,
  },
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Current Assets',
    type: 'Others Current Assets',
    detailsMandatory: false,
  },
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Non-Current Assets',
    type: 'Fixed Assets',
    detailsMandatory: false,
  },
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Non-Current Assets',
    type: 'Intangible Assets',
    typeRaw: 'Intengible Assets',
    detailsMandatory: false,
  },
  {
    nature: 'Assets',
    natureCode: '01',
    category: 'Non-Current Assets',
    type: 'Others Non-Current Assets',
    detailsMandatory: false,
  },

  // ── NATURE: Liabilities ──
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Current Liabilities',
    type: 'Trade and Other Payables',
    detailsTypeOptions: ['Accounts Payable', 'Others Payable'],
    detailsMandatory: true,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Current Liabilities',
    type: 'Clearing Accounts',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Current Liabilities',
    type: 'Deferred income/revenue',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Current Liabilities',
    type: 'Provision for Expenses',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Current Liabilities',
    type: 'Accrued Liabilities',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Current Liabilities',
    type: 'Short Term Loan',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Current Liabilities',
    type: 'Others Current Liabilities',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Non-Current Liabilities',
    type: 'Long Term Loan',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Non-Current Liabilities',
    type: 'Accumulated Depreciation',
    detailsMandatory: false,
  },
  {
    nature: 'Liabilities',
    natureCode: '02',
    category: 'Non-Current Liabilities',
    type: 'Others Non-Current Liabilities',
    detailsMandatory: false,
  },

  // ── NATURE: Equity ──
  {
    nature: 'Equity',
    natureCode: '03',
    type: 'Share Equity',
    detailsMandatory: false,
  },
  {
    nature: 'Equity',
    natureCode: '03',
    type: 'Current Year Earnings',
    detailsMandatory: false,
  },
  {
    nature: 'Equity',
    natureCode: '03',
    type: 'Reserve & Surplus',
    detailsMandatory: false,
  },

  // ── NATURE: Income ──
  {
    nature: 'Income',
    natureCode: '04',
    category: 'Operating Income',
    type: 'Sales Revenue',
    detailsMandatory: false,
  },
  {
    nature: 'Income',
    natureCode: '04',
    category: 'Operating Income',
    type: 'Service Revenue',
    detailsMandatory: false,
  },
  {
    nature: 'Income',
    natureCode: '04',
    category: 'Operating Income',
    type: 'Others Operating Income',
    detailsMandatory: false,
  },
  {
    nature: 'Income',
    natureCode: '04',
    category: 'Non-Operating Income',
    type: 'Exchange Gain/Loss',
    detailsMandatory: false,
  },
  {
    nature: 'Income',
    natureCode: '04',
    category: 'Non-Operating Income',
    type: 'Revenue from Scraps/Wastage Sales',
    detailsMandatory: false,
  },
  {
    nature: 'Income',
    natureCode: '04',
    category: 'Non-Operating Income',
    type: 'Others Non-Operating Income',
    typeRaw: 'Othes Non-Operating Income',
    detailsMandatory: false,
  },

  // ── NATURE: Expenses ──
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Direct Expenses',
    type: 'Cost of Revenue',
    detailsTypeOptions: ['Cost of Raw Materials', 'Overhead'],
    detailsMandatory: true,
  },
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Direct Expenses',
    type: 'Depreciation Direct',
    detailsMandatory: false,
  },
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Direct Expenses',
    type: 'Others Direct Expenses',
    typeRaw: 'Othes Direct Expenses',
    detailsMandatory: false,
  },
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Indirect Expenses',
    categoryRaw: 'Idirect Expenses',
    type: 'Administrative Expenses',
    detailsMandatory: false,
  },
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Indirect Expenses',
    categoryRaw: 'Idirect Expenses',
    type: 'Selling and Distribution Expenses',
    detailsMandatory: false,
  },
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Indirect Expenses',
    categoryRaw: 'Idirect Expenses',
    type: 'Financial Expenses',
    detailsMandatory: false,
  },
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Indirect Expenses',
    categoryRaw: 'Idirect Expenses',
    type: 'Depreciation Indirect',
    detailsMandatory: false,
  },
  {
    nature: 'Expenses',
    natureCode: '05',
    category: 'Indirect Expenses',
    categoryRaw: 'Idirect Expenses',
    type: 'Others Indirect Expenses',
    detailsMandatory: false,
  },
];

/**
 * The 4 Accounts Types that strictly require Details Type:
 * 1. Trade & Others Receivable
 * 2. Cash & Cash Equivalent
 * 3. Trade and Other Payables
 * 4. Cost of Revenue
 */
export const MANDATORY_DETAILS_TYPES = [
  'Trade & Others Receivable',
  'Cash & Cash Equivalent',
  'Trade and Other Payables',
  'Cost of Revenue',
] as const;

export const DEFAULT_DETAILS_TYPE_OPTIONS = [
  'Bank',
  'Cash',
  'Accounts Receivable',
  'Others Receivable',
  'Accounts Payable',
  'Others Payable',
  'Cost of Raw Materials',
  'Overhead',
];

export const BANK_ACCOUNT_TYPES = ['CD', 'SB', 'CC', 'OD'] as const;
