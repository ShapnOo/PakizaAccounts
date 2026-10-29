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

  // Indentation calculation based on level (1 to 5)
  // L4: base indent, L5: extra 24px sub-indent
  const indentPadding = (row.level - 1) * 14 + (row.level === 5 ? 24 : 0);

  return (
    <tr
      data-raw-label={row.rawLabel || row.label}
      className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
    >
      {/* Particulars cell with level-based padding */}
      <td
        className="py-1.5 px-3 text-xs font-normal"
        style={{ paddingLeft: `${16 + indentPadding}px` }}
      >
        <span className={`tracking-tight ${colorClass}`}>{row.label}</span>
      </td>

      {/* Indent helper cols */}
      <td className="hidden md:table-cell py-1 px-2 text-[10px] text-slate-300 font-mono">
        {row.level === 2 ? '•' : ''}
      </td>
      <td className="hidden lg:table-cell py-1 px-2 text-[10px] text-slate-300 font-mono">
        {row.level === 3 ? '••' : ''}
      </td>
      <td className="hidden xl:table-cell py-1 px-2 text-[10px] text-slate-300 font-mono">
        {row.level >= 4 ? '••••' : ''}
      </td>

      {/* Subledger cell */}
      {subLedger && (
        <td className="py-1 px-3 border-l border-slate-100">
          <SubLedgerCell subLedger={row.subLedger} isParent={false} />
        </td>
      )}

      {/* Year values */}
      {years.map((_, idx) => (
        <td
          key={idx}
          className="py-1 px-1 text-right border-l border-slate-100"
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

