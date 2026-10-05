import {
  AssetLiabilityPoint,
  BankLiquidityItem,
  DurationFilter,
  ExpenseBreakdownPoint,
  FinancialKpi,
  ProfitLossPoint,
  VoucherPoint,
  WorkingCapitalPoint,
} from '../types/dashboard';
import { MOCK_COA_BANK_ACCOUNTS } from '../mock/coaBankAccounts';
import { MOCK_RECURRING_PROFILES } from '../mock/recurringProfiles';

export const BRANCH_OPTIONS = [
  { id: 'all', name: 'All Entities & Branches', code: 'ALL' },
  { id: 'pakiza-knit', name: 'Pakiza Knit Composite Ltd', code: 'PKC' },
  { id: 'pakiza-cotton', name: 'Pakiza Cotton Spinning Mills', code: 'PCS' },
  { id: 'pakiza-dyeing', name: 'Pakiza Dyeing & Printing Ind.', code: 'PDP' },
  { id: 'pakiza-apparels', name: 'Pakiza Apparels Ltd', code: 'PAL' },
  { id: 'dhaka-corp', name: 'Pakiza Corporate HQ Dhaka', code: 'DHQ' },
];

export const FINANCIAL_YEAR_OPTIONS = [
  { id: '2025-2026', label: 'FY 2025 - 2026' },
  { id: '2024-2025', label: 'FY 2024 - 2025' },
  { id: '2023-2024', label: 'FY 2023 - 2024' },
];

export const DURATION_OPTIONS: DurationFilter[] = [
  '7 Days',
  '30 Days',
  '60 Days',
  'This Quarter',
  '1 Year',
  '2 Years',
  '3 Years',
  'All Time',
];

