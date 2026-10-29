export type DateRange =
  | 'Today'
  | 'This Week'
  | 'This Month'
  | 'This Period'
  | 'This Quarter'
  | 'This Year'
  | 'Custom';

export type MovementRowType = 'opening' | 'add' | 'less' | 'closing';

export type MovementRow = {
  id: string;
  rowType: MovementRowType;
  label: string;
  amount: number;
  isComputed: boolean;
};

export type EquityRow = {
  id: string;
  label: string;
  amount: number;
  source: 'manual' | 'linked';
  linkedTo?: 'closingRetainedEarnings';
};

export type RetainedEarningsReport = {
  dateRange: DateRange;
  customFrom?: string;
  customTo?: string;
  movement: MovementRow[];
  equity: EquityRow[];
  totals: {
    closingRetainedEarnings: number;
    totalEquity: number;
  };
};

export const DATE_RANGES: DateRange[] = [
  'Today',
  'This Week',
  'This Month',
  'This Period',
  'This Quarter',
  'This Year',
  'Custom',
];

export const MOVEMENT_ROW_DEFS: {
  rowType: MovementRowType;
  label: string;
}[] = [
  { rowType: 'opening', label: 'Opening Retained Earnings' },
  { rowType: 'add', label: 'Add: Current Year Profit' },
  { rowType: 'less', label: 'Less: Dividend' },
  { rowType: 'add', label: 'Add: Re-valuation' },
  { rowType: 'closing', label: 'Closing Retained Earnings' },
];

export const EQUITY_ROW_DEFS: {
  label: string;
  source: 'manual' | 'linked';
  linkedTo?: 'closingRetainedEarnings';
}[] = [
  { label: 'Share Capital', source: 'manual' },
  {
    label: 'Earnings',
    source: 'linked',
    linkedTo: 'closingRetainedEarnings',
  },
  { label: 'Reserve & Plus', source: 'manual' },
];

