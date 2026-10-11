import React, { useEffect, useState, useMemo } from 'react';
import { CurrencySetup, RateHistoryEntry } from '../../types/currency';
import { getRateHistory } from '../../services/currencyService';
import { formatNumber } from '../../lib/format';
import {
  X,
  History,
  TrendingUp,
  Calendar,
  Clock,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';

interface RateHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySetup | null;
}

export const RateHistoryDrawer: React.FC<RateHistoryDrawerProps> = ({
  isOpen,
  onClose,
  currency,
}) => {
  const [history, setHistory] = useState<RateHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchYear, setSearchYear] = useState('');
  const [timeRange, setTimeRange] = useState<'ALL' | '10Y' | '5Y' | '1Y'>('ALL');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && currency) {
      setLoading(true);
      getRateHistory(currency.id).then((data) => {
        setHistory(data);
        setLoading(false);
      });
    } else {
      setSearchYear('');
      setHoveredIdx(null);
    }
  }, [isOpen, currency]);

  // Chronological sort for charting
  const chronoSorted = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
    );
  }, [history]);

  // Filtered by time range for chart
  const filteredForChart = useMemo(() => {
    if (chronoSorted.length === 0) return [];
    if (timeRange === 'ALL') return chronoSorted;

    const latestYear = new Date(
      chronoSorted[chronoSorted.length - 1].effectiveDate
    ).getFullYear();
    const cutoffYear =
      timeRange === '1Y'
        ? latestYear - 1
        : timeRange === '5Y'
        ? latestYear - 5
        : latestYear - 10;

    return chronoSorted.filter(
      (h) => new Date(h.effectiveDate).getFullYear() >= cutoffYear
    );
  }, [chronoSorted, timeRange]);

  if (!isOpen || !currency) return null;

  // Chart metrics
  const rates = filteredForChart.map((h) => h.rate);
  const minRate = rates.length > 0 ? Math.min(...rates) : 0;
  const maxRate = rates.length > 0 ? Math.max(...rates) : 100;
  const range = maxRate - minRate || 1;

  // Change from start of filtered range to end
  const startRate = rates[0] || 0;
  const endRate = rates[rates.length - 1] || 0;
  const changePct = startRate > 0 ? ((endRate - startRate) / startRate) * 100 : 0;
  const changeDiff = endRate - startRate;

  // SVG dimensions
  const chartWidth = 380;
  const chartHeight = 120;
  const padX = 14;
  const padY = 16;
  const innerW = chartWidth - padX * 2;
  const innerH = chartHeight - padY * 2;

  const points = filteredForChart.map((h, i) => {
    const x = padX + (i / (filteredForChart.length - 1 || 1)) * innerW;
    const y = padY + innerH - ((h.rate - minRate) / range) * innerH;
    return { x, y, data: h };
  });

  const polylineStr = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const polygonStr = `${polylineStr} ${(padX + innerW).toFixed(1)},${chartHeight - 4} ${padX.toFixed(1)},${chartHeight - 4}`;

  // Key milestone years along X axis
  const milestoneYears = (() => {
    if (filteredForChart.length < 2) return [];
    const firstYear = new Date(filteredForChart[0].effectiveDate).getFullYear();
    const lastYear = new Date(filteredForChart[filteredForChart.length - 1].effectiveDate).getFullYear();
    const mid1 = Math.round(firstYear + (lastYear - firstYear) * 0.33);
    const mid2 = Math.round(firstYear + (lastYear - firstYear) * 0.67);
    return [firstYear, mid1, mid2, lastYear];
  })();

  // Filtered table entries
  const displayedHistory = history.filter((h) => {
    if (!searchYear.trim()) return true;
    return (
      h.effectiveDate.toLowerCase().includes(searchYear.toLowerCase()) ||
      h.rate.toString().includes(searchYear)
    );
  });

  const today = new Date().toISOString().split('T')[0];
  const activeEntryId = history.find((h) => h.effectiveDate <= today)?.id;

  const hoveredData = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-2xs">
              <History className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <span>{currency.code} ({currency.symbol})</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  2000 – 2026 Archive
                </span>
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {currency.name} • {currency.country}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-5 flex-1 overflow-y-auto sidebar-scroll space-y-4">
          {/* Key Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Current
              </span>
              <p className="font-mono font-bold text-xs sm:text-sm text-foreground">
                {formatNumber(endRate, currency.decimalPlace || 2)}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Period Low
              </span>
              <p className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                {formatNumber(minRate, currency.decimalPlace || 2)}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Period High
              </span>
              <p className="font-mono font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400">
                {formatNumber(maxRate, currency.decimalPlace || 2)}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/30 border border-border/70 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Growth
              </span>
              <p
                className={`font-mono font-bold text-xs sm:text-sm flex items-center gap-0.5 ${
                  changePct >= 0
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-amber-600'
                }`}
              >
                {changePct >= 0 ? '+' : ''}
                {changePct.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Interactive Trend Chart Card */}
          {filteredForChart.length > 1 && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-50/40 via-card to-card dark:from-indigo-950/20 dark:via-card border border-border/80 shadow-2xs space-y-3">
              {/* Chart Toolbar: Range filters & stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 grid place-items-center">
                    <TrendingUp className="size-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground">
                      Exchange Rate Trajectory
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {filteredForChart.length} historical milestones
                    </p>
                  </div>
                </div>

                {/* Range Buttons */}
                <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
                  {(['ALL', '10Y', '5Y', '1Y'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setTimeRange(r);
                        setHoveredIdx(null);
                      }}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                        timeRange === r
                          ? 'bg-card text-foreground shadow-2xs font-mono'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {r === 'ALL' ? '2000–Now' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hover Details Banner */}
              <div className="h-6 flex items-center justify-between text-xs px-1">
                {hoveredData ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-100">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {hoveredData.data.effectiveDate}:
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      1 {currency.code} = {formatNumber(hoveredData.data.rate, currency.decimalPlace || 2)} BDT
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span>Move cursor across chart to inspect historical rates</span>
                  </div>
                )}
              </div>

              {/* SVG Curve Container */}
              <div className="relative w-full overflow-hidden bg-background/50 rounded-xl p-2 border border-border/50">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-32 overflow-visible select-none"
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <defs>
                    <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline */}
                  <line
                    x1={padX}
                    y1={chartHeight - 4}
                    x2={chartWidth - padX}
                    y2={chartHeight - 4}
                    stroke="currentColor"
                    className="text-border/60"
                    strokeDasharray="3 3"
                  />

                  {/* Gradient Area Polygon */}
                  <polygon points={polygonStr} fill="url(#rateGradient)" />

                  {/* Polyline Curve */}
                  <polyline
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylineStr}
                  />

                  {/* Highlight First, Max, and Last Points */}
                  {points.length > 0 && (
                    <>
                      {/* Start point */}
                      <circle
                        cx={points[0].x}
                        cy={points[0].y}
                        r="3"
                        className="fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2"
                      />
                      {/* End point */}
                      <circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="3.5"
                        className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-2"
                      />
                    </>
                  )}

                  {/* Hover indicator vertical bar & circle */}
                  {hoveredData && (
                    <>
                      <line
                        x1={hoveredData.x}
                        y1={padY}
                        x2={hoveredData.x}
                        y2={chartHeight - 4}
                        stroke="#6366f1"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                      <circle
                        cx={hoveredData.x}
                        cy={hoveredData.y}
                        r="5"
                        className="fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2 shadow-lg"
                      />
                    </>
                  )}

                  {/* Interactive hover hit areas */}
                  {points.map((p, idx) => {
                    const widthPerPoint = innerW / (points.length || 1);
                    return (
                      <rect
                        key={p.data.id}
                        x={Math.max(0, p.x - widthPerPoint / 2)}
                        y={0}
                        width={widthPerPoint}
                        height={chartHeight}
                        fill="transparent"
                        className="cursor-crosshair"
                        onMouseEnter={() => setHoveredIdx(idx)}
                      />
                    );
                  })}
                </svg>

                {/* X Axis Timeline Labels */}
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/70 px-2 pt-1 border-t border-border/40">
                  {milestoneYears.map((yr, idx) => (
                    <span key={idx}>{yr}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Table of Entries */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5" />
                <span>Historical Rates Log ({displayedHistory.length})</span>
              </h3>

              {/* Quick Year Search */}
              <div className="relative w-36">
                <Search className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter year/date…"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  className="w-full h-7 pl-7 pr-2 text-[11px] rounded-lg border border-border/80 bg-background outline-none font-mono focus:border-indigo-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
                Loading history archive…
              </div>
            ) : displayedHistory.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No rates match the filter.
              </div>
            ) : (
              <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs max-h-80 overflow-y-auto sidebar-scroll bg-card">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/50 border-b border-border/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sticky top-0 z-10 backdrop-blur-xs">
                    <tr>
                      <th className="py-2 px-3">Effective Date</th>
                      <th className="py-2 px-3 text-right">Exchange Rate</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-xs">
                    {displayedHistory.map((entry) => {
                      const isScheduled = entry.effectiveDate > today;
                      const isCurrentActive = entry.id === activeEntryId;

                      return (
                        <tr
                          key={entry.id}
                          className={`hover:bg-muted/20 transition-colors ${
                            isCurrentActive
                              ? 'bg-emerald-500/[0.04]'
                              : isScheduled
                              ? 'bg-amber-500/[0.04]'
                              : ''
                          }`}
                        >
                          <td className="py-2 px-3 font-semibold text-foreground">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Calendar className="size-3 text-muted-foreground shrink-0" />
                              <span>{entry.effectiveDate}</span>
                            </div>
                          </td>

                          <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-foreground">
                            {formatNumber(entry.rate, currency.decimalPlace || 2)}
                          </td>

                          <td className="py-2 px-3 text-right font-sans">
                            {isCurrentActive && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                                Current
                              </span>
                            )}
                            {isScheduled && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30">
                                Scheduled
                              </span>
                            )}
                            {!isCurrentActive && !isScheduled && (
                              <span className="text-[10px] text-muted-foreground/60 font-mono">
                                Historical
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