export function formatBDTAmount(value: number): string {
  if (Math.abs(value) >= 10000000) {
    return `৳ ${(value / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(value) >= 100000) {
    return `৳ ${(value / 100000).toFixed(2)} Lac`;
  }
  return `৳ ${value.toLocaleString('en-BD')}`;
}

export function getMultiplierForDuration(duration: DurationFilter): number {
  switch (duration) {
    case '7 Days':
      return 0.08;
    case '30 Days':
      return 0.25;
    case '60 Days':
      return 0.5;
    case 'This Quarter':
      return 0.75;
    case '1 Year':
      return 1.0;
    case '2 Years':
      return 1.85;
    case '3 Years':
      return 2.7;
    case 'All Time':
      return 3.5;
    default:
      return 1.0;
  }
}

export function getFinancialKpis(
  duration: DurationFilter,
  _branch: string,
  currency: 'BDT' | 'USD' | 'EUR' = 'BDT'
): FinancialKpi[] {
  const mult = getMultiplierForDuration(duration);
  const curSymbol = currency === 'BDT' ? '৳' : currency === 'USD' ? '$' : '€';
  const curFactor = currency === 'BDT' ? 1 : currency === 'USD' ? 0.0084 : 0.0078;

  const baseIncome = Math.round(48920400 * mult * curFactor);
  const baseExpense = Math.round(31450200 * mult * curFactor);
  const baseProfit = baseIncome - baseExpense;
  const baseReceivable = Math.round(18340000 * mult * curFactor);
  const basePayable = Math.round(11280000 * mult * curFactor);
  const baseCash = Math.round(24850500 * (0.8 + mult * 0.2) * curFactor);

  return [
    {
      id: 'income',
      label: 'Total Revenue / Income',
      value: baseIncome,
      formattedValue: `${curSymbol} ${baseIncome.toLocaleString('en-BD')}`,
      note: 'Operational sales & invoicing',
      badge: '+14.8% vs last period',
      change: '+14.8%',
      isPositive: true,
      type: 'income',
    },
    {
      id: 'expense',
      label: 'Total Operating Expense',
      value: baseExpense,
      formattedValue: `${curSymbol} ${baseExpense.toLocaleString('en-BD')}`,
      note: 'Production, payroll & overheads',
      badge: '-3.2% cost reduction',
      change: '-3.2%',
      isPositive: true,
      type: 'expense',
    },
    {
      id: 'profit',
      label: 'Net Profit Margin',
      value: baseProfit,
      formattedValue: `${curSymbol} ${baseProfit.toLocaleString('en-BD')}`,
      note: '35.7% overall margin',
      badge: '+22.4% EBITDA growth',
      change: '+22.4%',
      isPositive: true,
      type: 'profit',
    },
    {
      id: 'receivable',
      label: 'Accounts Receivable',
      value: baseReceivable,
      formattedValue: `${curSymbol} ${baseReceivable.toLocaleString('en-BD')}`,
      note: 'From 18 corporate clients',
      badge: '94% collected on time',
      change: '+6.1%',
      isPositive: true,
      type: 'receivable',
    },
    {
      id: 'payable',
      label: 'Accounts Payable',
      value: basePayable,
      formattedValue: `${curSymbol} ${basePayable.toLocaleString('en-BD')}`,
      note: 'Due to suppliers & mills',
      badge: '5 invoices due this week',
      change: '-1.8%',
      isPositive: false,
      type: 'payable',
    },
    {
      id: 'cash',
      label: 'Cash & Bank Liquidity',
      value: baseCash,
      formattedValue: `${curSymbol} ${baseCash.toLocaleString('en-BD')}`,
      note: 'Across 6 Bank & 2 Cash heads',
      badge: 'Solvency ratio: 2.2x',
      change: '+8.3%',
      isPositive: true,
      type: 'cash',
    },
  ];
}

export function getProfitLossData(
  duration: DurationFilter,
  _branch: string,
  _year: string
): ProfitLossPoint[] {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const baseValues = [
    { revenue: 38000000, costOfRevenue: 24500000, grossProfit: 13500000, netProfit: 7200000 },
    { revenue: 42000000, costOfRevenue: 27000000, grossProfit: 15000000, netProfit: 8100000 },
    { revenue: 45000000, costOfRevenue: 29000000, grossProfit: 16000000, netProfit: 8900000 },
    { revenue: 39500000, costOfRevenue: 25500000, grossProfit: 14000000, netProfit: 7600000 },
    { revenue: 48000000, costOfRevenue: 30500000, grossProfit: 17500000, netProfit: 9800000 },
    { revenue: 52000000, costOfRevenue: 33000000, grossProfit: 19000000, netProfit: 10900000 },
    { revenue: 46000000, costOfRevenue: 29500000, grossProfit: 16500000, netProfit: 9200000 },
    { revenue: 51000000, costOfRevenue: 32500000, grossProfit: 18500000, netProfit: 10400000 },
    { revenue: 56000000, costOfRevenue: 35000000, grossProfit: 21000000, netProfit: 12200000 },
    { revenue: 53500000, costOfRevenue: 34000000, grossProfit: 19500000, netProfit: 11100000 },
    { revenue: 58000000, costOfRevenue: 36500000, grossProfit: 21500000, netProfit: 12800000 },
    { revenue: 62000000, costOfRevenue: 38500000, grossProfit: 23500000, netProfit: 14100000 },
  ];

  if (duration === '7 Days' || duration === '30 Days') {
    return [
      { month: 'Wk 1', revenue: 12500000, costOfRevenue: 8000000, grossProfit: 4500000, netProfit: 2600000 },
      { month: 'Wk 2', revenue: 14800000, costOfRevenue: 9200000, grossProfit: 5600000, netProfit: 3300000 },
      { month: 'Wk 3', revenue: 16200000, costOfRevenue: 10100000, grossProfit: 6100000, netProfit: 3700000 },
      { month: 'Wk 4', revenue: 18420400, costOfRevenue: 11500000, grossProfit: 6920400, netProfit: 4200000 },
    ];
  }

  if (duration === '60 Days' || duration === 'This Quarter') {
    return [
      { month: 'Month 1', revenue: 46000000, costOfRevenue: 29500000, grossProfit: 16500000, netProfit: 9200000 },
      { month: 'Month 2', revenue: 51000000, costOfRevenue: 32500000, grossProfit: 18500000, netProfit: 10400000 },
      { month: 'Month 3', revenue: 56000000, costOfRevenue: 35000000, grossProfit: 21000000, netProfit: 12200000 },
    ];
  }

  return months.map((m, i) => ({
    month: m,
    ...baseValues[i % baseValues.length],
  }));
}

export function getVoucherDistributionData(
  duration: DurationFilter,
  _branch: string,
  _year: string
): VoucherPoint[] {
  if (duration === '7 Days' || duration === '30 Days') {
    return [
      { month: 'Wk 1', drVoucher: 14, crVoucher: 22, cntVoucher: 6, jnlVoucher: 9, total: 51 },
      { month: 'Wk 2', drVoucher: 18, crVoucher: 28, cntVoucher: 9, jnlVoucher: 12, total: 67 },
      { month: 'Wk 3', drVoucher: 22, crVoucher: 31, cntVoucher: 11, jnlVoucher: 15, total: 79 },
      { month: 'Wk 4', drVoucher: 26, crVoucher: 38, cntVoucher: 14, jnlVoucher: 19, total: 97 },
    ];
  }

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseCounts = [
    { drVoucher: 48, crVoucher: 65, cntVoucher: 18, jnlVoucher: 32 },
    { drVoucher: 54, crVoucher: 72, cntVoucher: 21, jnlVoucher: 38 },
    { drVoucher: 61, crVoucher: 80, cntVoucher: 25, jnlVoucher: 42 },
    { drVoucher: 45, crVoucher: 58, cntVoucher: 16, jnlVoucher: 28 },
    { drVoucher: 70, crVoucher: 88, cntVoucher: 30, jnlVoucher: 49 },
    { drVoucher: 82, crVoucher: 96, cntVoucher: 34, jnlVoucher: 56 },
    { drVoucher: 65, crVoucher: 78, cntVoucher: 26, jnlVoucher: 44 },
    { drVoucher: 75, crVoucher: 92, cntVoucher: 29, jnlVoucher: 51 },
    { drVoucher: 88, crVoucher: 104, cntVoucher: 37, jnlVoucher: 60 },
    { drVoucher: 80, crVoucher: 98, cntVoucher: 32, jnlVoucher: 54 },
    { drVoucher: 92, crVoucher: 112, cntVoucher: 40, jnlVoucher: 64 },
    { drVoucher: 105, crVoucher: 126, cntVoucher: 46, jnlVoucher: 72 },
  ];

  return months.map((m, i) => {
    const row = baseCounts[i % baseCounts.length];
    return {
      month: m,
      ...row,
      total: row.drVoucher + row.crVoucher + row.cntVoucher + row.jnlVoucher,
    };
  });
}

export function getWorkingCapitalData(
  _duration: DurationFilter,
  _branch: string,
  _year: string
): WorkingCapitalPoint[] {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const flows = [
    { debit: 32000000, credit: 28000000, netWorkingCapital: 14200000 },
    { debit: 35500000, credit: 31000000, netWorkingCapital: 15400000 },
    { debit: 39000000, credit: 33500000, netWorkingCapital: 16800000 },
    { debit: 34000000, credit: 30500000, netWorkingCapital: 16200000 },
    { debit: 41000000, credit: 35000000, netWorkingCapital: 18100000 },
    { debit: 45000000, credit: 38500000, netWorkingCapital: 19500000 },
    { debit: 39500000, credit: 34000000, netWorkingCapital: 18900000 },
    { debit: 43500000, credit: 37000000, netWorkingCapital: 20400000 },
    { debit: 48000000, credit: 41000000, netWorkingCapital: 22100000 },
    { debit: 46000000, credit: 39500000, netWorkingCapital: 21500000 },
    { debit: 50500000, credit: 43000000, netWorkingCapital: 23600000 },
    { debit: 54000000, credit: 45500000, netWorkingCapital: 24850000 },
  ];

  return months.map((m, i) => ({
    month: m,
    ...flows[i % flows.length],
  }));
}

export function getAssetLiabilitiesData(
  _duration: DurationFilter,
  _branch: string,
  _year: string
): AssetLiabilityPoint[] {
  const quarters = ['Q1 (Jul-Sep)', 'Q2 (Oct-Dec)', 'Q3 (Jan-Mar)', 'Q4 (Apr-Jun)'];
  return [
    {
      month: quarters[0],
      currentAssets: 52000000,
      fixedAssets: 88000000,
      currentLiabilities: 31000000,
      equity: 109000000,
    },
    {
      month: quarters[1],
      currentAssets: 58000000,
      fixedAssets: 91000000,
      currentLiabilities: 34000000,
      equity: 115000000,
    },
    {
      month: quarters[2],
      currentAssets: 64000000,
      fixedAssets: 94000000,
      currentLiabilities: 36500000,
      equity: 121500000,
    },
    {
      month: quarters[3],
      currentAssets: 71500000,
      fixedAssets: 98000000,
      currentLiabilities: 39000000,
      equity: 130500000,
    },
  ];
}

export function getExpenseBreakdownData(
  _duration: DurationFilter,
  _branch: string
): ExpenseBreakdownPoint[] {
  return [
    { name: 'Direct Raw Materials & Dyeing', value: 14200000, color: '#3b82f6', percentage: 45 },
    { name: 'Factory Wages & Direct Labor', value: 6800000, color: '#10b981', percentage: 22 },
    { name: 'Utilities, Gas & Electricity', value: 3900000, color: '#f59e0b', percentage: 12 },
    { name: 'Administrative & Head Office', value: 3200000, color: '#8b5cf6', percentage: 10 },
    { name: 'Freight, Logistics & Shipping', value: 2100000, color: '#ec4899', percentage: 7 },
    { name: 'Depreciation & Maintenance', value: 1250200, color: '#06b6d4', percentage: 4 },
  ];
}

export function getBankLiquidityData(): BankLiquidityItem[] {
  const accounts = MOCK_COA_BANK_ACCOUNTS || [];
  const total = 24850500;

  const sampleBalances = [
    { id: '1', bankName: 'Dutch-Bangla Bank Ltd', accountNo: '107-110-0092831', accountType: 'Current' as const, currency: 'BDT', balance: 8420000, status: 'Reconciled' as const },
    { id: '2', bankName: 'City Bank PLC', accountNo: '310-291-8847291', accountType: 'Current' as const, currency: 'BDT', balance: 5680000, status: 'Reconciled' as const },
    { id: '3', bankName: 'Sonali Bank Ltd', accountNo: '029-441-2094833', accountType: 'STD' as const, currency: 'BDT', balance: 4150000, status: 'Pending' as const },
    { id: '4', bankName: 'Eastern Bank PLC', accountNo: '118-092-7738291', accountType: 'Current' as const, currency: 'BDT', balance: 3240000, status: 'Reconciled' as const },
    { id: '5', bankName: 'HSBC Dhaka Offshore', accountNo: '001-449-3829102', accountType: 'FC' as const, currency: 'USD', balance: 2160500, status: 'Reconciled' as const },
    { id: '6', bankName: 'Petty Cash - Dhaka Head Office', accountNo: 'CSH-001', accountType: 'Cash' as const, currency: 'BDT', balance: 750000, status: 'Active' as const },
    { id: '7', bankName: 'Petty Cash - Gazipur Factory Mill', accountNo: 'CSH-002', accountType: 'Cash' as const, currency: 'BDT', balance: 450000, status: 'Active' as const },
  ];

  return sampleBalances.map((item) => ({
    ...item,
    percentageOfTotal: Math.round((item.balance / total) * 100),
  }));
}

export function getPendingAlerts() {
  const recurringActive = MOCK_RECURRING_PROFILES.filter((p) => p.active).length;

  return [
    {
      id: 'alert-1',
      title: `${recurringActive} Recurring Journals Scheduled`,
      description: 'Monthly Salary Payable and Factory Rent profiles are queued for next execution run.',
      type: 'info' as const,
      link: '/recurring-journal',
      actionLabel: 'View Schedules',
    },
    {
      id: 'alert-2',
      title: '2 Bank Statements Pending Reconciliation',
      description: 'Sonali Bank STD and DBBL Current have 14 unreconciled cheques from last week.',
      type: 'warning' as const,
      link: '/cheques/register',
      actionLabel: 'Open Cheque Register',
    },
    {
      id: 'alert-3',
      title: 'Current Financial Period: Q3 (FY 2025-2026)',
      description: 'Books are open for entry. Sep 2026 lock check is active.',
      type: 'success' as const,
      link: '/accounts-config/master-config',
      actionLabel: 'Master Config',
    },
  ];
}
