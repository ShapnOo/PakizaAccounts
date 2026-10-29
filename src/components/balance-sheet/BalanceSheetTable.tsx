import React, { useMemo } from 'react';
import { BSTreeRow, BSFilterState } from '../../types/balanceSheet';
import { TableHeaderRow } from './TableHeaderRow';
import { TableRow } from './TableRow';
import { TreeControls } from './TreeControls';
import { checkBalance } from '../../lib/validation/balanceSheet';
import { Scale } from 'lucide-react';

interface BalanceSheetTableProps {
  rows: BSTreeRow[];
  years: string[];
  filters: BSFilterState;
  collapsedNodes: Record<string, boolean>;
  onToggleSubLedger: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onToggleNodeCollapse: (id: string) => void;
}

export const BalanceSheetTable: React.FC<BalanceSheetTableProps> = ({
  rows,
  years,
  filters,
  collapsedNodes,
  onToggleSubLedger,
  onExpandAll,
  onCollapseAll,
  onToggleNodeCollapse,
}) => {
  // 1. Identify collapsed ancestor branches
  // If an ancestor node is collapsed, hide the descendant row
  const visibleRows = useMemo(() => {
    // Map of parent ids to whether any ancestor is collapsed
    const isHidden = (row: BSTreeRow): boolean => {
      let currentParentId = row.parentId;
      while (currentParentId) {
        if (collapsedNodes[currentParentId]) {
          return true;
        }
        const parentRow = rows.find((r) => r.id === currentParentId);
        currentParentId = parentRow ? parentRow.parentId : null;
      }
      return false;
    };

    return rows.filter((r) => !isHidden(r));
  }, [rows, collapsedNodes]);

  // 2. Extract base amounts for percentage calculation
  // Assets side base = Total Assets for that year
  // Liab + Equity side base = Total Liab & Equity for that year
  const { totalAssetsVal, totalLiabEquityVal, isBalanced, maxDiff } = useMemo(() => {
    const totalAssetRow = rows.find((r) => r.id === 'a-total');
    const grandTotalRow = rows.find((r) => r.id === 'le-grand');

    const totalAssets = totalAssetRow?.values || [];
    const totalLiabEquity = grandTotalRow?.values || [];

    const balanceResult = checkBalance(totalAssets, totalLiabEquity);

    return {
      totalAssetsVal: totalAssets[0] || 0,
      totalLiabEquityVal: totalLiabEquity[0] || 0,
      isBalanced: balanceResult.isBalanced,
      maxDiff: balanceResult.maxDiff,
    };
  }, [rows]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Row 6: Tree Controls & Module Subtitle */}
      <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Statement of Financial Position (Balance Sheet)
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            • Multi-Year Comparative Tree
          </span>
        </div>

        {/* Tree controls right side */}
        <TreeControls
          subLedger={filters.subLedger}
          onToggleSubLedger={onToggleSubLedger}
          onExpandAll={onExpandAll}
          onCollapseAll={onCollapseAll}
        />
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto w-full sidebar-scroll">
        <table className="w-full border-collapse text-left min-w-[700px]">
          <TableHeaderRow years={years} subLedger={filters.subLedger} />

          <tbody className="divide-y divide-slate-100">
            {visibleRows.map((row) => {
              const baseForPercent =
                row.side === 'assets' ? totalAssetsVal : totalLiabEquityVal;

              return (
                <TableRow
                  key={row.id}
                  row={row}
                  years={years}
                  subLedger={filters.subLedger}
                  currency={filters.currency}
                  showInPercent={filters.showInPercent}
                  baseForPercent={baseForPercent}
                  valueShowIn={filters.valueShowIn}
                  isCollapsed={!!collapsedNodes[row.id]}
                  onToggleCollapse={() => onToggleNodeCollapse(row.id)}
                  isBalanced={isBalanced}
                  balanceDifference={maxDiff}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Accounting Equation:</span>
          <span>Assets = Liabilities + Owner's Equity</span>
          {isBalanced ? (
            <span className="text-emerald-700 font-bold ml-1">✓ In Balance</span>
          ) : (
            <span className="text-rose-600 font-bold ml-1">
              ⚠ Out of Balance by {filters.currency} {maxDiff.toLocaleString()}
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-400">
          Showing {visibleRows.length} accounts & groups • As on date:{' '}
          <span className="font-mono font-medium text-slate-600">{filters.asOn}</span>
        </div>
      </div>
    </div>
  );
};

