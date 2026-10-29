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

  // Indentation calculation based on level (1 to 5)
  // L1: 0, L2: 14px, L3: 28px, L4: 42px, L5: 66px
  const indentPadding = (row.level - 1) * 14;

  return (
    <tr
      data-raw-label={row.rawLabel || row.label}
      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors font-semibold"
    >
      {/* Particulars cell with level-based padding and chevron */}
      <td
        className="py-2 px-3 text-xs flex items-center gap-1 cursor-pointer select-none"
        style={{ paddingLeft: `${12 + indentPadding}px` }}
        onClick={onToggleCollapse}
      >
        <button
          type="button"
          className="p-0.5 -ml-1 rounded hover:bg-slate-200/60 text-slate-500 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>
        <span className={`tracking-tight ${colorClass}`}>{row.label}</span>
      </td>

      {/* Indentation helper columns */}
      <td className="hidden md:table-cell py-1 px-2 text-[10px] text-slate-300 font-mono">
        {row.level === 2 ? '•' : ''}
      </td>
      <td className="hidden lg:table-cell py-1 px-2 text-[10px] text-slate-300 font-mono">
        {row.level === 3 ? '••' : ''}
      </td>
      <td className="hidden xl:table-cell py-1 px-2 text-[10px] text-slate-300 font-mono">
        {row.level >= 4 ? '•••' : ''}
      </td>

      {/* Subledger cell (dash for parents) */}
      {subLedger && (
        <td className="py-1 px-3 border-l border-slate-100 text-slate-300 font-mono text-xs select-none">
          —
        </td>
      )}

      {/* Year values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-1 px-1 text-right border-l border-slate-100 font-semibold"
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

