export type VoucherType = 'Journal' | 'Payment' | 'Receive' | 'Contra';
export type PaperSize = 'A4' | 'A5' | 'Letter' | 'Legal' | 'Custom';
export type Orientation = 'Portrait' | 'Landscape';
export type Align = 'Left' | 'Center' | 'Right';

export type TableColumnKey =
  | 'accounts'
  | 'costCenter'
  | 'subsidiary'
  | 'employee'
  | 'vehicles'
  | 'reference'
  | 'description'
  | 'currency'
  | 'exchangeRate'
  | 'debit'
  | 'credit'
  | 'debitBDT'
  | 'creditBDT'
  | string; // for dynamic custom fields

export interface TableColumnConfig {
  visible: boolean;
  label: string;
  isCustom?: boolean;
}

export const BASE_TABLE_COLUMNS: { key: string; label: string }[] = [
  { key: 'accounts', label: 'Accounts Head' },
  { key: 'costCenter', label: 'Cost Center' },
  { key: 'subsidiary', label: 'Subsidiary' },
  { key: 'employee', label: 'Employee' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'reference', label: 'Reference' },
  { key: 'description', label: 'Description' },
  { key: 'currency', label: 'Currency' },
  { key: 'exchangeRate', label: 'Exc. Rate' },
  { key: 'debit', label: 'Debit' },
  { key: 'credit', label: 'Credit' },
  { key: 'debitBDT', label: 'Debit (BDT)' },
  { key: 'creditBDT', label: 'Credit (BDT)' },
];

export interface VoucherTemplate {
  id: string;
  voucherType: VoucherType;
  variant?: string; // "General"
  paper: {
    size: PaperSize;
    orientation: Orientation;
    customWidthMm?: number;
    customHeightMm?: number;
  };
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  font: {
    family: string;
    theme: string;
    pdfFont: string;
    color: string;
    size: number;
    background?: string;
    backgroundColor?: string;
  };
  header: {
    companyNameSize: number;
    addressSize: number;
    align: Align;
    showLogo?: boolean;
    logoUrl?: string;
    logoWidth?: number;
    logoPosition?: 'left' | 'center' | 'right';
  };
  footer: {
    text?: string;
    showPrintDateTime: boolean;
    showPageNumber: boolean;
    name: string;
  };
  table: {
    columns: Record<string, TableColumnConfig>;
    columnOrder?: string[];
    showBorder: boolean;
    fontSize: number;
    showApprovalSignature: boolean;
  };
}

export const PAPER_SIZES_MM: Record<PaperSize, { w: number; h: number }> = {
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
  Letter: { w: 216, h: 279 },
  Legal: { w: 216, h: 356 },
  Custom: { w: 210, h: 297 },
};

export const FONT_FAMILIES = [
  'Inter',
  'Noto Sans',
  'Roboto',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
];

export const PDF_FONTS = [
  'Noto Sans',
  'Noto Serif',
  'Roboto',
  'Arial',
  'Helvetica',
];

export const COLOR_THEMES = [
  'Classic',
  'Modern',
  'Corporate',
  'Minimal',
  'Bold',
];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
