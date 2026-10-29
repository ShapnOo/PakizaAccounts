import React, { useState } from 'react';
import { formatValue } from '../../lib/balanceSheetMath';
import { ValueShowIn } from '../../types/balanceSheet';

interface ValueCellProps {
  value: number;
  currency: string;
  showInPercent: boolean;
  baseForPercent: number | null;
  valueShowIn: ValueShowIn;
  isTotal?: boolean;
  isHeader?: boolean;
}

export const ValueCell: React.FC<ValueCellProps> = ({
  value,
  currency,
  showInPercent,
  baseForPercent,
  valueShowIn,
  isTotal = false,
  isHeader = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const { text, isZero, isNegative } = formatValue(
    value,
    currency,
    showInPercent,
    baseForPercent,
    valueShowIn
  );

  const rawFormatted = new Intl.NumberFormat('en-US').format(value);

  // Exact matching font size (text-xs = 12px) and Inter font family (font-sans)
  const fontStyle = isZero
    ? 'text-slate-300 font-sans'
    : isNegative
    ? 'text-rose-600 font-semibold'
    : isTotal
    ? 'text-slate-950 font-bold'
    : isHeader
    ? 'text-indigo-900 font-bold'
    : 'text-slate-800 font-medium';

  return (
    <div
      className="relative text-right w-full py-0.5 px-2.5 select-all tabular-nums font-sans"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`inline-block text-xs font-sans transition-colors duration-150 ${fontStyle}`}>
        {text}
      </span>

      {/* Tooltip with raw number on hover */}
      {showTooltip && (
        <div className="absolute right-2 -top-7 z-30 pointer-events-none px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-sans shadow-md whitespace-nowrap">
          Raw: {rawFormatted} {currency}
        </div>
      )}
    </div>
  );
};
