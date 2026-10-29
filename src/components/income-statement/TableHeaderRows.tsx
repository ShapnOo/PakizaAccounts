import React from 'react';
import { ISColumnGroup, CompareMode } from '../../types/incomeStatement';

interface TableHeaderRowsProps {
  compareTo: CompareMode;
  columnGroups: ISColumnGroup[];
  dataColumns: { key: string; label: string; subLabel?: string }[];
  fyExpanded: boolean;
}

export const TableHeaderRows: React.FC<TableHeaderRowsProps> = ({
  compareTo,
  columnGroups,
  dataColumns,
  fyExpanded,
}) => {
  const isPeriodMode = compareTo === 'Previous Period';

  if (!isPeriodMode) {
    // Single Header Row for Company / Cost Center / Budget Mode
    return (
      <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-2xs backdrop-blur-xs font-sans">
        <tr className="border-b border-slate-200">
          <th className="py-2.5 px-3 text-left font-bold text-slate-800 w-[280px] min-w-[240px] sticky left-0 z-30 bg-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap">
            Particulars
          </th>

          {dataColumns.map((col) => (
            <th
              key={col.key}
              className="py-2.5 px-3 text-right font-bold text-slate-800 min-w-[130px] whitespace-nowrap border-l border-slate-200 font-sans"
            >
              {col.label}
            </th>
          ))}

          {/* Total Column is LAST in entity mode */}
          <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-slate-200/50 min-w-[125px] whitespace-nowrap border-l border-slate-200 font-sans">
            Total
          </th>
        </tr>
      </thead>
    );
  }

  // When FY is Collapsed (Full Year view): Clean 2-level or single aligned header
  if (!fyExpanded) {
    return (
      <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-2xs backdrop-blur-xs font-sans">
        <tr className="border-b border-slate-200">
          <th
            rowSpan={2}
            className="py-2.5 px-3 text-left font-bold text-slate-800 w-[280px] min-w-[240px] sticky left-0 z-30 bg-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap align-middle"
          >
            Particulars
          </th>

          <th
            rowSpan={2}
            className="py-2.5 px-3 text-right font-bold text-slate-900 bg-slate-200/50 min-w-[120px] whitespace-nowrap border-l border-r border-slate-200 font-sans align-middle"
          >
            Total
          </th>

          {columnGroups.map((group) => (
            <th
              key={group.label}
              className="py-1.5 px-3 text-center font-bold text-slate-800 bg-slate-200/40 border-r border-slate-200 text-xs tracking-tight whitespace-nowrap font-sans min-w-[130px]"
            >
              FY {group.label}
            </th>
          ))}
        </tr>

        <tr className="border-b border-slate-200 bg-slate-50">
          {columnGroups.map((group) => (
            <th
              key={group.label}
              className="py-1 px-3 text-right font-semibold text-slate-500 border-r border-slate-200 text-[11px] whitespace-nowrap font-sans"
            >
              Full Year
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  // Two-Level Stacked Header for Previous Period Mode when EXPANDED
  return (
    <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-2xs backdrop-blur-xs font-sans">
      {/* ROW 1: Fiscal Year Group Header */}
      <tr className="border-b border-slate-200">
        <th
          rowSpan={2}
          className="py-2.5 px-3 text-left font-bold text-slate-800 w-[280px] min-w-[240px] sticky left-0 z-30 bg-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap align-middle"
        >
          Particulars
        </th>

        {/* Total is the FIRST data column in Period mode */}
        <th
          rowSpan={2}
          className="py-2.5 px-3 text-right font-bold text-slate-900 bg-slate-200/50 min-w-[120px] whitespace-nowrap border-l border-r border-slate-200 font-sans align-middle"
        >
          Total
        </th>

        {columnGroups.map((group) => {
          const subCount = group.subColumns?.length || 1;
          return (
            <th
              key={group.label}
              colSpan={subCount}
              className="py-1.5 px-2 text-center font-bold text-slate-800 bg-slate-200/40 border-r border-slate-200 text-xs tracking-tight whitespace-nowrap font-sans"
            >
              FY {group.label}
            </th>
          );
        })}
      </tr>

      {/* ROW 2: Sub-Period Headers (Quarter / Month) */}
      <tr className="border-b border-slate-200 bg-slate-50">
        {columnGroups.map((group) =>
          (group.subColumns ?? []).map((sub) => (
            <th
              key={sub.key}
              className="py-1 px-2 text-right font-semibold text-slate-700 min-w-[105px] border-r border-slate-200 whitespace-nowrap font-sans"
            >
              <div className="text-[11px] font-sans font-semibold">{sub.label}</div>
              {sub.subLabel && (
                <div className="text-[9.5px] lowercase font-normal italic text-slate-400 font-sans tracking-normal">
                  {sub.subLabel}
                </div>
              )}
            </th>
          ))
        )}
      </tr>
    </thead>
  );
};
