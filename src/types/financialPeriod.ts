export type PeriodStatus = 'Open' | 'Soft-Closed' | 'Locked' | 'Future';

export interface ModuleLockState {
  gl: boolean; // General Ledger / Journal Vouchers
  ap: boolean; // Accounts Payable
  ar: boolean; // Accounts Receivable
  banking: boolean; // Cash & Bank / Cheques
  inventory: boolean; // Inventory & Costing
}

export interface FinancialPeriod {
  id: string;
  fiscalYearCode: string;
  periodNumber: number; // 1 to 12
  periodCode: string; // e.g. "P-01"
  periodName: string; // e.g. "July 2026"
  shortMonth: string; // e.g. "Jul"
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: PeriodStatus;
  moduleLocks: ModuleLockState;
  lockedAt?: string;
  lockedBy?: string;
  closingNotes?: string;
  voucherCount?: number;
}

export interface FiscalYear {
  id: string;
  code: string; // e.g. "2026-2027"
  name: string; // e.g. "Fiscal Year 2026-2027"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
  isClosed: boolean;
  closedAt?: string;
  closedBy?: string;
  retainedEarningsAccount?: string;
  retainedEarningsAccountName?: string;
  effectiveCompanies: string[];
  periods: FinancialPeriod[];
}

export const MONTH_NAMES_BD = [
  { short: 'Jul', full: 'July', q: 'Q1' as const, days: 31, offsetMonth: 6, offsetYear: 0 },
  { short: 'Aug', full: 'August', q: 'Q1' as const, days: 31, offsetMonth: 7, offsetYear: 0 },
  { short: 'Sep', full: 'September', q: 'Q1' as const, days: 30, offsetMonth: 8, offsetYear: 0 },
  { short: 'Oct', full: 'October', q: 'Q2' as const, days: 31, offsetMonth: 9, offsetYear: 0 },
  { short: 'Nov', full: 'November', q: 'Q2' as const, days: 30, offsetMonth: 10, offsetYear: 0 },
  { short: 'Dec', full: 'December', q: 'Q2' as const, days: 31, offsetMonth: 11, offsetYear: 0 },
  { short: 'Jan', full: 'January', q: 'Q3' as const, days: 31, offsetMonth: 0, offsetYear: 1 },
  { short: 'Feb', full: 'February', q: 'Q3' as const, days: 28, offsetMonth: 1, offsetYear: 1 },
  { short: 'Mar', full: 'March', q: 'Q3' as const, days: 31, offsetMonth: 2, offsetYear: 1 },
  { short: 'Apr', full: 'April', q: 'Q4' as const, days: 30, offsetMonth: 3, offsetYear: 1 },
  { short: 'May', full: 'May', q: 'Q4' as const, days: 31, offsetMonth: 4, offsetYear: 1 },
  { short: 'Jun', full: 'June', q: 'Q4' as const, days: 30, offsetMonth: 5, offsetYear: 1 },
];

