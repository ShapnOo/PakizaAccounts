import React from 'react';
import { BSTreeRow, ValueShowIn, LEVEL_COLORS } from '../../types/balanceSheet';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { ValueCell } from './ValueCell';

interface ParentRowProps {
  row: BSTreeRow;
  years: string[];
  subLedger: boolean;
  currency: string;
  showInPercent: boolean;
  baseForPercent: number | null;
  valueShowIn: ValueShowIn;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ParentRow: React.FC<ParentRowProps> = ({
  row,
  years,
  subLedger,
  currency,
  showInPercent,
  baseForPercent,
  valueShowIn,
  isCollapsed,
  onToggleCollapse,
}) => {
  const colorClass = LEVEL_COLORS[row.level] || 'text-slate-800';
  const indentPadding = (row.level - 1) * 14;

  return (
    <tr
      data-raw-label={row.rawLabel || row.label}
      className="border-b border-slate-100 hover:bg-slate-50 transition-colors font-sans"
    >
      {/* Particulars cell: Sticky on the left for mobile responsiveness */}
      <td
        className="py-1.5 px-3 text-xs font-semibold sticky left-0 bg-white z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] cursor-pointer select-none"
        style={{ paddingLeft: `${12 + indentPadding}px` }}
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-0.5 -ml-1 rounded hover:bg-slate-200/70 text-slate-500 transition-colors shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
          <span className={`tracking-tight ${colorClass}`}>{row.label}</span>
        </div>
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

      {/* L-4 Column */}
      <td className="py-1 px-1 text-center w-12 min-w-[48px] border-l border-slate-100 whitespace-nowrap">
        {row.level === 4 && (
          <span className="inline-block text-[10px] font-bold px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 leading-none">
            L-4
          </span>
        )}
      </td>

      {/* Subledger Column */}
      {subLedger && (
        <td className="py-1 px-3 border-l border-slate-100 text-slate-300 font-sans text-xs select-none">
          —
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
            isTotal={false}
          />
        </td>
      ))}
    </tr>
  );
};
