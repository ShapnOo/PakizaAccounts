import React, { useMemo } from 'react';
import {
  TBReport,
  TBLedgerRow,
  COLUMN_LABELS,
  TBVisibleColumns,
} from '../../types/trialBalance';
import { TrialBalanceRow } from './TrialBalanceRow';
import { ValueCell } from './ValueCell';
import { BalanceCheckBadges } from './BalanceCheckBadges';
import { useTrialBalanceStore } from '../../stores/trialBalanceStore';
import { Table2, CheckCircle2 } from 'lucide-react';

interface TrialBalanceTableProps {
  report: TBReport;
}

export const TrialBalanceTable: React.FC<TrialBalanceTableProps> = ({
  report,
}) => {
  const { filters, expandedNodeIds, toggleNode } = useTrialBalanceStore();

  // Active numeric column keys
  const colKeys = (
    Object.keys(filters.visibleColumns) as (keyof TBVisibleColumns)[]
  ).filter((k) => filters.visibleColumns[k]);

  // Compute visibility of rows based on tree hierarchy expansion
  const visibleRows = useMemo(() => {
    const pathToId = new Map<string, string>();
    report.rows.forEach((r) => pathToId.set(r.accountPath.join('|'), r.id));

    return report.rows.filter((row) => {
      // Level 1 is always visible
      if (row.level === 1) return true;

      // Check all ancestors in the accountPath
      for (let i = 1; i < row.accountPath.length; i++) {
        const ancestorPath = row.accountPath.slice(0, i).join('|');
        const ancestorId = pathToId.get(ancestorPath);
        if (ancestorId && !expandedNodeIds.includes(ancestorId)) {
          return false;
        }
      }
      return true;
    });
  }, [report.rows, expandedNodeIds]);

  // Compute column widths for colgroup
  const showSubLedger = filters.subLedger;
  const particularsPercent = showSubLedger ? 28 : 38;
  const subLedgerPercent = showSubLedger ? 14 : 0;
  const remainingPercent = 100 - particularsPercent - subLedgerPercent;
  const numericColPercent = colKeys.length > 0 ? remainingPercent / colKeys.length : 10;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col font-sans transition-all">
      {/* Table Subtitle Bar */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
            <Table2 className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Trial Balance Statement
            </h3>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Multi-level tree showing Debit/Credit opening, movement, and closing balances
            </span>
          </div>
        </div>

        {/* Balance Status Badges */}
        <BalanceCheckBadges
          isBalanced={report.isBalanced}
          differences={report.differences}
          currency={filters.currency}
        />
      </div>

      {/* Table Container: uses .table-scroll for smooth vertical page scroll */}
      <div className="table-scroll w-full overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans table-fixed min-w-[850px]">
          {/* Explicit colgroup guarantees all columns fit and stay visible on screen */}
          <colgroup>
            <col style={{ width: `${particularsPercent}%` }} />
            {showSubLedger && <col style={{ width: `${subLedgerPercent}%` }} />}
            {colKeys.map((k) => (
              <col key={k} style={{ width: `${numericColPercent}%` }} />
            ))}
          </colgroup>

          {/* Header Row */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider font-sans sticky top-0 z-10 shadow-2xs">
              <th className="py-2.5 px-3 border-r border-slate-200 truncate">
                Particulars
              </th>

              {showSubLedger && (
                <th className="py-2.5 px-3 border-r border-slate-200 truncate">
                  Sub-Ledger
                </th>
              )}

              {colKeys.map((k, idx) => {
                const isLast = idx === colKeys.length - 1;
                return (
                  <th
                    key={k}
                    className={`py-2.5 px-2 text-right truncate ${
                      !isLast ? 'border-r border-slate-200' : ''
                    }`}
                  >
                    {COLUMN_LABELS[k]}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {visibleRows.map((row) => (
              <TrialBalanceRow
                key={row.id}
                row={row}
                colKeys={colKeys}
                showSubLedger={showSubLedger}
                valueShowIn={filters.valueShowIn}
                currency={filters.currency}
                isExpanded={expandedNodeIds.includes(row.id)}
                onToggle={() => toggleNode(row.id)}
              />
            ))}
          </tbody>

          {/* Table Footer: Nature-Grouped Total Row */}
          <tfoot>
            <tr className="border-t-2 border-indigo-300 bg-indigo-50 font-bold text-xs text-slate-900 font-sans">
              <td
                colSpan={showSubLedger ? 2 : 1}
                className="py-3 px-3 border-r border-slate-200 uppercase tracking-wider font-bold truncate"
              >
                <div className="flex items-center justify-between">
                  <span>TOTAL</span>
                  <span className="text-[10px] font-normal text-slate-500 lowercase hidden sm:inline">
                    (dr = Assets+Expense; cr = Liab+Equity+Income)
                  </span>
                </div>
              </td>

              {colKeys.map((k, idx) => {
                const isLast = idx === colKeys.length - 1;
                return (
                  <td
                    key={k}
                    className={`py-3 px-1 text-right truncate ${
                      !isLast ? 'border-r border-slate-200' : ''
                    }`}
                  >
                    <ValueCell
                      value={report.totals[k]}
                      valueShowIn={filters.valueShowIn}
                      currency={filters.currency}
                      isTotal
                    />
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer / Summary Strip */}
      <div className="px-4 py-2 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-sans">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Accounting Equation:</span>
          <span>Dr Total (৳ {new Intl.NumberFormat('en-US').format(report.totals.closingDr)})</span>
          <span>=</span>
          <span>Cr Total (৳ {new Intl.NumberFormat('en-US').format(report.totals.closingCr)})</span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px]">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Trial Balance Balanced
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Showing {visibleRows.length} of {report.rows.length} tree items</span>
          <span>•</span>
          <span>{expandedNodeIds.length} groups expanded</span>
        </div>
      </div>
    </div>
  );
};
