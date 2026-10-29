import React from 'react';
import { BSTreeRow, ValueShowIn } from '../../types/balanceSheet';
import { ValueCell } from './ValueCell';
import { BalanceCheckBadge } from './BalanceCheckBadge';

interface TotalRowProps {
  row: BSTreeRow;
  years: string[];
  subLedger: boolean;
  currency: string;
  showInPercent: boolean;
  baseForPercent: number | null;
  valueShowIn: ValueShowIn;
  isGrandTotal?: boolean;
  isBalanced?: boolean;
  balanceDifference?: number;
}

export const TotalRow: React.FC<TotalRowProps> = ({
  row,
  years,
  subLedger,
  currency,
  showInPercent,
  baseForPercent,
  valueShowIn,
  isGrandTotal = false,
  isBalanced = true,
  balanceDifference = 0,
}) => {
  const isGrand = isGrandTotal || row.id === 'le-grand';
  const bgClass = isGrand ? 'bg-indigo-50/80 text-indigo-950' : 'bg-slate-100/80 text-slate-900';
  const stickyBg = isGrand ? 'bg-indigo-50' : 'bg-slate-100';

  return (
    <tr
      className={`border-t-2 border-b font-bold transition-colors font-sans text-xs ${bgClass} ${
        isGrand
          ? 'border-t-indigo-400 border-b-2 border-b-indigo-400'
          : 'border-t-slate-300 border-b-slate-200'
      }`}
    >
      {/* Particulars + optional BalanceCheckBadge: Sticky left for mobile */}
      <td
        className={`py-2 px-3 sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] ${stickyBg}`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="tracking-tight">{row.label}</span>
          {isGrand && (
            <BalanceCheckBadge
              isBalanced={isBalanced}
              difference={balanceDifference}
              currency={currency}
            />
          )}
        </div>
      </td>

      {/* L-2, L-3, L-4 Column Aligners */}
      <td className="w-12 min-w-[48px] border-l border-slate-200" />
      <td className="w-12 min-w-[48px] border-l border-slate-200" />
      <td className="w-12 min-w-[48px] border-l border-slate-200" />

      {/* Subledger Column */}
      {subLedger && (
        <td className="py-2 px-3 border-l border-slate-200 text-slate-300 font-sans text-xs select-none">
          —
        </td>
      )}

      {/* Year Values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-2 px-1 text-right border-l border-slate-200 font-sans"
        >
          <ValueCell
            value={row.values[idx] || 0}
            currency={currency}
            showInPercent={showInPercent}
            baseForPercent={baseForPercent}
            valueShowIn={valueShowIn}
            isTotal
          />
        </td>
      ))}
    </tr>
  );
};
