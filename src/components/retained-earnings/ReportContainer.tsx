import React from 'react';
import { RetainedEarningsReport } from '../../types/retainedEarnings';
import { useRetainedEarningsStore } from '../../stores/retainedEarningsStore';
import { formatBDT } from '../../lib/retainedEarningsMath';
import {
  TrendingUp,
  Landmark,
  Link2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface ReportContainerProps {
  report: RetainedEarningsReport;
}

export const ReportContainer: React.FC<ReportContainerProps> = ({ report }) => {
  const {
    hoveredLinkedKey,
    setHoveredLinkedKey,
    showEquityTotal,
  } = useRetainedEarningsStore();

  const isLinkedHovered = hoveredLinkedKey === 're-link';

  const periodText =
    report.dateRange === 'Custom' && report.customFrom && report.customTo
      ? `${report.customFrom} to ${report.customTo}`
      : report.dateRange;

  // Extract Movement Rows
  const opening = report.movement.find((m) => m.rowType === 'opening');
  const profit = report.movement.find((m) => m.id === 'm2');
  const dividend = report.movement.find((m) => m.id === 'm3');
  const reval = report.movement.find((m) => m.id === 'm4');
  const closing = report.movement.find((m) => m.rowType === 'closing');

  // Extract Equity Rows
  const shareCapital = report.equity.find((e) => e.id === 'e1');
  const earnings = report.equity.find((e) => e.id === 'e2');
  const reserve = report.equity.find((e) => e.id === 'e3');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col font-sans transition-all">
      {/* Table Scroll Wrapper */}
      <div className="table-scroll w-full overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans min-w-[760px] table-fixed">
          <colgroup>
            {/* Left Panel: Movement (50%) */}
            <col className="w-[36%]" />
            <col className="w-[14%]" />
            {/* Right Panel: Equity (50%) */}
            <col className="w-[36%]" />
            <col className="w-[14%]" />
          </colgroup>

          {/* Super Headers */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              {/* Left Panel Header */}
              <th
                colSpan={2}
                className="py-3 px-4 border-r-2 border-r-slate-300 text-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                      <TrendingUp className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Retained Earnings Movement
                      </h3>
                      <p className="text-[11px] font-normal text-slate-500">
                        Period: {periodText} • Currency: BDT (৳)
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Movement Log
                  </span>
                </div>
              </th>

              {/* Right Panel Header */}
              <th colSpan={2} className="py-3 px-4 text-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                      <Landmark className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Equity Snapshot
                      </h3>
                      <p className="text-[11px] font-normal text-slate-500">
                        Balance Sheet Equity Components
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Snapshot
                  </span>
                </div>
              </th>
            </tr>

            {/* Column Headers */}
            <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {/* Left Column Headers */}
              <th className="py-2 px-4 border-r border-slate-200">
                Particulars
              </th>
              <th className="py-2 px-4 text-right border-r-2 border-r-slate-300">
                Amount (BDT)
              </th>

              {/* Right Column Headers */}
              <th className="py-2 px-4 border-r border-slate-200">
                Particulars
              </th>
              <th className="py-2 px-4 text-right">Amount (BDT)</th>
            </tr>
          </thead>

          <tbody className="text-xs font-sans divide-y divide-slate-100">
            {/* ROW 1: Opening Retained Earnings <---> Share Capital */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              {/* Left: Opening */}
              <td className="py-2.5 px-4 text-slate-700 font-medium border-r border-slate-200">
                {opening?.label || 'Opening Retained Earnings'}
              </td>
              <td className="py-2.5 px-4 text-right text-slate-800 tabular-nums border-r-2 border-r-slate-300">
                {formatBDT(opening?.amount || 0)}
              </td>

              {/* Right: Share Capital */}
              <td className="py-2.5 px-4 text-slate-700 border-r border-slate-200">
                {shareCapital?.label || 'Share Capital'}
              </td>
              <td className="py-2.5 px-4 text-right text-slate-800 tabular-nums">
                {formatBDT(shareCapital?.amount || 0)}
              </td>
            </tr>

            {/* ROW 2: Add: Current Year Profit <---> Earnings (Linked) */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              {/* Left: Add Profit */}
              <td className="py-2.5 px-4 pl-8 border-r border-slate-200">
                <span className="font-semibold text-emerald-600 mr-1.5">
                  Add:
                </span>
                <span className="text-slate-700">Current Year Profit</span>
              </td>
              <td className="py-2.5 px-4 text-right text-slate-800 tabular-nums border-r-2 border-r-slate-300">
                {formatBDT(profit?.amount || 0)}
              </td>

              {/* Right: Earnings (Linked to Closing) */}
              <td
                className={`py-2.5 px-4 border-r border-slate-200 transition-colors ${
                  isLinkedHovered ? 'bg-emerald-50/90' : ''
                }`}
                onMouseEnter={() => setHoveredLinkedKey('re-link')}
                onMouseLeave={() => setHoveredLinkedKey(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 font-medium">Earnings</span>
                  <div
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-[10px] font-semibold cursor-pointer"
                    title="Linked to Closing Retained Earnings on the left panel"
                  >
                    <Link2 className="size-2.5" />
                    <span>← Retained</span>
                  </div>
                </div>
              </td>
              <td
                className={`py-2.5 px-4 text-right tabular-nums font-semibold transition-colors ${
                  isLinkedHovered
                    ? 'bg-emerald-50/90 text-emerald-950 font-bold'
                    : 'text-slate-900'
                }`}
                onMouseEnter={() => setHoveredLinkedKey('re-link')}
                onMouseLeave={() => setHoveredLinkedKey(null)}
              >
                {formatBDT(earnings?.amount || 0)}
              </td>
            </tr>

            {/* ROW 3: Less: Dividend <---> Reserve & Plus */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              {/* Left: Less Dividend */}
              <td className="py-2.5 px-4 pl-8 border-r border-slate-200">
                <span className="font-semibold text-rose-600 mr-1.5">
                  Less:
                </span>
                <span className="text-slate-700">Dividend</span>
              </td>
              <td className="py-2.5 px-4 text-right text-slate-800 tabular-nums border-r-2 border-r-slate-300">
                {formatBDT(dividend?.amount || 0)}
              </td>

              {/* Right: Reserve & Plus */}
              <td className="py-2.5 px-4 text-slate-700 border-r border-slate-200">
                {reserve?.label || 'Reserve & Plus'}
              </td>
              <td className="py-2.5 px-4 text-right text-slate-800 tabular-nums">
                {formatBDT(reserve?.amount || 0)}
              </td>
            </tr>

            {/* ROW 4: Add: Re-valuation <---> (Empty spacer matching row 4) */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              {/* Left: Add Revaluation */}
              <td className="py-2.5 px-4 pl-8 border-r border-slate-200">
                <span className="font-semibold text-emerald-600 mr-1.5">
                  Add:
                </span>
                <span className="text-slate-700">Re-valuation</span>
              </td>
              <td className="py-2.5 px-4 text-right text-slate-800 tabular-nums border-r-2 border-r-slate-300">
                {formatBDT(reval?.amount || 0)}
              </td>

              {/* Right: Spacer row to maintain 1-to-1 horizontal alignment */}
              <td className="py-2.5 px-4 text-slate-400 italic text-[11px] border-r border-slate-200 bg-slate-50/20">
                —
              </td>
              <td className="py-2.5 px-4 text-right text-slate-300 tabular-nums bg-slate-50/20">
                —
              </td>
            </tr>

            {/* ROW 5 (SUMMARY ROW): Closing Retained Earnings <---> Total Equity */}
            <tr className="border-t-2 border-slate-300 bg-indigo-50/30 font-bold">
              {/* Left: Closing Retained Earnings */}
              <td
                className={`py-3 px-4 border-r border-slate-200 transition-colors ${
                  isLinkedHovered ? 'bg-emerald-50/90' : ''
                }`}
                onMouseEnter={() => setHoveredLinkedKey('re-link')}
                onMouseLeave={() => setHoveredLinkedKey(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-bold text-xs">
                    Closing Retained Earnings
                  </span>
                  <div
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-[10px] font-semibold cursor-pointer"
                    title="Ties directly into Equity Earnings snapshot on the right"
                  >
                    <span>→ Equity</span>
                    <Link2 className="size-2.5" />
                  </div>
                </div>
              </td>
              <td
                className={`py-3 px-4 text-right tabular-nums text-xs font-bold border-r-2 border-r-slate-300 transition-colors ${
                  isLinkedHovered
                    ? 'bg-emerald-50/90 text-emerald-950'
                    : 'text-indigo-950'
                }`}
                onMouseEnter={() => setHoveredLinkedKey('re-link')}
                onMouseLeave={() => setHoveredLinkedKey(null)}
              >
                {formatBDT(closing?.amount || 0)}
              </td>

              {/* Right: Total Equity */}
              {showEquityTotal ? (
                <>
                  <td className="py-3 px-4 text-slate-900 font-bold text-xs border-r border-slate-200 bg-slate-100/70 uppercase tracking-wide">
                    Total Equity
                  </td>
                  <td className="py-3 px-4 text-right text-slate-950 font-bold text-xs tabular-nums bg-slate-100/70">
                    {formatBDT(report.totals.totalEquity)}
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-4 border-r border-slate-200 bg-slate-50/20"></td>
                  <td className="py-3 px-4 text-right bg-slate-50/20">—</td>
                </>
              )}
            </tr>
          </tbody>
        </table>
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
              {formatBDT(earnings?.amount || 0)}
            </span>
            )
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Tied & Reconciled
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Income Statement Net Profit feeds Current Year Profit</span>
          <span>•</span>
          <span>Equity ties to Balance Sheet Owner's Equity</span>
        </div>
      </div>
    </div>
  );
};
