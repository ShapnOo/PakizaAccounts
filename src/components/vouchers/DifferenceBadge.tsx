import React from 'react';
import { CheckCircle2, AlertCircle, Scale } from 'lucide-react';

interface DifferenceBadgeProps {
  difference: number;
  totalDebitBDT?: number;
  totalCreditBDT?: number;
  className?: string;
}

export const DifferenceBadge: React.FC<DifferenceBadgeProps> = ({
  difference,
  totalDebitBDT,
  totalCreditBDT,
  className = '',
}) => {
  const isBalanced = Math.abs(difference) < 0.01;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isBalanced ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="size-3.5 stroke-[2.5]" />
          <span>Balanced (0.00)</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25 text-xs font-bold shadow-2xs animate-pulse">
          <AlertCircle className="size-3.5 stroke-[2.5]" />
          <span>
            Difference: {difference > 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)} BDT
          </span>
        </span>
      )}
    </div>
  );
};
