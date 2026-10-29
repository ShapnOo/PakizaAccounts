import React from 'react';
import { ISRow, ValueShowIn } from '../../types/incomeStatement';
import { LetterCodeChip } from './LetterCodeChip';
import { ValueCell } from './ValueCell';

interface FormulaRowProps {
  row: ISRow;
  currency: string;
  showInPercent: boolean;
  valueShowIn: ValueShowIn;
  isPeriodMode: boolean;
}

export const FormulaRow: React.FC<FormulaRowProps> = ({
  row,
  currency,
  showInPercent,
  valueShowIn,
  isPeriodMode,
}) => {
  const totalVal = row.values.reduce((acc, curr) => acc + curr, 0);

  const totalCell = (
    <td className="py-2 px-1 text-right bg-indigo-100/60 border-r border-indigo-200">
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
    <tr className="border-t border-b border-indigo-200/80 bg-indigo-50/50 hover:bg-indigo-100/40 transition-colors font-sans font-bold">
      {/* Particulars Cell: Sticky on the left */}
      <td className="py-2 px-3 text-xs font-bold text-indigo-950 sticky left-0 z-10 bg-indigo-50 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] whitespace-nowrap">
        <div className="flex items-center">
          {row.letterCode && <LetterCodeChip code={row.letterCode} />}
          <span>{row.label}</span>
          {row.formula && (
            <span className="ml-1 text-[10px] text-indigo-600 font-normal">
              ({row.formula})
            </span>
          )}
        </div>
      </td>

      {/* If Period mode, Total is first */}
      {isPeriodMode && totalCell}

      {/* Data Column Values */}
      {row.values.map((val, idx) => (
        <td key={idx} className="py-2 px-1 text-right border-r border-indigo-100/70 font-sans">
          <ValueCell
            value={val}
            currency={currency}
            showInPercent={showInPercent}
            baseForPercent={totalVal}
            valueShowIn={valueShowIn}
            isTotal
          />
        </td>
      ))}

      {/* If Entity mode, Total is last */}
      {!isPeriodMode && totalCell}
    </tr>
  );
};

