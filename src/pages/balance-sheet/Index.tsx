import React, { useEffect, useMemo } from 'react';
import {
  useBalanceSheetStore,
  useBsAdvanceFilterStore,
  getComputedTreeWithFilter,
} from '../../stores/balanceSheetStore';
import { TopControlBar } from '../../components/balance-sheet/TopControlBar';
import { BalanceSheetTable } from '../../components/balance-sheet/BalanceSheetTable';
import { TreeSkeleton } from '../../components/balance-sheet/TreeSkeleton';
import { EmptyState } from '../../components/balance-sheet/EmptyState';
import { Scale, RefreshCw, FileSpreadsheet } from 'lucide-react';

export const BalanceSheetPage: React.FC = () => {
  const {
    rows,
    years,
    loading,
    filters,
    collapsedNodes,
    load,
    toggleSubLedger,
    toggleExpandAll,
    setExpandAll,
    toggleNodeCollapse,
    resetFilters,
  } = useBalanceSheetStore();

  const getPredicate = useBsAdvanceFilterStore((s) => s.getPredicate);
  const filterConditions = useBsAdvanceFilterStore((s) => s.state.conditions);
  const combinator = useBsAdvanceFilterStore((s) => s.state.combinator);

  useEffect(() => {
    load();
  }, [load]);

  // Compile AdvanceFilter predicate and recalculate dynamic rollups if filters active
  const filteredRows = useMemo(() => {
    if (filterConditions.length === 0) {
      return rows;
    }
    const predicate = getPredicate();
    return getComputedTreeWithFilter(rows, years.length, predicate);
  }, [rows, years.length, filterConditions, combinator, getPredicate]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-4">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Scale className="size-3.5" />
            <span>Reports</span>
            <span className="text-slate-400">/</span>
            <span>Financial Statement</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700">Balance Sheet</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Balance Sheet Report</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              Comparative Tree
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-year comparative financial position with sub-ledger attribution, dynamic
            rollup sums, and real-time balance validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 hover:text-indigo-600 transition-all cursor-pointer disabled:opacity-50"
            title="Reload Balance Sheet data"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Controls Bar (Row 2-3) */}
      <TopControlBar />

      {/* Content: Skeleton / Empty State / Main Tree Table */}
      {loading ? (
        <TreeSkeleton />
      ) : filteredRows.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <BalanceSheetTable
          rows={filteredRows}
          years={years}
          filters={filters}
          collapsedNodes={collapsedNodes}
          onToggleSubLedger={toggleSubLedger}
          onExpandAll={() => setExpandAll(true)}
          onCollapseAll={() => setExpandAll(false)}
          onToggleNodeCollapse={toggleNodeCollapse}
        />
      )}
    </div>
  );
};

export default BalanceSheetPage;

