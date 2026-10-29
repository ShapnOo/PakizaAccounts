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

  return (
    <tr
      className={`border-t-2 border-b font-bold transition-colors ${
        isGrand
          ? 'border-t-indigo-400 border-b-2 border-b-indigo-400 bg-indigo-50/70 text-indigo-950 text-sm'
          : 'border-t-slate-300 border-b-slate-200 bg-slate-100/70 text-slate-900 text-xs'
      }`}
    >
      {/* Particulars + optional BalanceCheckBadge */}
      <td className="py-2.5 px-3">
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

      {/* Indent helper cols */}
      <td className="hidden md:table-cell" />
      <td className="hidden lg:table-cell" />
      <td className="hidden xl:table-cell" />

      {/* Subledger column */}
      {subLedger && (
        <td className="py-2 px-3 border-l border-slate-200 text-slate-300 font-mono text-xs select-none">
          —
        </td>
      )}

      {/* Year values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-2 px-1 text-right border-l border-slate-200"
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

