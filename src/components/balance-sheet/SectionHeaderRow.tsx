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
      className={`border-b border-indigo-200/70 bg-indigo-50/50 hover:bg-indigo-100/40 transition-colors ${
        isSecondSide ? 'border-t-4 border-t-indigo-300/80 mt-4' : ''
      }`}
    >
      {/* Particulars with chevron */}
      <td
        className="py-2.5 px-3 font-extrabold text-sm text-indigo-900 flex items-center gap-1.5 cursor-pointer select-none"
        onClick={onToggleCollapse}
      >
        <button
          type="button"
          className="p-0.5 rounded hover:bg-indigo-200/60 text-indigo-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>
        <span className="tracking-tight">{row.label}</span>
      </td>

      {/* Indentation level helper cols */}
      <td className="hidden md:table-cell" />
      <td className="hidden lg:table-cell" />
      <td className="hidden xl:table-cell" />

      {/* Subledger column */}
      {subLedger && (
        <td className="py-2 px-3 border-l border-indigo-100 text-slate-300 font-mono text-xs select-none">
          —
        </td>
      )}

      {/* Year values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-2 px-1 text-right border-l border-indigo-100/70"
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

