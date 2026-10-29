import {
  DateRange,
  MovementRow,
  EquityRow,
} from '../types/retainedEarnings';

export const MOCK_RE_FILTERS = {
  dateRange: 'This Period' as DateRange,
  customFrom: '2026-07-01',
  customTo: '2026-10-20',
};

// Seed exactly matching the source sheet:
export const MOCK_MOVEMENT: MovementRow[] = [
  {
    id: 'm1',
    rowType: 'opening',
    label: 'Opening Retained Earnings',
    amount: 1500000,
    isComputed: false,
  },
  {
    id: 'm2',
    rowType: 'add',
    label: 'Add: Current Year Profit',
    amount: 500000,
    isComputed: false,
  },
  {
    id: 'm3',
    rowType: 'less',
    label: 'Less: Dividend',
    amount: 30000,
    isComputed: false,
  },
  {
    id: 'm4',
    rowType: 'add',
    label: 'Add: Re-valuation',
    amount: 20000,
    isComputed: false,
  },
  {
    id: 'm5',
    rowType: 'closing',
    label: 'Closing Retained Earnings',
    amount: 1990000,
    isComputed: true, // computed = 1500000 + 500000 - 30000 + 20000 = 1990000
  },
];

export const MOCK_EQUITY: EquityRow[] = [
  {
    id: 'e1',
    label: 'Share Capital',
    amount: 1000000,
    source: 'manual',
  },
  {
    id: 'e2',
    label: 'Earnings',
    amount: 1990000,
    source: 'linked',
    linkedTo: 'closingRetainedEarnings',
  },
  {
    id: 'e3',
    label: 'Reserve & Plus',
    amount: 100000,
    source: 'manual',
  },
];

