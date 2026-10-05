import { LucideIcon, Repeat, CalendarDays, Clock } from 'lucide-react';

export type VoucherType = 'Journal' | 'Receive' | 'Payment' | 'Contra';
export type Cadence = 'Day' | 'Week' | 'Month' | 'Quarter' | 'Year';

export interface RecurringLine {
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

export interface RecurringProfile {
  id: string;
  profileName: string;          // "Salary Payable"
  voucherType: VoucherType;
  repeatEvery: Cadence;
  startsOn: string;             // YYYY-MM-DD
  endsOn?: string;              // YYYY-MM-DD
  neverExpired: boolean;
  lines: RecurringLine[];
  narration?: string;
  amount: number;               // Total Debit BDT
  active: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  totalRunsCount: number;
  createdAt: string;
  updatedAt: string;
}

export const VOUCHER_TYPES: VoucherType[] = [
  'Journal',
  'Receive',
  'Payment',
  'Contra',
];

export const CADENCES: { value: Cadence; label: string; description: string }[] = [
  { value: 'Day',     label: 'Day',     description: 'Every single day' },
  { value: 'Week',    label: 'Week',    description: 'Every 7 days' },
  { value: 'Month',   label: 'Month',   description: 'Same day each month' },
  { value: 'Quarter', label: 'Quarter', description: 'Every 3 calendar months' },
  { value: 'Year',    label: 'Year',    description: 'Same day each calendar year' },
];

export const VOUCHER_TYPE_COLORS: Record<VoucherType, { bg: string; text: string; ring: string; badge: string }> = {
  Journal: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    ring: 'border-indigo-200 dark:border-indigo-800/60',
    badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50',
  },
  Receive: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'border-emerald-200 dark:border-emerald-800/60',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  },
  Payment: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'border-rose-200 dark:border-rose-800/60',
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
  },
  Contra: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'border-amber-200 dark:border-amber-800/60',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  },
};
