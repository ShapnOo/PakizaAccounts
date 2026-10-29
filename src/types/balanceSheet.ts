export type Side = 'assets' | 'liabilities-equity';

export type SubLedgerTag =
  | 'Customer'
  | 'Vendor'
  | 'Reference'
  | 'Vehicle'
  | 'Undefined';

export type CompareWith =
  | 'Previous Years'
  | 'Budget'
  | 'None'
  | 'Custom Period';

export type ValueShowIn = 'N/A' | 'Absolute' | 'Percent' | 'Ratio';

export type BSTreeRow = {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  rawLabel?: string;               // typo preservation for traceability
  parentId: string | null;
  isParent: boolean;
  isTotal: boolean;
  side: Side;
  values: number[];                // one per year column
  formula?: string;
  subLedger?: {
    name: string;
    tag: SubLedgerTag;
  };
  // Fields for Advance Filter predicate matching:
  accountHeadName?: string;
  subsidiaryName?: string;
  costCenterName?: string;
  employeeName?: string;
  vehicleNumber?: string;
  referenceNumber?: string;
};

export type BSFilterState = {
  asOn: string;                    // ISO date e.g. "2026-10-17"
  compareWith: CompareWith;
  showInPercent: boolean;
  valueShowIn: ValueShowIn;
  numberOfYears: number;           // default 3
  currency: string;                // default "BDT"
  subLedger: boolean;
  advancedFilterCollapsed: boolean;
  expandAll: boolean;
  customStartDate?: string;
  customEndDate?: string;
};

export const COMPARE_WITH_OPTIONS: CompareWith[] = [
  'Previous Years',
  'Budget',
  'None',
  'Custom Period',
];

export const VALUE_SHOW_IN_OPTIONS: ValueShowIn[] = [
  'N/A',
  'Absolute',
  'Percent',
  'Ratio',
];

export const CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP', 'INR'];

export const SUB_LEDGER_TAG_COLORS: Record<
  SubLedgerTag,
  { bg: string; text: string; ring: string }
> = {
  Customer: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200',
  },
  Vendor: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
  },
  Reference: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200',
  },
  Vehicle: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
  },
  Undefined: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    ring: 'ring-slate-200',
  },
};

export const LEVEL_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'text-indigo-700',
  2: 'text-indigo-500',
  3: 'text-sky-600',
  4: 'text-emerald-600',
  5: 'text-amber-600',
};

