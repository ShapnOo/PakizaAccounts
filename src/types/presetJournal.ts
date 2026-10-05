export type VoucherType = 'Journal' | 'Receive' | 'Payment' | 'Contra';

export interface PresetLine {
  id: string;
  accountHeadId: string;
  accountHeadName?: string;
  costCenterId?: string;
  subsidiaryId?: string;
  employeeId?: string;
  vehicleId?: string;
  reference?: string;
  description?: string;
  currency: string;             // default "BDT"
  exchangeRate: number;         // default 1
  debit?: number;
  credit?: number;
  debitBDT?: number;
  creditBDT?: number;
}

export interface JournalPreset {
  id: string;
  profileName: string;          // "Salary Payable"
  voucherType: VoucherType;
  lines: PresetLine[];
  narration?: string;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const VOUCHER_TYPES: VoucherType[] = [
  'Journal',
  'Receive',
  'Payment',
  'Contra',
];

export const VOUCHER_TYPE_COLORS: Record<
  VoucherType,
  { bg: string; text: string; ring: string; badge: string; border: string }
> = {
  Journal: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    ring: 'ring-indigo-200 dark:ring-indigo-800/60',
    border: 'border-indigo-200 dark:border-indigo-900/60',
    badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60',
  },
  Receive: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-800/60',
    border: 'border-emerald-200 dark:border-emerald-900/60',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
  },
  Payment: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-800/60',
    border: 'border-rose-200 dark:border-rose-900/60',
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
  },
  Contra: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-800/60',
    border: 'border-amber-200 dark:border-amber-900/60',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
  },
};
