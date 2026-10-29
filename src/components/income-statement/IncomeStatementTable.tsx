import React from 'react';
import {
  ISRow,
  ISColumnGroup,
  ISFilterState,
} from '../../types/incomeStatement';
import { TableHeaderRows } from './TableHeaderRows';
import { SectionHeaderRow } from './SectionHeaderRow';
import { LineItemRow } from './LineItemRow';
import { FormulaRow } from './FormulaRow';
import { TrendingUp } from 'lucide-react';

interface IncomeStatementTableProps {
  rows: ISRow[];
  columnGroups: ISColumnGroup[];
  dataColumns: { key: string; label: string; subLabel?: string }[];
  filters: ISFilterState;
  fyExpanded: boolean;
}

export const IncomeStatementTable: React.FC<IncomeStatementTableProps> = ({
  rows,
  columnGroups,
  dataColumns,
  filters,
  fyExpanded,
}) => {
  const isPeriodMode = filters.compareTo === 'Previous Period';

  // Locate bottom-line profit row
  const bottomLine =
    filters.reportType === 'Comprehensive'
      ? rows.find((r) => r.key === 'netProfitAfterTax')
      : rows.find((r) => r.key === 'netProfitBeforeTax');

  const bottomLineTotal = bottomLine
    ? bottomLine.values.reduce((acc, curr) => acc + curr, 0)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col font-sans">
      {/* Table Subtitle Bar */}
      <div className="px-4 py-2.5 border-b border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Statement of Profit or Loss ({filters.reportType} View)
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            • Comparison by {filters.compareTo}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Bottom Line:</span>
          <span
            className={`font-bold ${
              bottomLineTotal >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {filters.currency} {new Intl.NumberFormat('en-IN').format(bottomLineTotal)}
          </span>
        </div>
      </div>

      {/* Main Table Container (Responsive Horizontal Scroll) */}
      <div className="overflow-x-auto w-full sidebar-scroll">
        <table className="w-full border-collapse text-left min-w-[720px] font-sans">
          <TableHeaderRows
            compareTo={filters.compareTo}
            columnGroups={columnGroups}
            dataColumns={dataColumns}
            fyExpanded={fyExpanded}
          />

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              if (row.isSectionHeader) {
                return (
                  <SectionHeaderRow
                    key={row.id}
                    row={row}
                    colCount={dataColumns.length}
                    isPeriodMode={isPeriodMode}
                  />
                );
              }

              if (row.isFormula) {
                return (
                  <FormulaRow
                    key={row.id}
                    row={row}
                    currency={filters.currency}
                    showInPercent={filters.showInPercent}
                    valueShowIn={filters.valueShowIn}
                    isPeriodMode={isPeriodMode}
                  />
                );
              }

              return (
                <LineItemRow
                  key={row.id}
                  row={row}
                  currency={filters.currency}
                  showInPercent={filters.showInPercent}
                  valueShowIn={filters.valueShowIn}
                  isPeriodMode={isPeriodMode}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Financial Calculation:</span>
          <span className="italic">
            {filters.reportType === 'Comprehensive'
              ? 'Gross Profit (C = A-B) → NPBT (F = C+D-E) → NPAT (NPBT - Tax)'
              : 'Income − Expenses = Net Profit Before Tax'}
          </span>
        </div>

        <div className="text-[11px] text-slate-400">
          Showing {rows.length} lines • Currency: <strong className="text-slate-700">{filters.currency}</strong>
        </div>
      </div>
    </div>
  );
};

