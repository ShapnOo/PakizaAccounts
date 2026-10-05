import { ExchangeRate } from '../types/currency';

export const MOCK_RATES: ExchangeRate[] = [
  { id: 'r1', currencyId: 'c1', rate: 1, effectiveDate: '2026-09-29', isBase: true },
  { id: 'r2', currencyId: 'c2', rate: 120.4, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r3', currencyId: 'c3', rate: 132.8, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r4', currencyId: 'c4', rate: 163.24, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r5', currencyId: 'c5', rate: 0.81, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r6', currencyId: 'c6', rate: 89.15, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r7', currencyId: 'c7', rate: 81.3, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r8', currencyId: 'c8', rate: 138.5, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r9', currencyId: 'c9', rate: 17.15, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r10', currencyId: 'c10', rate: 1.44, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r11', currencyId: 'c11', rate: 32.78, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r12', currencyId: 'c12', rate: 32.1, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r13', currencyId: 'c13', rate: 93.4, effectiveDate: '2026-09-29', isBase: false },
  { id: 'r14', currencyId: 'c14', rate: 27.65, effectiveDate: '2026-09-29', isBase: false },
];
