import React from 'react';

interface TableHeaderRowProps {
  years: string[];
  subLedger: boolean;
}

export const TableHeaderRow: React.FC<TableHeaderRowProps> = ({ years, subLedger }) => {
  return (
    <thead className="bg-slate-100/95 text-slate-700 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-2xs backdrop-blur-xs font-sans">
      <tr className="border-b border-slate-200">
        {/* Sticky Particulars Column for Mobile & Horizontal Scroll */}
        <th className="py-2.5 px-3 text-left font-bold text-slate-800 w-[280px] min-w-[240px] sticky left-0 z-30 bg-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap">
          Particulars
        </th>

        {/* Compact, fixed-width Level Columns: L-2, L-3, L-4 */}
        <th className="py-2 px-1 text-center font-bold text-slate-600 w-12 min-w-[48px] whitespace-nowrap text-[11px] border-l border-slate-200/60">
          L-2
        </th>
        <th className="py-2 px-1 text-center font-bold text-slate-600 w-12 min-w-[48px] whitespace-nowrap text-[11px] border-l border-slate-200/60">
          L-3
        </th>
        <th className="py-2 px-1 text-center font-bold text-slate-600 w-12 min-w-[48px] whitespace-nowrap text-[11px] border-l border-slate-200/60">
          L-4
        </th>

        {/* Sub-Ledger Column */}
        {subLedger && (
          <th className="py-2.5 px-3 text-left font-bold text-slate-700 min-w-[170px] whitespace-nowrap border-l border-slate-200">
            Sub-Ledger
          </th>
        )}

        {/* Dynamic Year Columns */}
        {years.map((yr, idx) => (
          <th
            key={yr}
            className={`py-2 px-3 text-right font-bold text-slate-800 min-w-[125px] whitespace-nowrap border-l border-slate-200 font-sans ${
              idx === 0 ? 'bg-indigo-50/60 text-indigo-950 font-extrabold' : ''
            }`}
          >
            <div className="font-sans text-xs tracking-tight">{yr}</div>
            <div className="text-[10px] lowercase font-normal italic text-slate-400 font-sans tracking-normal mt-0.5">
              (As on)
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};
