import React, { useState } from 'react';
import { formatRPValue } from '../../lib/receiptPaymentMath';
import { convertFromBase } from '../../lib/currencyConversion';
import { Currency, ValueShowIn } from '../../types/receiptPayment';

interface ValueCellProps {
  value: number;
  currency: Currency;
  valueShowIn: ValueShowIn;
  isTotal?: boolean;
  isGrandTotal?: boolean;
  isHeader?: boolean;
}

export const ValueCell: React.FC<ValueCellProps> = ({
  value,
  currency,
  valueShowIn,
  isTotal = false,
  isGrandTotal = false,
  isHeader = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const { text, isZero, isNegative } = formatRPValue(
    value,
    currency,
    valueShowIn
  );

  const rawConverted = convertFromBase(value, currency);
  const rawFormatted = new Intl.NumberFormat(currency === 'BDT' ? 'en-IN' : 'en-US', {
    minimumFractionDigits: currency === 'BDT' ? 0 : 2,
    maximumFractionDigits: currency === 'BDT' ? 0 : 2,
  }).format(rawConverted);

  // Exact Inter font styling with uniform text-xs size matching row labels
  const fontStyle = isZero
    ? 'text-slate-300 font-sans text-xs'
    : isNegative
    ? 'text-rose-600 font-semibold font-sans text-xs'
    : isGrandTotal
    ? 'text-indigo-950 font-bold font-sans text-xs'
    : isTotal
    ? 'text-slate-900 font-bold font-sans text-xs'
    : isHeader
    ? 'text-slate-800 font-bold font-sans text-xs'
    : 'text-slate-800 font-medium font-sans text-xs';

  return (
    <div
      className="relative text-right w-full py-0.5 px-2 select-all font-sans"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={fontStyle}>{text}</span>

      {showTooltip && (
        <div className="absolute right-0 bottom-full mb-1 z-30 px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-sans font-medium shadow-md whitespace-nowrap pointer-events-none">
          Raw: {rawFormatted} {currency}
        </div>
      )}
    </div>
  );
};

