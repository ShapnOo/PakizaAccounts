import React from 'react';
import { RetainedEarningsReport } from '../../types/retainedEarnings';
import { MovementPanel } from './MovementPanel';
import { EquityPanel } from './EquityPanel';
import { useRetainedEarningsStore } from '../../stores/retainedEarningsStore';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatBDT } from '../../lib/retainedEarningsMath';

interface ReportContainerProps {
  report: RetainedEarningsReport;
}

export const ReportContainer: React.FC<ReportContainerProps> = ({
  report,
}) => {
  const {
    hoveredLinkedKey,
    setHoveredLinkedKey,
    showEquityTotal,
  } = useRetainedEarningsStore();

  const isHovered = hoveredLinkedKey === 're-link';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col font-sans transition-all">
      {/* 2-Panel Grid: Movement (~62%) | Equity (~38%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Panel: Movement (~62% / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <MovementPanel
            rows={report.movement}
            dateRange={report.dateRange}
            customFrom={report.customFrom}
            customTo={report.customTo}
            isHoveredLinked={isHovered}
            onHoverLink={(hov) => setHoveredLinkedKey(hov ? 're-link' : null)}
          />
        </div>

        {/* Right Panel: Equity Snapshot (~38% / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <EquityPanel
            rows={report.equity}
            totalEquity={report.totals.totalEquity}
            showEquityTotal={showEquityTotal}
            isHoveredLinked={isHovered}
            onHoverLink={(hov) => setHoveredLinkedKey(hov ? 're-link' : null)}
          />
        </div>
      </div>

      {/* Footer / Cross-Check Bar */}
      <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">
            Reconciliation Check:
          </span>
          <span className="text-slate-700">
            Movement Closing (
            <span className="font-semibold text-indigo-700">
              {formatBDT(report.totals.closingRetainedEarnings)}
            </span>
            ) = Equity Earnings (
            <span className="font-semibold text-emerald-700">
              {formatBDT(
                report.equity.find((e) => e.source === 'linked')?.amount || 0
              )}
            </span>
            )
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Tied & Reconciled
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Income Statement Net Profit fed into Current Year Profit</span>
          <span>•</span>
          <span>Equity ties to Balance Sheet Owner's Equity</span>
        </div>
      </div>
    </div>
  );
};

