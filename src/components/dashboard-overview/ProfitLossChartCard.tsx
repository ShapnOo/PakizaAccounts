import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useDashboardStore } from '../../stores/useDashboardStore';
import {
  formatBDTAmount,
  getProfitLossData,
} from '../../services/dashboardService';
import { ChartCardWrapper } from './ChartCardWrapper';

const COLORS = {
  revenue: '#3b82f6',
  costOfRevenue: '#64748b',
  grossProfit: '#0ea5e9',
  netProfit: '#10b981',
};

const PIE_COLORS = ['#3b82f6', '#64748b', '#0ea5e9', '#10b981'];

export function ProfitLossChartCard() {
  const { duration, branch, financialYear, chartViews, setChartView } =
    useDashboardStore();
  const currentView = chartViews.profitLoss || 'line';

  const data = useMemo(
    () => getProfitLossData(duration, branch, financialYear),
    [duration, branch, financialYear]
  );

  const pieData = useMemo(() => {
    const totalRev = data.reduce((s, d) => s + d.revenue, 0);
    const totalCost = data.reduce((s, d) => s + d.costOfRevenue, 0);
    const totalGross = data.reduce((s, d) => s + d.grossProfit, 0);
    const totalNet = data.reduce((s, d) => s + d.netProfit, 0);
    return [
      { name: 'Revenue', value: totalRev },
      { name: 'Cost of Sales', value: totalCost },
      { name: 'Gross Profit', value: totalGross },
      { name: 'Net Profit', value: totalNet },
    ];
  }, [data]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="rounded-xl border border-border bg-popover p-2.5 text-xs shadow-xl space-y-1">
        <p className="font-bold text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.payload?.fill }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-bold font-mono text-foreground">
              {formatBDTAmount(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartCardWrapper
      id="profitLoss"
      title="Profit & Loss Status"
      description="Revenue vs Cost of Sales vs Gross Profit vs Net Profit"
      badge="Financial Performance"
      currentView={currentView}
      onViewChange={(v) => setChartView('profitLoss', v)}
    >
      <ResponsiveContainer width="100%" height="100%" debounce={120}>
        {currentView === 'bar' ? (
          <BarChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v: number) => `${(v / 10000000).toFixed(0)}Cr`}
            />
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              iconType="circle"
              iconSize={6}
            />
            <Bar dataKey="revenue" name="Revenue" fill={COLORS.revenue} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="costOfRevenue" name="Cost of Sales" fill={COLORS.costOfRevenue} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="grossProfit" name="Gross Profit" fill={COLORS.grossProfit} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="netProfit" name="Net Profit" fill={COLORS.netProfit} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
        ) : currentView === 'area' ? (
          <AreaChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="plRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.revenue} stopOpacity={0.35} />
                <stop offset="90%" stopColor={COLORS.revenue} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="plNetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.netProfit} stopOpacity={0.4} />
                <stop offset="90%" stopColor={COLORS.netProfit} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v: number) => `${(v / 10000000).toFixed(0)}Cr`}
            />
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              iconType="circle"
              iconSize={6}
            />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.revenue} fill="url(#plRevGrad)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="grossProfit" name="Gross Profit" stroke={COLORS.grossProfit} fill="none" strokeWidth={2} strokeDasharray="3 3" isAnimationActive={false} />
            <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke={COLORS.netProfit} fill="url(#plNetGrad)" strokeWidth={2.5} isAnimationActive={false} />
          </AreaChart>
        ) : currentView === 'pie' ? (
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
              isAnimationActive={false}
            >
              {pieData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
              iconType="circle"
              iconSize={7}
            />
          </PieChart>
        ) : (
          <LineChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v: number) => `${(v / 10000000).toFixed(0)}Cr`}
            />
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              iconType="circle"
              iconSize={6}
            />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.revenue} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="costOfRevenue" name="Cost of Sales" stroke={COLORS.costOfRevenue} strokeWidth={1.5} dot={{ r: 2.5 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="grossProfit" name="Gross Profit" stroke={COLORS.grossProfit} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke={COLORS.netProfit} strokeWidth={2.5} dot={{ r: 3.5 }} isAnimationActive={false} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartCardWrapper>
  );
}
