export type VoucherType = 'Journal' | 'Payment' | 'Receive' | 'Contra';
export type TemplateId = 'standard' | 'minimal' | 'cleanGrid' | 'framedLedger';

export type PageCoverage = 'full' | 'half';
export type HalfPageOption = 'single' | 'duplicate';

export type WatermarkSource =
  | 'none'
  | 'groupName'
  | 'companyName'
  | 'companyShortName'
  | 'approvalStatus'
  | 'voucherName'
  | 'custom';

export type TemplateCustomization = {
  paperSize: 'A4' | 'A5' | 'Letter' | 'Legal';
  orientation: 'Portrait' | 'Landscape';
  pageCoverage?: PageCoverage;
  halfPageOption?: HalfPageOption;
  showCutLine?: boolean;
  margin: { top: number; bottom: number; left: number; right: number };
  fontFamily: string;
  fontSize: number;
  primaryColor: string;
  accentColor: string;
  companyLogo?: string;
  showCompanyHeader: boolean;
  showNarration: boolean;
  showValueInWords: boolean;
  showSignatures: boolean;
  showFooter: boolean;
  // Template-specific
  showDifferenceRow?: boolean;
  showCurrencySummary?: boolean;
  showBalanceIndicator?: boolean;
  showLineDescription?: boolean;
  showAuxRow?: boolean;
  zebraStripes?: boolean;
  visibleColumns?: Record<string, boolean>;
  borderColor?: string;
  borderWeight?: number;
  borderOpacity?: number;
  watermarkSource?: WatermarkSource;
  watermarkCustomText?: string;
  watermarkText?: string;
  watermarkPlacement?: 'table' | 'full';
  watermarkOpacity?: number;
};

export function resolveWatermarkText(
  source: WatermarkSource | undefined,
  customText: string | undefined,
  companyName: string = 'Pakiza Software Ltd.',
  voucherType: string = 'Journal'
): string {
  if (!source || source === 'none') {
    return customText || '';
  }
  switch (source) {
    case 'groupName':
      return 'PAKIZA GROUP';
    case 'companyName':
      return companyName.toUpperCase();
    case 'companyShortName':
      return 'PSL';
    case 'approvalStatus':
      return 'APPROVED';
    case 'voucherName':
      return `${voucherType.toUpperCase()} VOUCHER`;
    case 'custom':
      return customText || '';
    default:
      return customText || '';
  }
}

export function resolveBorderColor(
  color: string = '#000000',
  opacity: number = 1.0
): string {
  if (opacity >= 0.99) return color;
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
  }
  return color;
}

export interface ColumnDefinition {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  category?: 'main' | 'aux';
}

export const STANDARD_TEMPLATE_COLUMNS: ColumnDefinition[] = [
  { id: 'accountsHead', label: 'Accounts Head', required: true, description: 'Ledger account name' },
  { id: 'costCenter', label: 'Cost Center', description: 'Assigned cost center branch/dept' },
  { id: 'subsidiary', label: 'Subsidiary', description: 'Vendor, Customer or party name' },
  { id: 'vehicle', label: 'Vehicles', description: 'Transport vehicle registration' },
  { id: 'reference', label: 'Reference', description: 'PO or invoice tracking number' },
  { id: 'lineDescription', label: 'Line Description', description: 'Line item narration' },
  { id: 'currency', label: 'Currency', description: 'Transaction currency code (BDT, USD, etc.)' },
  { id: 'exchangeRate', label: 'Exc. Rate', description: 'Conversion rate to base currency' },
  { id: 'debit', label: 'Debit', description: 'Debit amount in transaction currency' },
  { id: 'credit', label: 'Credit', description: 'Credit amount in transaction currency' },
  { id: 'debitBDT', label: 'Debit (BDT)', description: 'Debit equivalent in base currency' },
  { id: 'creditBDT', label: 'Credit (BDT)', description: 'Credit equivalent in base currency' },
];

export const DUAL_ROW_TEMPLATE_COLUMNS: ColumnDefinition[] = [
  { id: 'accountsHead', label: 'Accounts Head', required: true, category: 'main', description: 'Ledger account title' },
  { id: 'lineDescription', label: 'Line Description', category: 'main', description: 'Line specific description' },
  { id: 'currency', label: 'Currency (Cur.)', category: 'main', description: 'Currency code' },
  { id: 'exchangeRate', label: 'Rate', category: 'main', description: 'Currency exchange rate' },
  { id: 'debit', label: 'Debit (Currency)', category: 'main', description: 'Debit in transaction currency' },
  { id: 'credit', label: 'Credit (Currency)', category: 'main', description: 'Credit in transaction currency' },
  { id: 'debitBDT', label: 'Debit (BDT)', category: 'main', description: 'Debit in base BDT currency' },
  { id: 'creditBDT', label: 'Credit (BDT)', category: 'main', description: 'Credit in base BDT currency' },
];

