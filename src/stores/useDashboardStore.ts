import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ChartView,
  DashboardMode,
  DashboardWidgetId,
  DurationFilter,
  LayoutDensity,
  WidgetConfig,
} from '../types/dashboard';

export const ALL_WIDGETS: WidgetConfig[] = [
  {
    id: 'pendingAlerts',
    title: 'Action Alerts & Schedule Banner',
    description: 'Displays recurring schedules, month locks, and pending bank items',
    category: 'operations',
    enabled: true,
  },
  {
    id: 'kpiGrid',
    title: 'Financial KPI Metrics Grid',
    description: 'Income, Expenses, Net Profit, Receivable, Payable & Liquidity stats',
    category: 'metrics',
    enabled: true,
  },
  {
    id: 'profitLoss',
    title: 'Profit & Loss Status Chart',
    description: 'Monthly trend of Revenue, Cost of Revenue, Gross Profit, and Net Margin',
    category: 'charts',
    enabled: true,
  },
  {
    id: 'vouchers',
    title: 'Total Voucher Distribution Chart',
    description: 'Monthly volume of Debit, Credit, Contra, and Journal Vouchers',
    category: 'charts',
    enabled: true,
  },
  {
    id: 'workingCapital',
    title: 'Working Capital Flow Chart',
    description: 'Debit vs Credit cashflow velocity and net liquid working capital',
    category: 'charts',
    enabled: true,
  },
  {
    id: 'assetsLiabilities',
    title: 'Asset & Liabilities Position',
    description: 'Balance sheet composition: Current Assets, Liabilities, and Equity',
    category: 'charts',
    enabled: true,
  },
  {
    id: 'bankLiquidity',
    title: 'Bank & Cash Liquidity Position',
    description: 'Live balances across all bank accounts and cash counters',
    category: 'operations',
    enabled: true,
  },
  {
    id: 'expenseBreakdown',
    title: 'Expense by Cost Center Breakdown',
    description: 'Donut chart showing operational cost allocation across divisions',
    category: 'charts',
    enabled: true,
  },
  {
    id: 'quickAccess',
    title: 'Quick Access Navigation Grid',
    description: 'One-click shortcuts to key accounting configuration and entry modules',
    category: 'operations',
    enabled: true,
  },
  {
    id: 'recentVouchers',
    title: 'Recent Transactions & Vouchers Feed',
    description: 'Real-time ledger of latest vouchers with quick-view and print actions',
    category: 'tables',
    enabled: true,
  },
];

interface DashboardStoreState {
  // Mode
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;

  // Filters
  duration: DurationFilter;
  setDuration: (duration: DurationFilter) => void;
  branch: string;
  setBranch: (branch: string) => void;
  financialYear: string;
  setFinancialYear: (year: string) => void;
  currency: 'BDT' | 'USD' | 'EUR';
  setCurrency: (currency: 'BDT' | 'USD' | 'EUR') => void;

  // Chart Views Map (line | bar | area | pie per chart id)
  chartViews: Record<string, ChartView>;
  setChartView: (chartId: string, view: ChartView) => void;

  // Widget visibility toggles
  widgets: Record<DashboardWidgetId, boolean>;
  toggleWidget: (widgetId: DashboardWidgetId) => void;
  setWidgetVisibility: (widgetId: DashboardWidgetId, visible: boolean) => void;
  enableAllWidgets: () => void;
  resetToDefaults: () => void;

  // Layout & UI
  density: LayoutDensity;
  setDensity: (density: LayoutDensity) => void;
  customizerOpen: boolean;
  setCustomizerOpen: (open: boolean) => void;
  lastRefreshed: number;
  triggerRefresh: () => void;
}

const DEFAULT_CHART_VIEWS: Record<string, ChartView> = {
  profitLoss: 'line',
  vouchers: 'bar',
  workingCapital: 'area',
  assetsLiabilities: 'bar',
  expenseBreakdown: 'pie',
};

const DEFAULT_WIDGET_STATE: Record<DashboardWidgetId, boolean> = {
  pendingAlerts: true,
  kpiGrid: true,
  profitLoss: true,
  vouchers: true,
  workingCapital: true,
  assetsLiabilities: true,
  bankLiquidity: true,
  expenseBreakdown: true,
  quickAccess: true,
  recentVouchers: true,
};

export const useDashboardStore = create<DashboardStoreState>()(
  persist(
    (set) => ({
      mode: 'full',
      setMode: (mode) => set({ mode }),

      duration: '1 Year',
      setDuration: (duration) => set({ duration }),

      branch: 'all',
      setBranch: (branch) => set({ branch }),

      financialYear: '2025-2026',
      setFinancialYear: (financialYear) => set({ financialYear }),

      currency: 'BDT',
      setCurrency: (currency) => set({ currency }),

      chartViews: DEFAULT_CHART_VIEWS,
      setChartView: (chartId, view) =>
        set((state) => ({
          chartViews: {
            ...state.chartViews,
            [chartId]: view,
          },
        })),

      widgets: DEFAULT_WIDGET_STATE,
      toggleWidget: (widgetId) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [widgetId]: !state.widgets[widgetId],
          },
        })),
      setWidgetVisibility: (widgetId, visible) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [widgetId]: visible,
          },
        })),
      enableAllWidgets: () =>
        set({
          widgets: DEFAULT_WIDGET_STATE,
        }),
      resetToDefaults: () =>
        set({
          mode: 'full',
          duration: '1 Year',
          branch: 'all',
          financialYear: '2025-2026',
          currency: 'BDT',
          chartViews: DEFAULT_CHART_VIEWS,
          widgets: DEFAULT_WIDGET_STATE,
          density: 'comfortable',
        }),

      density: 'comfortable',
      setDensity: (density) => set({ density }),

      customizerOpen: false,
      setCustomizerOpen: (customizerOpen) => set({ customizerOpen }),

      lastRefreshed: Date.now(),
      triggerRefresh: () => set({ lastRefreshed: Date.now() }),
    }),
    {
      name: 'pakiza-dashboard-preferences-v1',
    }
  )
);
