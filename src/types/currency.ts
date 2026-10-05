export type CommaFormat =
  | '12,34,56,789'      // Indian (lakh/crore)
  | '1,234,567,890'     // Western
  | '1.234.567.890'     // European
  | '12 34 56 789'      // Space-separated
  | '123456789';        // No grouping

export const COMMA_FORMATS: { value: CommaFormat; label: string; example: string }[] = [
  { value: '12,34,56,789',  label: '12,34,56,789 (Indian)',    example: '12,34,56,789.00' },
  { value: '1,234,567,890', label: '1,234,567,890 (Western)',   example: '1,234,567,890.00' },
  { value: '1.234.567.890', label: '1.234.567.890 (European)',  example: '1.234.567.890,00' },
  { value: '12 34 56 789',  label: '12 34 56 789 (Space)',     example: '12 34 56 789.00' },
  { value: '123456789',     label: '123456789 (None)',         example: '123456789.00' },
];

export interface CurrencyMaster {
  country: string;         // "Bangladesh"
  currencyName: string;    // "Taka"
  code: string;            // "BDT"
  symbol: string;          // "৳"
  subunit: string;         // "Poisa"
}

export interface CurrencySetup {
  id: string;
  code: string;            // "BDT"
  country: string;         // "Bangladesh"
  displayCode: string;     // "BDT-Bangladesh"
  name: string;            // "BDT" or "Taka"
  symbol: string;          // "৳"
  decimalPlace: number;    // 2
  subunit: string;         // "Poisa"
  commaFormat: CommaFormat;
}

export interface ExchangeRate {
  id: string;
  currencyId: string;      // FK → CurrencySetup.id
  rate: number;            // 120.4
  effectiveDate: string;   // ISO date string e.g. "2026-09-29"
  isBase: boolean;         // only one true
}

export interface RateHistoryEntry {
  id: string;
  currencyId: string;
  rate: number;
  effectiveDate: string;
  createdAt: string;
}
