import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatTBValue } from '../../lib/trialBalanceMath';
import { Currency } from '../../types/trialBalance';

interface BalanceCheckBadgesProps {
  isBalanced: {
    opening: boolean;
    movement: boolean;
    closing: boolean;
  };
  differences: {
    opening: number;
    movement: number;
    closing: number;
  };
  currency: Currency;
}

export const BalanceCheckBadges: React.FC<BalanceCheckBadgesProps> = ({
  isBalanced,
  differences,
  currency,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap font-sans">
      {/* Opening Dimension */}
      {isBalanced.opening ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          <span>Opening: Balanced ✓</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/90 text-rose-700 text-xs font-semibold">
          <AlertCircle className="size-3.5 text-rose-600" />
          <span>Opening Diff: {formatTBValue(Math.abs(differences.opening), 'N/A', currency)}</span>
        </span>
      )}

      {/* Movement Dimension */}
      {isBalanced.movement ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          <span>Movement: Balanced ✓</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/90 text-rose-700 text-xs font-semibold">
          <AlertCircle className="size-3.5 text-rose-600" />
          <span>Movement Diff: {formatTBValue(Math.abs(differences.movement), 'N/A', currency)}</span>
        </span>
      )}

      {/* Closing Dimension */}
      {isBalanced.closing ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          <span>Closing: Balanced ✓</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/90 text-rose-700 text-xs font-semibold">
          <AlertCircle className="size-3.5 text-rose-600" />
          <span>Closing Diff: {formatTBValue(Math.abs(differences.closing), 'N/A', currency)}</span>
        </span>
      )}
    </div>
  );
};

