import React from 'react';
import { ISRow } from '../../types/incomeStatement';
import { LetterCodeChip } from './LetterCodeChip';

interface SectionHeaderRowProps {
  row: ISRow;
  colCount: number;
  isPeriodMode: boolean;
}

export const SectionHeaderRow: React.FC<SectionHeaderRowProps> = ({
  row,
  colCount,
  isPeriodMode,
}) => {
  return (
    <tr className="border-b border-slate-200 bg-slate-100/70 hover:bg-slate-100 transition-colors font-sans">
      {/* Particulars Cell: Sticky on the left */}
      <td className="py-2 px-3 font-bold text-xs text-slate-800 uppercase tracking-wide sticky left-0 z-10 bg-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] whitespace-nowrap">
        <div className="flex items-center">
          {row.letterCode && <LetterCodeChip code={row.letterCode} />}
          <span>{row.label}</span>
        </div>
      </td>

      {/* If Period mode, Total is first */}
      {isPeriodMode && (
        <td className="py-2 px-3 text-right text-slate-300 font-sans text-xs border-r border-slate-200 select-none">
          —
        </td>
      )}

      {/* Data columns */}
      {Array.from({ length: colCount }).map((_, idx) => (
        <td
          key={idx}
          className="py-2 px-2 text-right text-slate-300 font-sans text-xs border-r border-slate-200 select-none"
        >
          —
        </td>
      ))}

      {/* If Entity mode, Total is last */}
      {!isPeriodMode && (
        <td className="py-2 px-3 text-right text-slate-300 font-sans text-xs border-l border-slate-200 select-none">
          —
        </td>
      )}
    </tr>
  );
};

