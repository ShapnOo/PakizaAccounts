import React, { useEffect, useState } from 'react';
import { CurrencySetup, RateHistoryEntry } from '../../types/currency';
import { getRateHistory } from '../../services/currencyService';
import { formatNumber } from '../../lib/format';
import { X, History, TrendingUp, Calendar, Clock } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen && currency) {
      setLoading(true);
      getRateHistory(currency.id).then((data) => {
        setHistory(data);
        setLoading(false);
      });
    }
  }, [isOpen, currency]);

  if (!isOpen || !currency) return null;

  // Mini Chart Calculations
  const sortedForChart = [...history].sort(
    (a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime()
  );

  const rates = sortedForChart.map((h) => h.rate);
  const minRate = rates.length > 0 ? Math.min(...rates) * 0.98 : 0;
  const maxRate = rates.length > 0 ? Math.max(...rates) * 1.02 : 100;
  const range = maxRate - minRate || 1;

  const chartWidth = 340;
  const chartHeight = 90;

  const points = sortedForChart
    .map((h, i) => {
      const x = (i / (sortedForChart.length - 1 || 1)) * (chartWidth - 20) + 10;
      const y = chartHeight - ((h.rate - minRate) / range) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center">
              <History className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Rate History — {currency.code} ({currency.symbol})
              </h2>
              <p className="text-xs text-muted-foreground">{currency.country}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 flex-1 overflow-y-auto sidebar-scroll space-y-5">
          {/* Mini Visual Chart */}
          {sortedForChart.length > 1 && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-muted/20 border border-border/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-indigo-600" />
                  <span>Rate Trend</span>
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Min: {formatNumber(Math.min(...rates))} • Max: {formatNumber(Math.max(...rates))}
                </span>
              </div>

              <div className="w-full flex justify-center py-2">
                <svg width={chartWidth} height={chartHeight} className="overflow-visible">
                  {/* Grid line */}
                  <line
                    x1="10"
                    y1={chartHeight - 10}
                    x2={chartWidth - 10}
                    y2={chartHeight - 10}
                    stroke="currentColor"
                    className="text-border"
                    strokeDasharray="3 3"
                  />
                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                  {/* Point circles */}
                  {sortedForChart.map((h, i) => {
                    const x = (i / (sortedForChart.length - 1 || 1)) * (chartWidth - 20) + 10;
                    const y = chartHeight - ((h.rate - minRate) / range) * (chartHeight - 20) - 10;
                    return (
                      <circle
                        key={h.id}
                        cx={x}
                        cy={y}
                        r="3.5"
                        className="fill-indigo-600 stroke-white stroke-2"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          )}

          {/* Table of Entries */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recorded Rates Log
            </h3>

            {loading ? (
              <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                Loading history…
              </div>
            ) : history.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No historical rates recorded yet.
              </div>
            ) : (
              <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/40 border-b border-border/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2 px-3">Effective Date</th>
                      <th className="py-2 px-3 text-right">Exchange Rate</th>
                      <th className="py-2 px-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {history.map((entry, idx) => (
                      <tr key={entry.id} className="hover:bg-muted/20">
                        <td className="py-2 px-3 font-semibold text-foreground flex items-center gap-1.5">
                          <Calendar className="size-3 text-muted-foreground" />
                          <span>{entry.effectiveDate}</span>
                          {idx === 0 && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-foreground">
                          {formatNumber(entry.rate, currency.decimalPlace || 2)}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-muted-foreground">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
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
