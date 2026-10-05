import { ExchangeRate } from '../types/currency';

export const MOCK_RATES: ExchangeRate[] = [
  {
    id: 'r1',
    currencyId: 'c1', // BDT
    rate: 1,
    effectiveDate: '2026-09-29',
    isBase: true,
  },
  {
    id: 'r2',
    currencyId: 'c2', // USD
    rate: 120.4,
    effectiveDate: '2026-09-29',
    isBase: false,
  },
  {
    id: 'r3',
    currencyId: 'c3', // GBP
    rate: 163.24,
    effectiveDate: '2026-09-29',
    isBase: false,
  },
  {
    id: 'r4',
    currencyId: 'c4', // EUR
    rate: 132.8,
    effectiveDate: '2026-09-29',
    isBase: false,
  },
];
