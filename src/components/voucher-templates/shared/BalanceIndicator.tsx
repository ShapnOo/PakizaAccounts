import React from 'react';
import { formatCurrency } from '../../../lib/format';

interface BalanceIndicatorProps {
  totals: {
    isBalanced: boolean;
    difference: number;
  };
}

export const BalanceIndicator: React.FC<BalanceIndicatorProps> = ({ totals }) => {
  if (totals.isBalanced) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
        <span>●</span>
        <span>BALANCED (BDT)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200">
      <span>▲</span>
      <span>
        OUT OF BALANCE: {formatCurrency(Math.abs(totals.difference), 'BDT')}
      </span>
    </div>
  );
};

