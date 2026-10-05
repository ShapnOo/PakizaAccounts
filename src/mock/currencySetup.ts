import { CurrencySetup } from '../types/currency';

export const MOCK_CURRENCY_SETUPS: CurrencySetup[] = [
  { id: 'c1', code: 'BDT', country: 'Bangladesh', displayCode: 'BDT-Bangladesh', name: 'Bangladeshi Taka', symbol: '৳', decimalPlace: 2, subunit: 'Poisa', commaFormat: '12,34,56,789' },
  { id: 'c2', code: 'USD', country: 'United States', displayCode: 'USD-United States', name: 'US Dollar', symbol: '$', decimalPlace: 2, subunit: 'Cent', commaFormat: '1,234,567,890' },
  { id: 'c3', code: 'EUR', country: 'Eurozone', displayCode: 'EUR-Eurozone', name: 'Euro', symbol: '€', decimalPlace: 2, subunit: 'Cent', commaFormat: '1.234.567.890' },
  { id: 'c4', code: 'GBP', country: 'United Kingdom', displayCode: 'GBP-United Kingdom', name: 'British Pound', symbol: '£', decimalPlace: 2, subunit: 'Penny', commaFormat: '1,234,567,890' },
  { id: 'c5', code: 'JPY', country: 'Japan', displayCode: 'JPY-Japan', name: 'Japanese Yen', symbol: '¥', decimalPlace: 0, subunit: 'Sen', commaFormat: '1,234,567,890' },
  { id: 'c6', code: 'CAD', country: 'Canada', displayCode: 'CAD-Canada', name: 'Canadian Dollar', symbol: 'C$', decimalPlace: 2, subunit: 'Cent', commaFormat: '1,234,567,890' },
  { id: 'c7', code: 'AUD', country: 'Australia', displayCode: 'AUD-Australia', name: 'Australian Dollar', symbol: 'A$', decimalPlace: 2, subunit: 'Cent', commaFormat: '1,234,567,890' },
  { id: 'c8', code: 'CHF', country: 'Switzerland', displayCode: 'CHF-Switzerland', name: 'Swiss Franc', symbol: 'CHF', decimalPlace: 2, subunit: 'Rappen', commaFormat: '1,234,567,890' },
  { id: 'c9', code: 'CNY', country: 'China', displayCode: 'CNY-China', name: 'Chinese Yuan Renminbi', symbol: '¥', decimalPlace: 2, subunit: 'Fen', commaFormat: '1,234,567,890' },
  { id: 'c10', code: 'INR', country: 'India', displayCode: 'INR-India', name: 'Indian Rupee', symbol: '₹', decimalPlace: 2, subunit: 'Paisa', commaFormat: '12,34,56,789' },
  { id: 'c11', code: 'AED', country: 'United Arab Emirates', displayCode: 'AED-UAE', name: 'UAE Dirham', symbol: 'د.إ', decimalPlace: 2, subunit: 'Fils', commaFormat: '1,234,567,890' },
  { id: 'c12', code: 'SAR', country: 'Saudi Arabia', displayCode: 'SAR-Saudi Arabia', name: 'Saudi Riyal', symbol: '﷼', decimalPlace: 2, subunit: 'Halala', commaFormat: '1,234,567,890' },
  { id: 'c13', code: 'SGD', country: 'Singapore', displayCode: 'SGD-Singapore', name: 'Singapore Dollar', symbol: 'S$', decimalPlace: 2, subunit: 'Cent', commaFormat: '1,234,567,890' },
  { id: 'c14', code: 'MYR', country: 'Malaysia', displayCode: 'MYR-Malaysia', name: 'Malaysian Ringgit', symbol: 'RM', decimalPlace: 2, subunit: 'Sen', commaFormat: '1,234,567,890' },
];
