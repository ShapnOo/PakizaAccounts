import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
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
  getAssetLiabilitiesData,
} from '../../services/dashboardService';
import { ChartCardWrapper } from './ChartCardWrapper';

const COLORS = {
  currentAssets: '#16a34a', // Green
  fixedAssets: '#0284c7', // Sky Blue
  currentLiabilities: '#e11d48', // Red
  equity: '#9333ea', // Purple
};

const PIE_COLORS = ['#16a34a', '#0284c7', '#e11d48', '#9333ea'];

export function AssetLiabilitiesChartCard() {
  const { duration, branch, financialYear, chartViews, setChartView } =
    useDashboardStore();
  const currentView = chartViews.assetsLiabilities || 'bar';

  const data = useMemo(
    () => getAssetLiabilitiesData(duration, branch, financialYear),
    [duration, branch, financialYear]
  );

  const pieData = useMemo(() => {
    const latest = data[data.length - 1] || data[0];
    return [
      { name: 'Current Assets', value: latest.currentAssets },
      { name: 'Fixed Assets', value: latest.fixedAssets },
      { name: 'Current Liabilities', value: latest.currentLiabilities },
      { name: 'Shareholders Equity', value: latest.equity },
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
      id="assetsLiabilities"
      title="Asset & Liabilities Balance"
      description="Balance sheet composition & equity structure by quarter"
      badge="Financial Health"
      currentView={currentView}
      onViewChange={(v) => setChartView('assetsLiabilities', v)}
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
            <Line type="monotone" dataKey="currentAssets" name="Current Assets" stroke={COLORS.currentAssets} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="fixedAssets" name="Fixed Assets" stroke={COLORS.fixedAssets} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="currentLiabilities" name="Current Liabilities" stroke={COLORS.currentLiabilities} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="equity" name="Equity" stroke={COLORS.equity} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
          </LineChart>
        ) : currentView === 'area' ? (
          <AreaChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
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
            <Area type="monotone" dataKey="currentAssets" name="Current Assets" stroke={COLORS.currentAssets} fill={COLORS.currentAssets} fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="fixedAssets" name="Fixed Assets" stroke={COLORS.fixedAssets} fill={COLORS.fixedAssets} fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="currentLiabilities" name="Current Liabilities" stroke={COLORS.currentLiabilities} fill={COLORS.currentLiabilities} fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="equity" name="Equity" stroke={COLORS.equity} fill={COLORS.equity} fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
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
              iconType="square"
              iconSize={7}
            />
            <Bar dataKey="currentAssets" name="Current Assets" fill={COLORS.currentAssets} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="fixedAssets" name="Fixed Assets" fill={COLORS.fixedAssets} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="currentLiabilities" name="Current Liabilities" fill={COLORS.currentLiabilities} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="equity" name="Equity" fill={COLORS.equity} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartCardWrapper>
  );
}
