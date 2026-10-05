import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  Clock,
  Coins,
  CreditCard,
  Building,
} from 'lucide-react';
import {
  formatBDTAmount,
  getBankLiquidityData,
} from '../../services/dashboardService';

export function BankLiquidityCard() {
  const accounts = useMemo(() => getBankLiquidityData(), []);
  const totalLiquidity = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between h-[360px] transition-all duration-200 hover:shadow-md">
      {/* Card Header */}
      <div className="flex items-start justify-between pb-2.5 border-b border-border/40 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              Cash & Bank Liquidity
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">
              {accounts.length} Active Heads
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Total Liquid Balance:{' '}
            <strong className="text-foreground font-mono">
              {formatBDTAmount(totalLiquidity)}
            </strong>
          </p>
        </div>

        <Link
          to="/cheques/register"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
        >
          <span>Cheque Register</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Account Balance List */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-2 space-y-2.5 pr-1 min-h-0">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="group p-2 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/70 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  {acc.accountType === 'Cash' ? (
                    <Coins className="size-3.5" />
                  ) : (
                    <Building className="size-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {acc.bankName}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">
                    {acc.accountNo} • {acc.accountType}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-bold text-foreground">
                  {formatBDTAmount(acc.balance)}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {acc.percentageOfTotal}%
                  </span>
                  {acc.status === 'Reconciled' ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                      <ShieldCheck className="size-2.5" />
                      <span>Reconciled</span>
                    </span>
                  ) : acc.status === 'Pending' ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                      <Clock className="size-2.5" />
                      <span>Unreconciled</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold">
                      <span>Live</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Share Bar */}
            <div className="mt-1.5 h-1 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-cyan-600 rounded-full"
                style={{ width: `${acc.percentageOfTotal}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] shrink-0">
        <Link
          to="/banks"
          className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1"
        >
          <Landmark className="size-3" />
          <span>Manage Banks & Branches</span>
        </Link>
        <Link
          to="/cheques/prepare/direct"
          className="text-primary hover:underline font-bold flex items-center gap-1"
        >
          <span>Issue Cheque</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
