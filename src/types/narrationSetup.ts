export interface NarrationTemplate {
  id: string;
  code: string;
  title: string;
  voucherName: string; // e.g. "Cash Payment Voucher", "Bank Payment Voucher", "Journal Voucher", "All"
  voucherType?: string; // "Payment Voucher", "Receive Voucher", "Journal Voucher", "Contra Voucher", "All"
  category: string;
  template: string;
  isActive: boolean;
  isDefault?: boolean;
  usageCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const STANDARD_VOUCHER_NAMES = [
  'All',
  'Journal Voucher',
  'Cash Payment Voucher',
  'Cash Receive Voucher',
  'Bank Payment Voucher',
  'Bank Receive Voucher',
  'Contra Voucher',
  'Foreign Currency Adjustment Voucher',
  'Employee Salary & Wages Voucher',
  'Direct Tax & VAT Payment Voucher',
  'Asset Depreciation & Amortization Voucher',
];

export const NARRATION_CATEGORIES = [
  'General & Administrative',
  'Banking & Finance',
  'Vendor & Supplier Payments',
  'Customer Receipts & Collections',
  'Salary, Payroll & Benefits',
  'Office Rent & Utilities',
  'Taxes, VAT & Statutory Dues',
  'Petty Cash & Miscellaneous',
  'Asset & Depreciation',
];

export const AVAILABLE_VARIABLES = [
  { key: '{invoice_no}', label: 'Invoice No', desc: 'Vendor or customer invoice number' },
  { key: '{party_name}', label: 'Party Name', desc: 'Customer, vendor or employee name' },
  { key: '{month}', label: 'Month', desc: 'e.g. January 2026' },
  { key: '{year}', label: 'Year', desc: 'e.g. 2026' },
  { key: '{bank_name}', label: 'Bank Name', desc: 'Operating bank account title' },
  { key: '{cheque_no}', label: 'Cheque No', desc: 'Instrument / Cheque reference' },
  { key: '{amount}', label: 'Amount', desc: 'Voucher settlement amount' },
  { key: '{purpose}', label: 'Purpose', desc: 'Operational description' },
];
