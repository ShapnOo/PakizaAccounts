import React from 'react';
import { MovementRow as MovementRowType } from '../../types/retainedEarnings';
import { formatBDT } from '../../lib/retainedEarningsMath';

interface MovementRowProps {
  row: MovementRowType;
  isHoveredLinked: boolean;
  onHoverLink: (hovered: boolean) => void;
}

export const MovementRow: React.FC<MovementRowProps> = ({
  row,
  isHoveredLinked,
  onHoverLink,
}) => {
  const isClosing = row.rowType === 'closing';
  const isAdd = row.rowType === 'add';
  const isLess = row.rowType === 'less';
  const isIndent = isAdd || isLess;

  // Split label into colored prefix and text
  let prefix = '';
  let restOfLabel = row.label;

  if (isAdd && row.label.startsWith('Add:')) {
    prefix = 'Add:';
    restOfLabel = row.label.replace(/^Add:\s*/, '');
  } else if (isLess && row.label.startsWith('Less:')) {
    prefix = 'Less:';
    restOfLabel = row.label.replace(/^Less:\s*/, '');
  }

  const rowBg = isClosing
    ? isHoveredLinked
      ? 'bg-emerald-100/60 transition-colors'
      : 'bg-indigo-50/50'
    : 'hover:bg-slate-50/70 transition-colors';

  const rowBorder = isClosing
    ? 'border-t-2 border-slate-300'
    : 'border-b border-slate-200';

  return (
    <tr
      className={`${rowBg} ${rowBorder} font-sans`}
      onMouseEnter={() => isClosing && onHoverLink(true)}
      onMouseLeave={() => isClosing && onHoverLink(false)}
    >
      {/* Particulars Cell */}
      <td className={`py-2.5 px-4 text-xs ${isIndent ? 'pl-8' : ''}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {prefix && (
              <span
                className={`font-semibold ${
                  isAdd ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {prefix}
              </span>
            )}
            <span
              className={`${
                isClosing
                  ? 'font-bold text-slate-900'
                  : 'font-normal text-slate-700'
              }`}
            >
              {restOfLabel}
            </span>
          </div>

          {isClosing && (
            <span
              className={`text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded transition ${
                isHoveredLinked
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
              title="Reconciled tie-in with Equity Earnings snapshot"
            >
              → Equity
            </span>
          )}
        </div>
      </td>

      {/* Amount (BDT) Cell */}
      <td
        className={`py-2.5 px-4 text-right text-xs tabular-nums font-sans ${
          isClosing
            ? 'font-bold text-indigo-950'
            : row.amount < 0
            ? 'text-rose-600 font-medium'
            : 'text-slate-800 font-normal'
        }`}
      >
        {formatBDT(row.amount)}
      </td>
    </tr>
  );
};

