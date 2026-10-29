import React from 'react';
import { useRetainedEarningsStore } from '../../stores/retainedEarningsStore';
import { DateRangeSelect } from './DateRangeSelect';
import { ExportMenu } from './ExportMenu';
import { RotateCcw, CheckCircle2, Sliders } from 'lucide-react';

export const TopControlBar: React.FC = () => {
  const {
    dateRange,
    customFrom,
    customTo,
    loading,
    report,
    setDateRange,
    setCustomDateRange,
    reset,
    export: exportReport,
  } = useRetainedEarningsStore();

  const isReconciled =
    report &&
    report.totals.closingRetainedEarnings ===
      report.equity.find((e) => e.source === 'linked')?.amount;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-4 p-4 font-sans transition-all">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Date Range Controls */}
        <div className="flex items-center gap-3">
          <DateRangeSelect
            value={dateRange}
            customFrom={customFrom}
            customTo={customTo}
            onChange={setDateRange}
            onCustomChange={setCustomDateRange}
            disabled={loading}
          />
        </div>

        {/* Right: Actions (Status, Reset, Export) */}
        <div className="flex items-center gap-2.5">
          {isReconciled && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Reconciled ✓</span>
            </div>
          )}

          <button
            type="button"
            onClick={reset}
            disabled={loading}
            title="Reset to default period"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="size-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <ExportMenu onExport={exportReport} disabled={loading || !report} />
        </div>
      </div>
    </div>
  );
};

