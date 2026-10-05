import { useDashboardStore } from '../../stores/useDashboardStore';
import { DashboardHeader } from '../../components/dashboard-overview/DashboardHeader';
import { PendingAlertsBanner } from '../../components/dashboard-overview/PendingAlertsBanner';
import { FinancialStatsGrid } from '../../components/dashboard-overview/FinancialStatsGrid';
import { ProfitLossChartCard } from '../../components/dashboard-overview/ProfitLossChartCard';
import { VoucherChartCard } from '../../components/dashboard-overview/VoucherChartCard';
import { WorkingCapitalChartCard } from '../../components/dashboard-overview/WorkingCapitalChartCard';
import { AssetLiabilitiesChartCard } from '../../components/dashboard-overview/AssetLiabilitiesChartCard';
import { ExpenseBreakdownCard } from '../../components/dashboard-overview/ExpenseBreakdownCard';
import { BankLiquidityCard } from '../../components/dashboard-overview/BankLiquidityCard';
import { QuickAccessGrid } from '../../components/dashboard-overview/QuickAccessGrid';
import { RecentVouchersTable } from '../../components/dashboard-overview/RecentVouchersTable';
import { DashboardCustomizerDrawer } from '../../components/dashboard-overview/DashboardCustomizerDrawer';

export function OverviewDashboardPage() {
  const { mode, widgets, density } = useDashboardStore();

  const densitySpacing =
    density === 'compact'
      ? 'space-y-3.5 px-4 sm:px-6 lg:px-8 py-4'
      : density === 'spacious'
      ? 'space-y-6 px-4 sm:px-6 lg:px-8 py-6'
      : 'space-y-4.5 px-4 sm:px-6 lg:px-8 py-5';

  return (
    <div className={`w-full min-w-0 ${densitySpacing}`}>
      {/* Header Controls */}
      <DashboardHeader />

      {/* Pending Schedule & Action Alerts */}
      {widgets.pendingAlerts && <PendingAlertsBanner />}

      {/* Financial KPI Statistics */}
      {widgets.kpiGrid && <FinancialStatsGrid />}

      {/* Mode = Operational: Show Quick Access right after KPIs */}
      {mode === 'operational' && widgets.quickAccess && <QuickAccessGrid />}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profit & Loss Chart */}
        {widgets.profitLoss && (mode === 'executive' || mode === 'full') && (
          <ProfitLossChartCard />
        )}

        {/* Voucher Distribution Chart */}
        {widgets.vouchers && <VoucherChartCard />}

        {/* Working Capital Chart */}
        {widgets.workingCapital && (mode === 'executive' || mode === 'full') && (
          <WorkingCapitalChartCard />
        )}

        {/* Asset & Liabilities Balance */}
        {widgets.assetsLiabilities && (mode === 'executive' || mode === 'full') && (
          <AssetLiabilitiesChartCard />
        )}

        {/* Expense Breakdown */}
        {widgets.expenseBreakdown && (mode === 'executive' || mode === 'full') && (
          <ExpenseBreakdownCard />
        )}

        {/* Cash & Bank Liquidity */}
        {widgets.bankLiquidity && <BankLiquidityCard />}
      </div>

      {/* Mode = Executive / Full: Quick Access */}
      {mode !== 'operational' && widgets.quickAccess && <QuickAccessGrid />}

      {/* Real-time Transactions Ledger Table */}
      {widgets.recentVouchers && (mode === 'operational' || mode === 'full') && (
        <RecentVouchersTable />
      )}

      {/* Slide-over Customization Drawer */}
      <DashboardCustomizerDrawer />
    </div>
  );
}

export default OverviewDashboardPage;
