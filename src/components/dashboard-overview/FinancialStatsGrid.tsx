import {
  TrendingUp,
  TrendingDown,
  Wallet,
  WalletCards,
  Landmark,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { getFinancialKpis } from '../../services/dashboardService';

const toneConfig = {
  income: {
    icon: TrendingUp,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    pillText: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30',
  },
  expense: {
    icon: TrendingDown,
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    pillText: 'text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/30',
  },
  profit: {
    icon: Scale,
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
    pillText: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/30',
  },
  receivable: {
    icon: WalletCards,
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    pillText: 'text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/30',
  },
  payable: {
    icon: Wallet,
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    pillText: 'text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/30',
  },
  cash: {
    icon: Landmark,
    iconBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
    pillText: 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/30',
  },
};

export function FinancialStatsGrid() {
  const { duration, branch, currency } = useDashboardStore();
  const kpis = getFinancialKpis(duration, branch, currency);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi) => {
        const config = toneConfig[kpi.type] || toneConfig.income;
        const Icon = config.icon;

        return (
          <div
            key={kpi.id}
            className="group relative rounded-xl border border-border/70 bg-card p-4 shadow-2xs hover:shadow-sm hover:border-border transition-all duration-150 flex flex-col justify-between"
          >
            {/* Header: Label + Soft Icon */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {kpi.label}
              </span>
              <div
                className={`size-7.5 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className="size-4" />
              </div>
            </div>

            {/* Value & Subtitle */}
            <div className="space-y-0.5 my-1">
              <p className="text-xl font-bold tracking-tight text-foreground font-mono">
                {kpi.formattedValue}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {kpi.note}
              </p>
            </div>

            {/* Bottom Badge */}
            <div className="pt-2 mt-1 border-t border-border/40 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${config.pillText}`}
              >
                {kpi.isPositive ? (
                  <ArrowUpRight className="size-3 shrink-0" />
                ) : (
                  <ArrowDownRight className="size-3 shrink-0" />
                )}
                <span>{kpi.badge}</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">
                vs last period
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
