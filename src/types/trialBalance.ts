export type AccountNature =
  | 'Assets'
  | 'Liabilities'
  | "Owner's Equity"
  | 'Income'
  | 'Expense';

export type NatureSide = 'dr' | 'cr';
// Assets + Expense → 'dr'
// Liabilities + Owner's Equity + Income → 'cr'

export type SubLedgerTag =
  | 'Customer'
  | 'Vendor'
  | 'Reference'
  | 'Vehicle'
  | 'Undefined';

export type ValueShowIn =
  | 'N/A'
  | 'Absolute'
  | 'Thousand(/1000)'
  | 'Million(/1000000)'
  | 'Percent'
  | 'Ratio';

export type Currency = 'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR';

export type TBLedgerRow = {
  id: string;
  accountPath: string[];
  level: 1 | 2 | 3 | 4;
  nature: AccountNature;
  side: NatureSide;
  isParent: boolean;
  subLedger?: { name: string; tag: SubLedgerTag };
  openingDr: number;
  openingCr: number;
  debit: number;
  credit: number;
  closingDr: number;
  closingCr: number;
};

export type TBVisibleColumns = {
  openingDr: boolean;
  openingCr: boolean;
  debit: boolean;
  credit: boolean;
  closingDr: boolean;
  closingCr: boolean;
};

export type TBFilterState = {
  currency: Currency;
  dateRange: string;
  customFrom?: string;
  customTo?: string;
  valueShowIn: ValueShowIn;
  glOnly: boolean;
  subLedger: boolean;
  visibleColumns: TBVisibleColumns;
  advancedFilterCollapsed: boolean;
  expandAll: boolean;
};

export type TBReport = {
  filters: TBFilterState;
  rows: TBLedgerRow[];
  totals: {
    openingDr: number;
    openingCr: number;
    debit: number;
    credit: number;
    closingDr: number;
    closingCr: number;
  };
  isBalanced: {
    opening: boolean;
    movement: boolean;
    closing: boolean;
  };
  differences: {
    opening: number;
    movement: number;
    closing: number;
  };
};

export const NATURE_TO_SIDE: Record<AccountNature, NatureSide> = {
  Assets: 'dr',
  Expense: 'dr',
  Liabilities: 'cr',
  "Owner's Equity": 'cr',
  Income: 'cr',
};

export const DATE_RANGES = [
  'Today',
  'This Week',
  'This Month',
  'This Period',
  'This Quarter',
  'This Year',
  'Custom',
];

export const VALUE_SHOW_IN_OPTIONS: {
  value: ValueShowIn;
  divisor: number;
  label: string;
}[] = [
  { value: 'N/A', divisor: 1, label: 'N/A' },
  { value: 'Absolute', divisor: 1, label: 'Absolute' },
  { value: 'Thousand(/1000)', divisor: 1000, label: 'Thousand (/1000)' },
  { value: 'Million(/1000000)', divisor: 1000000, label: 'Million (/1M)' },
  { value: 'Percent', divisor: 1, label: 'Percent (%)' },
  { value: 'Ratio', divisor: 1, label: 'Ratio' },
];

export const CURRENCIES: Currency[] = ['BDT', 'USD', 'EUR', 'GBP', 'INR'];

export const SUB_LEDGER_TAG_COLORS: Record<
  SubLedgerTag,
  { bg: string; text: string; ring: string }
> = {
  Customer: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200/80',
  },
  Vendor: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200/80',
  },
  Reference: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200/80',
  },
  Vehicle: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200/80',
  },
  Undefined: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    ring: 'ring-slate-200/80',
  },
};

export const LEVEL_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: 'text-indigo-900',
  2: 'text-indigo-700',
  3: 'text-slate-800',
  4: 'text-slate-700',
};

export const COLUMN_LABELS: Record<keyof TBVisibleColumns, string> = {
  openingDr: 'Opening (Dr)',
  openingCr: 'Opening (CR)',
  debit: 'Debit',
  credit: 'Credit',
  closingDr: 'Closing (DR)',
  closingCr: 'Closing (CR)',
};
