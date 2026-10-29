import React from 'react';
import { BSTreeRow, ValueShowIn } from '../../types/balanceSheet';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { ValueCell } from './ValueCell';

interface SectionHeaderRowProps {
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

export const SectionHeaderRow: React.FC<SectionHeaderRowProps> = ({
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
  return (
    <tr className="border-b border-slate-200 bg-slate-100/60 hover:bg-slate-100/80 transition-colors font-sans">
      {/* Particulars with chevron: Sticky on the left */}
      <td
        className="py-2.5 px-3 font-bold text-xs text-slate-900 sticky left-0 z-10 bg-slate-100/95 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] cursor-pointer select-none"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="p-0.5 rounded hover:bg-slate-200/70 text-slate-600 transition-colors shrink-0 cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
          <span className="tracking-tight uppercase">{row.label}</span>
        </div>
      </td>

      {/* L-2, L-3, L-4 Column Aligners (Uniform 1px border) */}
      <td className="w-12 min-w-[48px] border-l border-slate-200/70" />
      <td className="w-12 min-w-[48px] border-l border-slate-200/70" />
      <td className="w-12 min-w-[48px] border-l border-slate-200/70" />

      {/* Subledger Column */}
      {subLedger && (
        <td className="py-2 px-3 border-l border-slate-200/70 text-slate-300 font-sans text-xs select-none">
          —
        </td>
      )}

      {/* Year Values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-2 px-1 text-right border-l border-slate-200/70 font-sans"
        >
          <ValueCell
            value={row.values[idx] || 0}
            currency={currency}
            showInPercent={showInPercent}
            baseForPercent={baseForPercent}
            valueShowIn={valueShowIn}
            isHeader
          />
        </td>
      ))}
    </tr>
  );
};
