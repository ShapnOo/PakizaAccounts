import React from 'react';
import { BSTreeRow, ValueShowIn, LEVEL_COLORS } from '../../types/balanceSheet';
import { SubLedgerCell } from './SubLedgerCell';
import { ValueCell } from './ValueCell';

interface LeafRowProps {
  row: BSTreeRow;
  years: string[];
  subLedger: boolean;
  currency: string;
  showInPercent: boolean;
  baseForPercent: number | null;
  valueShowIn: ValueShowIn;
}

export const LeafRow: React.FC<LeafRowProps> = ({
  row,
  years,
  subLedger,
  currency,
  showInPercent,
  baseForPercent,
  valueShowIn,
}) => {
  const colorClass = LEVEL_COLORS[row.level] || 'text-slate-700';
  const indentPadding = (row.level - 1) * 14 + (row.level === 5 ? 20 : 0);

  return (
    <tr
      data-raw-label={row.rawLabel || row.label}
      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors font-sans"
    >
      {/* Particulars Cell: Sticky left for horizontal scroll */}
      <td
        className="py-1.5 px-3 text-xs font-normal sticky left-0 bg-white z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]"
        style={{ paddingLeft: `${16 + indentPadding}px` }}
      >
        <span className={`tracking-tight ${colorClass}`}>{row.label}</span>
      </td>

      {/* L-2 Column */}
      <td className="py-1 px-1 text-center w-12 min-w-[48px] border-l border-slate-100 whitespace-nowrap">
        {row.level === 2 && (
          <span className="inline-block text-[10px] font-bold px-1 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 leading-none">
            L-2
          </span>
        )}
      </td>

      {/* L-3 Column */}
      <td className="py-1 px-1 text-center w-12 min-w-[48px] border-l border-slate-100 whitespace-nowrap">
        {row.level === 3 && (
          <span className="inline-block text-[10px] font-bold px-1 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60 leading-none">
            L-3
          </span>
        )}
      </td>

      {/* L-4 Column (shows L-4 or L-5) */}
      <td className="py-1 px-1 text-center w-12 min-w-[48px] border-l border-slate-100 whitespace-nowrap">
        {row.level === 4 && (
          <span className="inline-block text-[10px] font-bold px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 leading-none">
            L-4
          </span>
        )}
        {row.level === 5 && (
          <span className="inline-block text-[10px] font-bold px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60 leading-none">
            L-5
          </span>
        )}
      </td>

      {/* Subledger Column */}
      {subLedger && (
        <td className="py-1 px-3 border-l border-slate-100">
          <SubLedgerCell subLedger={row.subLedger} isParent={false} />
        </td>
      )}

      {/* Year Values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-1 px-1 text-right border-l border-slate-100 font-sans"
        >
          <ValueCell
            value={row.values[idx] || 0}
            currency={currency}
            showInPercent={showInPercent}
            baseForPercent={baseForPercent}
            valueShowIn={valueShowIn}
          />
        </td>
      ))}
    </tr>
  );
};
