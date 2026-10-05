import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
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
  getWorkingCapitalData,
} from '../../services/dashboardService';
import { ChartCardWrapper } from './ChartCardWrapper';

const COLORS = {
  debit: '#2563eb', // Blue
  credit: '#f97316', // Orange
  netCapital: '#10b981', // Emerald
};

const PIE_COLORS = ['#2563eb', '#f97316', '#10b981'];

export function WorkingCapitalChartCard() {
  const { duration, branch, financialYear, chartViews, setChartView } =
    useDashboardStore();
  const currentView = chartViews.workingCapital || 'area';

  const data = useMemo(
    () => getWorkingCapitalData(duration, branch, financialYear),
    [duration, branch, financialYear]
  );

  const pieData = useMemo(() => {
    const totalDeb = data.reduce((s, d) => s + d.debit, 0);
    const totalCred = data.reduce((s, d) => s + d.credit, 0);
    const totalNet = data.reduce((s, d) => s + d.netWorkingCapital, 0);
    return [
      { name: 'Total Debit Flow', value: totalDeb },
      { name: 'Total Credit Flow', value: totalCred },
      { name: 'Net Working Capital', value: totalNet },
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
      id="workingCapital"
      title="Working Capital Position"
      description="Debit vs Credit ledger movement across billing periods"
      badge="Liquidity Velocity"
      currentView={currentView}
      onViewChange={(v) => setChartView('workingCapital', v)}
    >
      <ResponsiveContainer width="100%" height="100%" debounce={120}>
        {currentView === 'line' ? (
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
            <Line type="monotone" dataKey="debit" name="Debit Inflow" stroke={COLORS.debit} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="credit" name="Credit Outflow" stroke={COLORS.credit} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="netWorkingCapital" name="Net Working Capital" stroke={COLORS.netCapital} strokeWidth={2.5} dot={{ r: 3 }} strokeDasharray="4 4" isAnimationActive={false} />
          </LineChart>
        ) : currentView === 'bar' ? (
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
            <Bar dataKey="debit" name="Debit Flow" fill={COLORS.debit} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="credit" name="Credit Flow" fill={COLORS.credit} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="netWorkingCapital" name="Net Capital" fill={COLORS.netCapital} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
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
          <AreaChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="wcDebGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.debit} stopOpacity={0.3} />
                <stop offset="90%" stopColor={COLORS.debit} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="wcCredGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.credit} stopOpacity={0.3} />
                <stop offset="90%" stopColor={COLORS.credit} stopOpacity={0.05} />
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
            <Area type="monotone" dataKey="debit" name="Debit Inflow" stroke={COLORS.debit} fill="url(#wcDebGrad)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="credit" name="Credit Outflow" stroke={COLORS.credit} fill="url(#wcCredGrad)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="netWorkingCapital" name="Net Capital" stroke={COLORS.netCapital} fill="none" strokeWidth={2.5} strokeDasharray="4 4" isAnimationActive={false} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </ChartCardWrapper>
  );
}
