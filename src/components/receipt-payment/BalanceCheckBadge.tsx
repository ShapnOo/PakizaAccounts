import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatRPValue } from '../../lib/receiptPaymentMath';
import { Currency } from '../../types/receiptPayment';

interface BalanceCheckBadgeProps {
  isBalanced: boolean;
  difference: number;
  currency: Currency;
}

export const BalanceCheckBadge: React.FC<BalanceCheckBadgeProps> = ({
  isBalanced,
  difference,
  currency,
}) => {
  if (isBalanced) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
        <CheckCircle2 className="size-3.5 text-emerald-600" />
        <span>Balanced ✓</span>
      </div>
    );
  }

  const diffFormatted = formatRPValue(Math.abs(difference), currency);

  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
      <AlertCircle className="size-3.5 text-rose-600" />
      <span>Difference: {diffFormatted.text}</span>
    </div>
  );
};
