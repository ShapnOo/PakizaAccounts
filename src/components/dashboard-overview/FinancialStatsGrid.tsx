import {
  TrendingUp,
  TrendingDown,
  Wallet,
  WalletCards,
  Landmark,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { getFinancialKpis } from '../../services/dashboardService';

const toneStyles = {
  income: {
    accent: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-900/60',
    bgLight: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    icon: TrendingUp,
  },
  expense: {
    accent: 'bg-rose-500',
    border: 'border-rose-200 dark:border-rose-900/60',
    bgLight: 'from-rose-500/10 via-rose-500/5 to-transparent',
    iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    pill: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    icon: TrendingDown,
  },
  profit: {
    accent: 'bg-blue-600',
    border: 'border-blue-200 dark:border-blue-900/60',
    bgLight: 'from-blue-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    icon: Scale,
  },
  receivable: {
    accent: 'bg-indigo-600',
    border: 'border-indigo-200 dark:border-indigo-900/60',
    bgLight: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    pill: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    icon: WalletCards,
  },
  payable: {
    accent: 'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-900/60',
    bgLight: 'from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    icon: Wallet,
  },
  cash: {
    accent: 'bg-cyan-600',
    border: 'border-cyan-200 dark:border-cyan-900/60',
    bgLight: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    pill: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    icon: Landmark,
  },
};

export function FinancialStatsGrid() {
  const { duration, branch, currency } = useDashboardStore();
  const kpis = getFinancialKpis(duration, branch, currency);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi) => {
        const tone = toneStyles[kpi.type];
        const Icon = tone.icon;

        return (
          <div
            key={kpi.id}
            className={`group relative overflow-hidden rounded-2xl border ${tone.border} bg-card p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
          >
            {/* Top Accent line */}
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${tone.accent} from-transparent`}
            />

            {/* Subtle Gradient Glow */}
            <div
              className={`absolute inset-0 pointer-events-none bg-radial ${tone.bgLight} opacity-50`}
            />

            <div className="relative flex flex-col justify-between h-full space-y-3">
              {/* Header: Label + Icon Box */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide leading-tight">
                  {kpi.label}
                </span>
                <div
                  className={`size-8 rounded-xl ${tone.iconBg} flex items-center justify-center shadow-inner shrink-0`}
                >
                  <Icon className="size-4" />
                </div>
              </div>

              {/* Value */}
              <div>
                <p className="text-xl font-black text-foreground tracking-tight">
                  {kpi.formattedValue}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {kpi.note}
                </p>
              </div>

              {/* Footer Pill */}
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone.pill}`}
                >
                  {kpi.isPositive ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  <span>{kpi.badge}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
