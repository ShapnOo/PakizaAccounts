export type VoucherTypeOption = 'All' | 'Journal' | 'Payment' | 'Receive' | 'Contra';

export interface NarrationTemplate {
  id: string;
  code: string;
  title: string;
  voucherType: VoucherTypeOption;
  category: string;
  template: string;
  isActive: boolean;
  isDefault?: boolean;
  usageCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const VOUCHER_TYPE_OPTIONS: VoucherTypeOption[] = [
  'All',
  'Journal',
  'Payment',
  'Receive',
  'Contra',
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

