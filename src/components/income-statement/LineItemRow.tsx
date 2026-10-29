import React from 'react';
import { ISRow, ValueShowIn } from '../../types/incomeStatement';
import { ValueCell } from './ValueCell';

interface LineItemRowProps {
  row: ISRow;
  currency: string;
  showInPercent: boolean;
  valueShowIn: ValueShowIn;
  isPeriodMode: boolean;
}

export const LineItemRow: React.FC<LineItemRowProps> = ({
  row,
  currency,
  showInPercent,
  valueShowIn,
  isPeriodMode,
}) => {
  const totalVal = row.values.reduce((acc, curr) => acc + curr, 0);

  const totalCell = (
    <td className="py-1 px-1 text-right bg-slate-50/80 border-r border-slate-200">
      <ValueCell
        value={totalVal}
        currency={currency}
        showInPercent={false}
        baseForPercent={null}
        valueShowIn={valueShowIn}
        isTotal
      />
    </td>
  );

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors font-sans">
      {/* Particulars Cell: Indented 24px and sticky on the left */}
      <td className="py-1.5 px-3 text-xs font-medium text-slate-700 sticky left-0 z-10 bg-white shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] pl-8 whitespace-nowrap">
        <span>{row.label}</span>
      </td>

      {/* If Period mode, Total is first */}
      {isPeriodMode && totalCell}

      {/* Data Column Values */}
      {row.values.map((val, idx) => (
        <td key={idx} className="py-1 px-1 text-right border-r border-slate-100 font-sans">
          <ValueCell
            value={val}
            currency={currency}
            showInPercent={showInPercent}
            baseForPercent={totalVal}
            valueShowIn={valueShowIn}
          />
        </td>
      ))}

      {/* If Entity mode, Total is last */}
      {!isPeriodMode && totalCell}
    </tr>
  );
};

