import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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
  getExpenseBreakdownData,
} from '../../services/dashboardService';
import { ChartCardWrapper } from './ChartCardWrapper';

export function ExpenseBreakdownCard() {
  const { duration, branch, chartViews, setChartView } = useDashboardStore();
  const currentView = chartViews.expenseBreakdown || 'pie';

  const data = useMemo(
    () => getExpenseBreakdownData(duration, branch),
    [duration, branch]
  );

  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-popover p-2.5 text-xs shadow-xl space-y-1">
        <p className="font-bold text-foreground">{item.name}</p>
        <div className="flex items-center justify-between gap-3 text-muted-foreground">
          <span>Allocated Amount:</span>
          <span className="font-bold font-mono text-foreground">
            {formatBDTAmount(item.value)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-muted-foreground">
          <span>Cost Share:</span>
          <span className="font-bold text-primary">{item.percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <ChartCardWrapper
      id="expenseBreakdown"
      title="Expense by Cost Center"
      description="Operational cost breakdown across mills, production & admin heads"
      badge="Cost Allocation"
      currentView={currentView}
      onViewChange={(v) => setChartView('expenseBreakdown', v)}
      allowedViews={['pie', 'bar']}
    >
      <ResponsiveContainer width="100%" height="100%" debounce={120}>
        {currentView === 'bar' ? (
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 20, left: 40, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              width={100}
            />
            <Tooltip content={customTooltip} />
            <Bar
              dataKey="value"
              name="Expense Amount"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={3}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
              iconType="circle"
              iconSize={6}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </ChartCardWrapper>
  );
}
