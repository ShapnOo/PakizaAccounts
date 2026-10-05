import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Receipt,
  FileCheck,
  Scale,
  Award,
} from 'lucide-react';
import {
  VoucherEntry,
  VOUCHER_TYPE_CONFIG,
  VoucherType,
} from '../../types/journalEntry';

interface BarChartViewProps {
  entries: VoucherEntry[];
  onSelectType?: (type: VoucherType) => void;
}

export const BarChartView: React.FC<BarChartViewProps> = ({
  entries,
  onSelectType,
}) => {
  const [chartMode, setChartMode] = useState<'grouped' | 'stacked'>('grouped');

  // Compute monthly data across last 6 months
  const monthsMap: Record<
    string,
    { month: string; Journal: number; Receive: number; Payment: number; Contra: number; total: number }
  > = {};

  // Build sorted list of months from entries
  entries.forEach((e) => {
    if (e.voided) return;
    const d = new Date(e.voucherDate);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    if (!monthsMap[key]) {
      monthsMap[key] = {
        month: label,
        Journal: 0,
        Receive: 0,
        Payment: 0,
        Contra: 0,
        total: 0,
      };
    }

    monthsMap[key][e.voucherType] += e.amount;
    monthsMap[key].total += e.amount;
  });

  const chartData = Object.keys(monthsMap)
    .sort()
    .map((k) => monthsMap[k]);

  // If no data, show sample baseline months
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          { month: 'Jul 26', Journal: 150000, Receive: 280000, Payment: 320000, Contra: 45000, total: 795000 },
          { month: 'Aug 26', Journal: 240000, Receive: 410000, Payment: 530000, Contra: 80000, total: 1260000 },
          { month: 'Sep 26', Journal: 1520000, Receive: 1500000, Payment: 1912500, Contra: 350000, total: 5282500 },
          { month: 'Oct 26', Journal: 45000, Receive: 0, Payment: 0, Contra: 0, total: 45000 },
        ];

  // KPIs
  const activeEntries = entries.filter((e) => !e.voided);
  const totalValue = activeEntries.reduce((s, e) => s + e.amount, 0);

  // Type counts
  const typeCounts: Record<VoucherType, number> = {
    Journal: 0,
    Receive: 0,
    Payment: 0,
    Contra: 0,
  };
  activeEntries.forEach((e) => {
    typeCounts[e.voucherType] = (typeCounts[e.voucherType] || 0) + 1;
  });

  let mostActiveType: VoucherType = 'Journal';
  let maxCount = 0;
  (Object.keys(typeCounts) as VoucherType[]).forEach((t) => {
    if (typeCounts[t] > maxCount) {
      maxCount = typeCounts[t];
      mostActiveType = t;
    }
  });

  const largestEntry = activeEntries.reduce(
    (max, e) => (e.amount > (max?.amount || 0) ? e : max),
    null as VoucherEntry | null
  );

  return (
    <div className="space-y-4">
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Receipt className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Vouchers
            </div>
            <div className="text-xl font-black text-foreground">{activeEntries.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Volume
            </div>
            <div className="text-xl font-black font-mono text-foreground">
              ৳ {totalValue >= 1000000 ? `${(totalValue / 1000000).toFixed(2)}M` : totalValue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Scale className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Most Active Type
            </div>
            <div className="text-sm font-black text-foreground flex items-center gap-1.5">
              <span>{mostActiveType}</span>
              <span className="text-xs text-muted-foreground font-normal">({maxCount})</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Award className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Largest Entry
            </div>
            <div className="text-sm font-black text-foreground font-mono truncate" title={largestEntry?.voucherNo}>
              {largestEntry ? `${largestEntry.voucherNo} (৳ ${(largestEntry.amount / 1000).toFixed(0)}k)` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Voucher Volume by Month & Type</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Monthly breakdown of financial transaction amounts across Journal, Receive, Payment, and Contra vouchers
            </p>
          </div>

          {/* Grouped vs Stacked Toggle */}
          <div className="inline-flex p-0.5 rounded-lg bg-muted/60 border border-border/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setChartMode('grouped')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                chartMode === 'grouped'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Grouped
            </button>
            <button
              type="button"
              onClick={() => setChartMode('stacked')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                chartMode === 'stacked'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Stacked
            </button>
          </div>
        </div>

        {/* Recharts BarChart Container */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                stroke="#888888"
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'currentColor' }}
                stroke="#888888"
                tickFormatter={(val) => `৳ ${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [
                  `৳ ${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                  '',
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#0f172a',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                onClick={(e: any) => {
                  if (onSelectType && e && e.dataKey) {
                    onSelectType(e.dataKey as VoucherType);
                  }
                }}
              />

              <Bar
                dataKey="Journal"
                fill={VOUCHER_TYPE_CONFIG.Journal.color.hex}
                stackId={chartMode === 'stacked' ? 'a' : undefined}
                radius={chartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
              <Bar
                dataKey="Receive"
                fill={VOUCHER_TYPE_CONFIG.Receive.color.hex}
                stackId={chartMode === 'stacked' ? 'a' : undefined}
                radius={chartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
              <Bar
                dataKey="Payment"
                fill={VOUCHER_TYPE_CONFIG.Payment.color.hex}
                stackId={chartMode === 'stacked' ? 'a' : undefined}
                radius={chartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
              <Bar
                dataKey="Contra"
                fill={VOUCHER_TYPE_CONFIG.Contra.color.hex}
                stackId={chartMode === 'stacked' ? 'a' : undefined}
                radius={chartMode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
