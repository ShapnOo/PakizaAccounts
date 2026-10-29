import React, { useEffect } from 'react';
import { useTrialBalanceStore } from '../../stores/trialBalanceStore';
import { TopControlBar } from '../../components/trial-balance/TopControlBar';
import { TrialBalanceTable } from '../../components/trial-balance/TrialBalanceTable';
import { TableSkeleton } from '../../components/trial-balance/TableSkeleton';
import { EmptyState } from '../../components/trial-balance/EmptyState';
import { Home, ChevronRight, Table2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrialBalancePage: React.FC = () => {
  const { report, loading, load, reset } = useTrialBalanceStore();

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-[1700px] mx-auto space-y-4">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
              <Link
                to="/"
                className="hover:text-slate-800 flex items-center gap-1 transition"
              >
                <Home className="size-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="size-3 text-slate-400" />
              <span>Ledger Reports</span>
              <ChevronRight className="size-3 text-slate-400" />
              <span className="text-slate-800 font-semibold">
                Trial Balance
              </span>
            </nav>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
                <Table2 className="size-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Trial Balance Report
                </h1>
                <p className="text-xs text-slate-500">
                  Comprehensive multi-level ledger trial balance with Dr/Cr opening, period movement, and closing balances
                </p>
              </div>
            </div>
          </div>

          {/* Quick status pill */}
          {report && (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-2 text-xs">
                <span className="text-slate-500">Trial Balance:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Balanced (All Dimensions)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Top Control Bar with 8 Controls */}
        <TopControlBar />

        {/* Content Area */}
        {loading && !report ? (
          <TableSkeleton />
        ) : !report || report.rows.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <TrialBalanceTable report={report} />
        )}
      </div>
    </div>
  );
};

