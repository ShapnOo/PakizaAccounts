import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { currencySymbol } from '../../lib/balanceSheetMath';

interface BalanceCheckBadgeProps {
  isBalanced: boolean;
  difference: number;
  currency: string;
  className?: string;
}

export const BalanceCheckBadge: React.FC<BalanceCheckBadgeProps> = ({
  isBalanced,
  difference,
  currency,
  className = '',
}) => {
  const sym = currencySymbol(currency);
  const diffFormatted = new Intl.NumberFormat('en-IN').format(Math.abs(difference));

  if (isBalanced) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80 shadow-xs ${className}`}
        title="Balance Sheet Equation is Balanced (Total Assets = Total Liabilities & Owner's Equity)"
      >
        <CheckCircle2 className="size-3 text-emerald-600" />
        <span>Balanced ✓</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 shadow-xs ${className}`}
      title={`Out of balance difference: ${sym} ${diffFormatted}`}
    >
      <AlertCircle className="size-3 text-rose-600 animate-pulse" />
      <span>Difference: {sym} {diffFormatted}</span>
    </span>
  );
};

