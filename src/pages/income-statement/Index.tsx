import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIncomeStatementStore } from '../../stores/incomeStatementStore';
import { TopControlBar } from '../../components/income-statement/TopControlBar';
import { IncomeStatementTable } from '../../components/income-statement/IncomeStatementTable';
import { TableSkeleton } from '../../components/income-statement/TableSkeleton';
import { EmptyState } from '../../components/income-statement/EmptyState';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { ReportType, CompareMode } from '../../types/incomeStatement';

export const IncomeStatementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    rows,
    columnGroups,
    dataColumns,
    loading,
    filters,
    fyExpanded,
    load,
    setReportType,
    setCompareTo,
    resetFilters,
  } = useIncomeStatementStore();

  useEffect(() => {
    // Check URL search parameters
    const typeParam = searchParams.get('type') as ReportType;
    if (typeParam && (typeParam === 'Comprehensive' || typeParam === 'Summary')) {
      setReportType(typeParam);
    }

    const compareParam = searchParams.get('compare') as CompareMode;
    if (
      compareParam &&
      ['Previous Period', 'Company', 'Cost Center', 'Budget'].includes(compareParam)
    ) {
      setCompareTo(compareParam);
    }

    load();
  }, [searchParams, load, setReportType, setCompareTo]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-4 font-sans">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <TrendingUp className="size-3.5" />
            <span>Reports</span>
            <span className="text-slate-400">/</span>
            <span>Financial Statement</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700">Income Statement</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Income Statement Report</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              {filters.reportType} P&L
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statement of Profit or Loss with multi-period fiscal year analysis, company & cost center
            breakdowns, and letter-coded accounting rollups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50 hover:text-indigo-600 transition-all cursor-pointer disabled:opacity-50"
            title="Reload Income Statement data"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Controls Bar */}
      <TopControlBar />

      {/* Content Section */}
      {loading ? (
        <TableSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <IncomeStatementTable
          rows={rows}
          columnGroups={columnGroups}
          dataColumns={dataColumns}
          filters={filters}
          fyExpanded={fyExpanded}
        />
      )}
    </div>
  );
};

export default IncomeStatementPage;