export function generatePeriodsForFiscalYear(startYear: number, fyCode: string): FinancialPeriod[] {
  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return MONTH_NAMES_BD.map((m, idx) => {
    const year = m.offsetYear === 0 ? startYear : startYear + 1;
    const monthNum = m.offsetMonth + 1;
    const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    let maxDays = m.days;
    if (m.short === 'Feb' && isLeapYear(year)) {
      maxDays = 29;
    }

    const startDate = `${year}-${monthStr}-01`;
    const endDate = `${year}-${monthStr}-${maxDays < 10 ? '0' + maxDays : maxDays}`;
    const periodNumber = idx + 1;
    const periodCode = `P-${periodNumber < 10 ? '0' + periodNumber : periodNumber}`;

    // Default status logic:
    // Past months in 2026 (Jul, Aug, Sep) locked; Oct open; rest future
    let defaultStatus: PeriodStatus = 'Future';
    let defaultLocks: ModuleLockState = { gl: false, ap: false, ar: false, banking: false, inventory: false };

    if (startYear === 2026) {
      if (idx < 3) {
        defaultStatus = 'Locked';
        defaultLocks = { gl: true, ap: true, ar: true, banking: true, inventory: true };
      } else if (idx === 3) {
        // Oct 2026
        defaultStatus = 'Open';
        defaultLocks = { gl: false, ap: false, ar: false, banking: false, inventory: false };
      } else {
        defaultStatus = 'Future';
        defaultLocks = { gl: false, ap: false, ar: false, banking: false, inventory: false };
      }
    } else if (startYear < 2026) {
      defaultStatus = 'Locked';
      defaultLocks = { gl: true, ap: true, ar: true, banking: true, inventory: true };
    }

    return {
      id: `${fyCode}-${periodCode}`,
      fiscalYearCode: fyCode,
      periodNumber,
      periodCode,
      periodName: `${m.full} ${year}`,
      shortMonth: m.short,
      quarter: m.q,
      startDate,
      endDate,
      status: defaultStatus,
      moduleLocks: defaultLocks,
      lockedAt: defaultStatus === 'Locked' ? `${year}-${monthStr}-28 18:00:00` : undefined,
      lockedBy: defaultStatus === 'Locked' ? 'Chief Financial Officer' : undefined,
      voucherCount: defaultStatus === 'Locked' ? Math.floor(Math.random() * 450) + 120 : (idx === 3 ? 142 : 0),
    };
  });
}

export const INITIAL_FISCAL_YEARS: FiscalYear[] = [
  {
    id: 'fy-2026-2027',
    code: '2026-2027',
    name: 'Fiscal Year 2026-2027',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    isActive: true,
    isClosed: false,
    effectiveCompanies: [
      'Pakiza Software Ltd.',
      'Pakiza Knit Composite Ltd.',
      'Pakiza Apparels Ltd.',
    ],
    retainedEarningsAccount: '3101-001',
    retainedEarningsAccountName: 'Retained Earnings / Surplus Account',
    periods: generatePeriodsForFiscalYear(2026, '2026-2027'),
  },
  {
    id: 'fy-2025-2026',
    code: '2025-2026',
    name: 'Fiscal Year 2025-2026',
    startDate: '2025-07-01',
    endDate: '2026-06-30',
    isActive: false,
    isClosed: true,
    closedAt: '2026-07-15 14:30:00',
    closedBy: 'Audit Committee & CFO',
    effectiveCompanies: [
      'Pakiza Software Ltd.',
      'Pakiza Knit Composite Ltd.',
      'Pakiza Apparels Ltd.',
    ],
    retainedEarningsAccount: '3101-001',
    retainedEarningsAccountName: 'Retained Earnings / Surplus Account',
    periods: generatePeriodsForFiscalYear(2025, '2025-2026'),
  },
  {
    id: 'fy-2024-2025',
    code: '2024-2025',
    name: 'Fiscal Year 2024-2025',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    isActive: false,
    isClosed: true,
    closedAt: '2025-07-20 11:15:00',
    closedBy: 'Chief Financial Officer',
    effectiveCompanies: [
      'Pakiza Software Ltd.',
      'Pakiza Knit Composite Ltd.',
      'Pakiza Apparels Ltd.',
    ],
    retainedEarningsAccount: '3101-001',
    retainedEarningsAccountName: 'Retained Earnings / Surplus Account',
    periods: generatePeriodsForFiscalYear(2024, '2024-2025'),
  },
  {
    id: 'fy-2027-2028',
    code: '2027-2028',
    name: 'Fiscal Year 2027-2028',
    startDate: '2027-07-01',
    endDate: '2028-06-30',
    isActive: false,
    isClosed: false,
    effectiveCompanies: [
      'Pakiza Software Ltd.',
      'Pakiza Knit Composite Ltd.',
      'Pakiza Apparels Ltd.',
    ],
    retainedEarningsAccount: '3101-001',
    retainedEarningsAccountName: 'Retained Earnings / Surplus Account',
    periods: generatePeriodsForFiscalYear(2027, '2027-2028'),
  },
];
