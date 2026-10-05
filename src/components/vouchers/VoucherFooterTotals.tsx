import React from 'react';
import { VoucherTotalsResult } from '../../lib/voucherMath';
import { VoucherType } from '../../types/voucher';
import { DifferenceBadge } from './DifferenceBadge';
import { Calculator } from 'lucide-react';

interface VoucherFooterTotalsProps {
  voucherType: VoucherType;
  totals: VoucherTotalsResult;
}

export const VoucherFooterTotals: React.FC<VoucherFooterTotalsProps> = ({
  voucherType,
  totals,
}) => {
  const isDoubleEntry =
    voucherType === 'Journal Voucher' || voucherType === 'Contra Voucher';

  return (
    <div className="p-4 rounded-xl bg-card border border-border/80 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2">
          <Calculator className="size-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            Voucher Summary & Reconciliation
          </span>
        </div>

        {isDoubleEntry && (
          <DifferenceBadge
            difference={totals.difference}
            totalDebitBDT={totals.totalDebitBDT}
            totalCreditBDT={totals.totalCreditBDT}
          />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* If Double Entry (Journal, Contra) */}
        {isDoubleEntry ? (
          <>
            <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase">
                Total Debit
              </span>
              <p className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {totals.totalDebit.toFixed(2)}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/15">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase">
                Total Credit
              </span>
              <p className="font-mono text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {totals.totalCredit.toFixed(2)}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase">
                Total Debit (BDT)
              </span>
              <p className="font-mono text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                {totals.totalDebitBDT.toFixed(2)}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase">
                Total Credit (BDT)
              </span>
              <p className="font-mono text-base font-black text-rose-700 dark:text-rose-400 mt-0.5">
                {totals.totalCreditBDT.toFixed(2)}
              </p>
            </div>
          </>
        ) : voucherType === 'Payment Voucher' ? (
          /* Payment Voucher: Debit Only */
          <div className="sm:col-span-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              Total Payment (Debit BDT)
            </span>
            <p className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-400 mt-1">
              {totals.totalDebitBDT.toFixed(2)} BDT
            </p>
          </div>
        ) : (
          /* Receive Voucher: Credit Only */
          <div className="sm:col-span-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">
              Total Receive (Credit BDT)
            </span>
            <p className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-400 mt-1">
              {totals.totalCreditBDT.toFixed(2)} BDT
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
