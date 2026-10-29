import React from 'react';
import { EquityRow as EquityRowType } from '../../types/retainedEarnings';
import { formatBDT } from '../../lib/retainedEarningsMath';
import { LinkedValueIndicator } from './LinkedValueIndicator';

interface EquityRowProps {
  row: EquityRowType;
  isHoveredLinked: boolean;
  onHoverLink: (hovered: boolean) => void;
}

export const EquityRow: React.FC<EquityRowProps> = ({
  row,
  isHoveredLinked,
  onHoverLink,
}) => {
  const isLinked = row.source === 'linked';

  const rowBg =
    isLinked && isHoveredLinked
      ? 'bg-emerald-100/60 transition-colors'
      : 'hover:bg-slate-50/70 transition-colors';

  return (
    <tr
      className={`${rowBg} border-b border-slate-200 font-sans`}
      onMouseEnter={() => isLinked && onHoverLink(true)}
      onMouseLeave={() => isLinked && onHoverLink(false)}
    >
      {/* Particulars Cell */}
      <td className="py-2.5 px-4 text-xs font-normal text-slate-700">
        {isLinked ? (
          <LinkedValueIndicator
            label={row.label}
            tooltipText="Linked to Closing Retained Earnings on the left panel"
            badgeText="← Retained"
            isHovered={isHoveredLinked}
          />
        ) : (
          <span>{row.label}</span>
        )}
      </td>

      {/* Amount (BDT) Cell */}
      <td
        className={`py-2.5 px-4 text-right text-xs tabular-nums font-sans ${
          isLinked
            ? 'font-bold text-emerald-950'
            : 'text-slate-800 font-normal'
        }`}
      >
        {formatBDT(row.amount)}
      </td>
    </tr>
  );
};

