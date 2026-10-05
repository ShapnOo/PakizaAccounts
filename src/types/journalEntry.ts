import { LucideIcon, List, LayoutGrid, BarChart3 } from 'lucide-react';

export type VoucherType = 'Journal' | 'Receive' | 'Payment' | 'Contra';
export type ViewType = 'list' | 'kanban' | 'bar';
export type FilterRange = 'all' | 'today' | 'this-week' | 'this-month' | 'this-quarter' | 'this-year' | 'custom';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface VoucherLine {
  id: string;
  accountHeadId: string;
  accountHeadName?: string;
  costCenterId?: string;
  subsidiaryId?: string;
  employeeId?: string;
  vehicleId?: string;
  reference?: string;
  description?: string;
  currency: string;      // default "BDT"
  exchangeRate: number;  // default 1
  debit?: number;
  credit?: number;
  debitBDT?: number;     // debit * exchangeRate
  creditBDT?: number;    // credit * exchangeRate
}

export interface VoucherEntry {
  id: string;
  voucherNo: string;     // "JV-2026-0001"
  voucherType: VoucherType;
  source: string;        // "Manual" | "Cheque Prepare" | "Opening Balance" | "Bank Reconciliation" | "Purchase Integration"
  voucherDate: string;   // YYYY-MM-DD
  narration?: string;
  amount: number;        // total amount in BDT

  headerAccountId?: string;      // Receive / Payment only
  headerAccountName?: string;
  headerCostCenterId?: string;

  lines: VoucherLine[];
  attachments: Attachment[];
  voided: boolean;
  presetId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormPreset {
  id: string;
  voucherType: VoucherType;
  name: string;
  lines: Partial<VoucherLine>[];
  lineCount: number;
  createdAt: string;
}

export const VOUCHER_TYPES: VoucherType[] = [
  'Journal',
  'Receive',
  'Payment',
  'Contra',
];

export const VIEW_TYPES: { value: ViewType; label: string; icon: LucideIcon }[] = [
  { value: 'list', label: 'List', icon: List },
  { value: 'kanban', label: 'Kanban', icon: LayoutGrid },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
];

export const FILTER_RANGES: { value: FilterRange; label: string }[] = [
  { value: 'all',          label: 'All Vouchers' },
  { value: 'this-month',   label: 'This Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'this-year',    label: 'This Year' },
  { value: 'this-week',    label: 'This Week' },
  { value: 'today',        label: 'Today' },
  { value: 'custom',       label: 'Custom Range' },
];

export interface VoucherTypeConfig {
  label: string;
  shortCode: string;
  hasHeaderAccount: boolean;
  headerAccountLabel?: string;
  showDebit: boolean;
  showCredit: boolean;
  showDifference: boolean;
  color: {
    badge: string;
    border: string;
    bg: string;
    text: string;
    hex: string;
  };
}

export const VOUCHER_TYPE_CONFIG: Record<VoucherType, VoucherTypeConfig> = {
  Journal: {
    label: 'Journal Voucher',
    shortCode: 'JV',
    hasHeaderAccount: false,
    showDebit: true,
    showCredit: true,
    showDifference: true,
    color: {
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
      border: 'border-indigo-500',
      bg: 'bg-indigo-500',
      text: 'text-indigo-600 dark:text-indigo-400',
      hex: '#6366f1',
    },
  },
  Receive: {
    label: 'Receive Voucher',
    shortCode: 'RV',
    hasHeaderAccount: true,
    headerAccountLabel: 'Receive Accounts (Cash / Bank)',
    showDebit: false,
    showCredit: true,
    showDifference: false,
    color: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      border: 'border-emerald-500',
      bg: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      hex: '#10b981',
    },
  },
  Payment: {
    label: 'Payment Voucher',
    shortCode: 'PV',
    hasHeaderAccount: true,
    headerAccountLabel: 'Payment Accounts (Cash / Bank)',
    showDebit: true,
    showCredit: false,
    showDifference: false,
    color: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      border: 'border-rose-500',
      bg: 'bg-rose-500',
      text: 'text-rose-600 dark:text-rose-400',
      hex: '#f43f5e',
    },
  },
  Contra: {
    label: 'Contra Voucher',
    shortCode: 'CV',
    hasHeaderAccount: false,
    showDebit: true,
    showCredit: true,
    showDifference: true,
    color: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      border: 'border-amber-500',
      bg: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      hex: '#f59e0b',
    },
  },
};
