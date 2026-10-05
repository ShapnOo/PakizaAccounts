import { RateHistoryEntry } from '../types/currency';

export const MOCK_RATE_HISTORY: RateHistoryEntry[] = [
  { id: 'h1', currencyId: 'c2', rate: 115.5, effectiveDate: '2026-01-15', createdAt: '2026-01-15T09:00:00Z' },
  { id: 'h2', currencyId: 'c2', rate: 118.9, effectiveDate: '2026-06-01', createdAt: '2026-06-01T10:00:00Z' },
  { id: 'h3', currencyId: 'c2', rate: 120.4, effectiveDate: '2026-09-29', createdAt: '2026-09-29T10:00:00Z' },

  { id: 'h4', currencyId: 'c3', rate: 156.4, effectiveDate: '2026-01-15', createdAt: '2026-01-15T09:00:00Z' },
  { id: 'h5', currencyId: 'c3', rate: 160.1, effectiveDate: '2026-06-01', createdAt: '2026-06-01T10:00:00Z' },
  { id: 'h6', currencyId: 'c3', rate: 163.24, effectiveDate: '2026-09-29', createdAt: '2026-09-29T10:00:00Z' },

  { id: 'h7', currencyId: 'c4', rate: 128.2, effectiveDate: '2026-01-15', createdAt: '2026-01-15T09:00:00Z' },
  { id: 'h8', currencyId: 'c4', rate: 130.5, effectiveDate: '2026-06-01', createdAt: '2026-06-01T10:00:00Z' },
  { id: 'h9', currencyId: 'c4', rate: 132.8, effectiveDate: '2026-09-29', createdAt: '2026-09-29T10:00:00Z' },

  { id: 'h10', currencyId: 'c1', rate: 1.0, effectiveDate: '2026-01-01', createdAt: '2026-01-01T00:00:00Z' },
];
