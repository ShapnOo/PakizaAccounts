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
  const isSecondSide = row.side === 'liabilities-equity' && row.id === 'le';

  return (
    <tr
      className={`border-b border-indigo-200/80 bg-indigo-50/70 hover:bg-indigo-100/50 transition-colors font-sans ${
        isSecondSide ? 'border-t-4 border-t-indigo-300' : ''
      }`}
    >
      {/* Particulars with chevron: Sticky on the left */}
      <td
        className="py-2.5 px-3 font-bold text-xs text-indigo-950 sticky left-0 z-10 bg-indigo-50/95 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] cursor-pointer select-none"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="p-0.5 rounded hover:bg-indigo-200/70 text-indigo-700 transition-colors shrink-0"
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

      {/* L-2, L-3, L-4 Column Aligners */}
      <td className="w-12 min-w-[48px] border-l border-indigo-100/80" />
      <td className="w-12 min-w-[48px] border-l border-indigo-100/80" />
      <td className="w-12 min-w-[48px] border-l border-indigo-100/80" />

      {/* Subledger Column */}
      {subLedger && (
        <td className="py-2 px-3 border-l border-indigo-100 text-slate-300 font-sans text-xs select-none">
          —
        </td>
      )}

      {/* Year Values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-2 px-1 text-right border-l border-indigo-100 font-sans"
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
