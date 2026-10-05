export type ChartView = 'line' | 'bar' | 'area' | 'pie';

export type DurationFilter =
  | '7 Days'
  | '30 Days'
  | '60 Days'
  | 'This Quarter'
  | '1 Year'
  | '2 Years'
  | '3 Years'
  | 'All Time';

export type DashboardMode = 'executive' | 'operational' | 'full';

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

export type DashboardWidgetId =
  | 'kpiGrid'
  | 'profitLoss'
  | 'vouchers'
  | 'workingCapital'
  | 'assetsLiabilities'
  | 'bankLiquidity'
  | 'expenseBreakdown'
  | 'quickAccess'
  | 'recentVouchers'
  | 'pendingAlerts';

export interface WidgetConfig {
  id: DashboardWidgetId;
  title: string;
  description: string;
  category: 'metrics' | 'charts' | 'operations' | 'tables';
  enabled: boolean;
}

export interface FinancialKpi {
  id: string;
  label: string;
  value: number;
  formattedValue?: string;
  note: string;
  badge: string;
  change: string;
  isPositive: boolean;
  type: 'income' | 'expense' | 'profit' | 'receivable' | 'payable' | 'cash';
}

export interface ProfitLossPoint {
  month: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  netProfit: number;
}

export interface VoucherPoint {
  month: string;
  drVoucher: number;
  crVoucher: number;
  cntVoucher: number;
  jnlVoucher: number;
  total?: number;
}

export interface WorkingCapitalPoint {
  month: string;
  debit: number;
  credit: number;
  netWorkingCapital: number;
}

export interface AssetLiabilityPoint {
  month: string;
  currentAssets: number;
  fixedAssets: number;
  currentLiabilities: number;
  equity: number;
}

export interface ExpenseBreakdownPoint {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface BankLiquidityItem {
  id: string;
  bankName: string;
  accountNo: string;
  accountType: 'Current' | 'Savings' | 'STD' | 'FC' | 'Cash';
  currency: string;
  balance: number;
  percentageOfTotal: number;
  status: 'Active' | 'Reconciled' | 'Pending';
}

export interface DashboardFilterState {
  duration: DurationFilter;
  branch: string;
  financialYear: string;
  currency: 'BDT' | 'USD' | 'EUR';
}
