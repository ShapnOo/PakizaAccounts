import React from 'react';
import { formatCurrency } from '../../lib/format';

interface PreviewTotalsProps {
  totalDebit: number;
  totalCredit: number;
  fontSize: number;
  textColor: string;
}

export const PreviewTotals: React.FC<PreviewTotalsProps> = ({
  totalDebit = 15000,
  totalCredit = 15000,
  fontSize = 9,
  textColor,
}) => {
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference === 0;

  return (
    <div className="flex justify-end pt-1">
      <div
        className="w-72 bg-slate-50/80 dark:bg-muted/20 border border-slate-900/40 rounded p-2 space-y-1 font-mono"
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-border/60 pb-1">
          <span className="font-bold uppercase tracking-wider">Total Debit (BDT):</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">
            ৳ {formatCurrency(totalDebit)}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-border/60 pb-1">
          <span className="font-bold uppercase tracking-wider">Total Credit (BDT):</span>
          <span className="font-bold text-rose-700 dark:text-rose-400">
            ৳ {formatCurrency(totalCredit)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-0.5 text-[10px]">
          <span className="text-slate-500 font-semibold uppercase">
            Difference:
          </span>
          <span
            className={`font-bold ${
              isBalanced
                ? 'text-slate-600 dark:text-slate-400'
                : 'text-rose-600 font-extrabold'
            }`}
          >
            {isBalanced ? '0.00 (Balanced)' : `৳ ${formatCurrency(difference)}`}
          </span>
        </div>
      </div>
    </div>
  );
};