export const AUX_DIMENSION_COLUMNS: ColumnDefinition[] = [
  { id: 'costCenter', label: 'Cost Center', category: 'aux', description: 'Cost center allocation' },
  { id: 'subsidiary', label: 'Subsidiary', category: 'aux', description: 'Vendor/Customer name' },
  { id: 'employee', label: 'Employee', category: 'aux', description: 'Assigned staff/officer' },
  { id: 'vehicle', label: 'Vehicle', category: 'aux', description: 'Assigned vehicle number' },
  { id: 'reference', label: 'Reference', category: 'aux', description: 'Reference/PO number' },
];

export type TemplateSetup = {
  voucherType: VoucherType;
  templateId: TemplateId;
  customization: TemplateCustomization;
};

export type PreviewLine = {
  id: string;
  accountsHead: string;
  costCenter: string;
  subsidiary: string;
  employee: string;
  vehicle: string;
  reference: string;
  lineDescription: string;
  currency: string;
  exchangeRate: number;
  debit: number;
  credit: number;
  debitBDT: number;
  creditBDT: number;
  curNum: number;
};

export type VoucherPreviewData = {
  voucherType: VoucherType;
  voucherNo: string;
  voucherDate: string;
  narration: string;
  valueInWords: string;
  source: string;
  lines: PreviewLine[];
  company: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    website: string;
  };
  signatureSlots: { label: string; name: string }[];
  currencySummary: {
    currency: string;
    debitCur: number;
    creditCur: number;
    debitBDT: number;
    creditBDT: number;
  }[];
  totals: {
    debitBDT: number;
    creditBDT: number;
    difference: number;
    isBalanced: boolean;
  };
};

export const VOUCHER_TYPES: VoucherType[] = [
  'Journal',
  'Payment',
  'Receive',
  'Contra',
];

export const TEMPLATE_INFO: Record<
  TemplateId,
  {
    label: string;
    description: string;
    hasCurrencySummary: boolean;
    hasBalanceIndicator: boolean;
    hasFixedThreeSignatures: boolean;
    entryRowStyle: 'single' | 'double';
    borderStyle: 'thin' | 'hairline' | 'grid' | 'double-rule';
    supportsZebra: boolean;
  }
> = {
  standard: {
    label: 'Standard',
    description:
      'Traditional voucher — company header, single-row entries, 3 fixed signatures.',
    hasCurrencySummary: false,
    hasBalanceIndicator: false,
    hasFixedThreeSignatures: true,
    entryRowStyle: 'single',
    borderStyle: 'thin',
    supportsZebra: false,
  },
  minimal: {
    label: 'Minimal',
    description:
      'Airy layout — hairline table, dual-row entries, dynamic signature labels.',
    hasCurrencySummary: true,
    hasBalanceIndicator: true,
    hasFixedThreeSignatures: false,
    entryRowStyle: 'double',
    borderStyle: 'hairline',
    supportsZebra: false,
  },
  cleanGrid: {
    label: 'Clean Grid',
    description:
      'Boxed grid — full borders, dual-row entries, dynamic signatures.',
    hasCurrencySummary: true,
    hasBalanceIndicator: true,
    hasFixedThreeSignatures: false,
    entryRowStyle: 'double',
    borderStyle: 'grid',
    supportsZebra: true,
  },
  framedLedger: {
    label: 'Framed Ledger',
    description:
      'Classic ledger — double-rule header, framed page, dynamic signatures.',
    hasCurrencySummary: true,
    hasBalanceIndicator: true,
    hasFixedThreeSignatures: false,
    entryRowStyle: 'double',
    borderStyle: 'double-rule',
    supportsZebra: true,
  },
};

export const PAPER_SIZES_MM: Record<
  TemplateCustomization['paperSize'],
  { w: number; h: number }
> = {
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
  Letter: { w: 216, h: 279 },
  Legal: { w: 216, h: 356 },
};

export const FONT_FAMILIES = [
  'Inter',
  'Noto Sans',
  'Roboto',
  'Arial',
  'Times New Roman',
];

export const DEFAULT_CUSTOMIZATION: TemplateCustomization = {
  paperSize: 'A4',
  orientation: 'Portrait',
  pageCoverage: 'full',
  halfPageOption: 'single',
  showCutLine: true,
  margin: { top: 0.08, bottom: 0.08, left: 0.04, right: 0.04 },
  fontFamily: 'Inter',
  fontSize: 9,
  primaryColor: '#0f172a',
  accentColor: '#1e40af',
  borderColor: '#000000',
  borderWeight: 1,
  borderOpacity: 1.0,
  companyLogo: '/company_logo.png',
  showCompanyHeader: true,
  showNarration: true,
  showValueInWords: true,
  showSignatures: true,
  showFooter: true,
};

// Legacy compatibility types if needed during migration
export type PaperSize = 'A4' | 'A5' | 'Letter' | 'Legal';
export type Orientation = 'Portrait' | 'Landscape';
export type Align = 'Left' | 'Center' | 'Right';
