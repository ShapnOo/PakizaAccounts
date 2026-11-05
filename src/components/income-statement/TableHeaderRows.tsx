import React from 'react';
import { ISColumnGroup, CompareMode } from '../../types/incomeStatement';

interface TableHeaderRowsProps {
  compareTo: CompareMode;
  columnGroups: ISColumnGroup[];
  dataColumns: { key: string; label: string; subLabel?: string }[];
  fyExpanded: boolean;
  showInPercent?: boolean;
}

export const TableHeaderRows: React.FC<TableHeaderRowsProps> = ({
  compareTo,
  columnGroups,
  dataColumns,
  fyExpanded,
  showInPercent = false,
}) => {
  const isPeriodMode = compareTo === 'Previous Period';

  if (!isPeriodMode) {
    // Single Header Row for Company / Cost Center / Budget / Date Range Mode
    return (
      <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider sticky top-0 z-20 shadow-2xs backdrop-blur-xs font-sans">
        <tr className="border-b border-slate-200">
          <th className="py-2.5 px-3 text-left font-bold text-slate-800 w-[280px] min-w-[240px] sticky left-0 z-30 bg-slate-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] whitespace-nowrap">
            Particulars
          </th>

          {dataColumns.map((col) => (
            <React.Fragment key={col.key}>
              <th className="py-2.5 px-3 text-right font-bold text-slate-800 min-w-[135px] whitespace-nowrap border-l border-slate-200 font-sans">
                <div>{col.label}</div>
                {col.subLabel && (
                  <div className="text-[10px] text-indigo-700 font-medium normal-case tracking-normal truncate max-w-[200px] ml-auto">
                    {col.subLabel}
                  </div>
                )}
              </th>
              {showInPercent && (
                <th className="py-2.5 px-2.5 text-right font-bold text-indigo-700 bg-indigo-50/60 w-[75px] min-w-[70px] whitespace-nowrap border-l border-indigo-100 font-sans">
                  %
                </th>
              )}
            </React.Fragment>
          ))}

          {/* Total Column is LAST in entity mode */}
          <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-slate-200/50 min-w-[125px] whitespace-nowrap border-l border-slate-200 font-sans">
            Total
          </th>
          {showInPercent && (
            <th className="py-2.5 px-2.5 text-right font-bold text-indigo-900 bg-indigo-100/70 w-[75px] min-w-[70px] whitespace-nowrap border-l border-indigo-200 font-sans">
              %
            </th>
          )}
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
          {showInPercent && (
            <th
              rowSpan={2}
              className="py-2.5 px-2.5 text-right font-bold text-indigo-900 bg-indigo-100/70 w-[75px] min-w-[70px] whitespace-nowrap border-r border-slate-200 font-sans align-middle"
            >
              %
            </th>
          )}

          {columnGroups.map((group) => (
            <th
              key={group.label}
              colSpan={showInPercent ? 2 : 1}
              className="py-1.5 px-3 text-center font-bold text-slate-800 bg-slate-200/40 border-r border-slate-200 text-xs tracking-tight whitespace-nowrap font-sans min-w-[130px]"
            >
              FY {group.label}
            </th>
          ))}
        </tr>

        <tr className="border-b border-slate-200 bg-slate-50">
          {columnGroups.map((group) => (
            <React.Fragment key={group.label}>
              <th className="py-1 px-3 text-right font-semibold text-slate-500 border-r border-slate-200 text-[11px] whitespace-nowrap font-sans">
                Full Year
              </th>
              {showInPercent && (
                <th className="py-1 px-2.5 text-right font-semibold text-indigo-700 bg-indigo-50/50 border-r border-slate-200 text-[11px] whitespace-nowrap font-sans">
                  %
                </th>
              )}
            </React.Fragment>
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
        {showInPercent && (
          <th
            rowSpan={2}
            className="py-2.5 px-2.5 text-right font-bold text-indigo-900 bg-indigo-100/70 w-[75px] min-w-[70px] whitespace-nowrap border-r border-slate-200 font-sans align-middle"
          >
            %
          </th>
        )}

        {columnGroups.map((group) => {
          const subCount = group.subColumns?.length || 1;
          return (
            <th
              key={group.label}
              colSpan={showInPercent ? subCount * 2 : subCount}
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
            <React.Fragment key={sub.key}>
              <th className="py-1 px-2 text-right font-semibold text-slate-700 min-w-[105px] border-r border-slate-200 whitespace-nowrap font-sans">
                <div className="text-[11px] font-sans font-semibold">{sub.label}</div>
                {sub.subLabel && (
                  <div className="text-[9.5px] lowercase font-normal italic text-slate-400 font-sans tracking-normal">
                    {sub.subLabel}
                  </div>
                )}
              </th>
              {showInPercent && (
                <th className="py-1 px-2 text-right font-semibold text-indigo-700 bg-indigo-50/50 w-[70px] min-w-[65px] border-r border-slate-200 whitespace-nowrap font-sans text-[11px]">
                  %
                </th>
              )}
            </React.Fragment>
          ))
        )}
      </tr>
    </thead>
  );
};
