import React from 'react';

interface TableHeaderRowProps {
  years: string[];
  subLedger: boolean;
}

export const TableHeaderRow: React.FC<TableHeaderRowProps> = ({ years, subLedger }) => {
  return (
    <thead className="bg-slate-100/90 text-slate-700 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-2xs backdrop-blur-xs">
      {/* ROW 1: Column Names */}
      <tr className="border-b border-slate-200">
        <th className="py-2.5 px-3 text-left font-bold text-slate-800 w-[300px] min-w-[260px]">
          Particulars
        </th>
        <th className="py-2.5 px-2 text-left font-medium text-slate-500 w-[70px] hidden md:table-cell">
          (Level-2)
        </th>
        <th className="py-2.5 px-2 text-left font-medium text-slate-500 w-[70px] hidden lg:table-cell">
          (Level-3)
        </th>
        <th className="py-2.5 px-2 text-left font-medium text-slate-500 w-[70px] hidden xl:table-cell">
          (Level-4)
        </th>

        {subLedger && (
          <th className="py-2.5 px-3 text-left font-bold text-slate-700 min-w-[190px] border-l border-slate-200/80">
            Sub-Ledger
          </th>
        )}

        {years.map((yr, idx) => (
          <th
            key={yr}
            className={`py-2 px-3 text-right font-bold text-slate-800 min-w-[130px] border-l border-slate-200/80 ${
              idx === 0 ? 'bg-indigo-50/50 text-indigo-950 font-extrabold' : ''
            }`}
          >
            <div className="font-mono text-xs">{yr}</div>
            <div className="text-[10px] lowercase font-normal italic text-slate-400 font-sans tracking-normal mt-0.5">
              (As on)
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

