import React from 'react';
import { DifferenceBadge } from './DifferenceBadge';
import { formatCurrency } from '../../lib/format';

interface TotalsFooterProps {
  totalDebitBDT: number;
  totalCreditBDT: number;
  difference: number;
  balanced: boolean;
  shake?: boolean;
}

export const TotalsFooter: React.FC<TotalsFooterProps> = ({
  totalDebitBDT,
  totalCreditBDT,
  difference,
  balanced,
  shake,
}) => {
  return (
    <div className="border-t border-border/80 bg-muted/20 divide-y divide-border/60 text-xs font-semibold">
      {/* ── Row 1: Total ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2.5 gap-2 bg-slate-100/70 dark:bg-muted/40">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <span>Summary Totals</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">(BDT Converted)</span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
              Total Debit:
            </span>
            <span className="font-mono font-bold text-foreground text-sm tabular-nums">
              ৳ {formatCurrency(totalDebitBDT)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
              Total Credit:
            </span>
            <span className="font-mono font-bold text-foreground text-sm tabular-nums">
              ৳ {formatCurrency(totalCreditBDT)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Difference / Reconciliation ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 gap-2 bg-background">
        <div className="text-[11px] text-muted-foreground">
          Double-entry rule: <span className="font-semibold text-foreground">Total Debit (BDT)</span> must exactly equal{' '}
          <span className="font-semibold text-foreground">Total Credit (BDT)</span>.
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Reconciliation:
          </span>
          <DifferenceBadge difference={difference} balanced={balanced} shake={shake} />
        </div>
      </div>
    </div>
  );
};
