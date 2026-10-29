import React, { useState } from 'react';
import { formatTBValue } from '../../lib/trialBalanceMath';
import { ValueShowIn, Currency } from '../../types/trialBalance';

interface ValueCellProps {
  value: number;
  valueShowIn: ValueShowIn;
  currency: Currency;
  isTotal?: boolean;
  level?: 1 | 2 | 3 | 4;
}

export const ValueCell: React.FC<ValueCellProps> = ({
  value,
  valueShowIn,
  currency,
  isTotal = false,
  level = 4,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatted = formatTBValue(value, valueShowIn, currency);
  const rawFormatted = new Intl.NumberFormat('en-US').format(value);
  const isZero = value === 0;

  const fontStyle = isTotal
    ? 'font-bold text-slate-950 text-xs'
    : level === 1
    ? 'font-bold text-slate-900 text-xs'
    : level === 2
    ? 'font-semibold text-slate-800 text-xs'
    : isZero
    ? 'text-slate-400 font-normal text-xs'
    : 'text-slate-700 font-medium text-xs';

  return (
    <div
      className="relative text-right w-full py-0.5 px-2 font-sans select-all"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`${fontStyle} font-sans tabular-nums`}>{formatted}</span>

      {showTooltip && (
        <div className="absolute right-0 bottom-full mb-1 z-30 px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-sans font-medium shadow-md whitespace-nowrap pointer-events-none">
          Raw: {rawFormatted} {currency}
        </div>
      )}
    </div>
  );
};
