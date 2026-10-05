import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { getVoucherDistributionData } from '../../services/dashboardService';
import { ChartCardWrapper } from './ChartCardWrapper';

const COLORS = {
  drVoucher: '#f59e0b', // Amber (Payment)
  crVoucher: '#10b981', // Emerald (Receive)
  cntVoucher: '#3b82f6', // Blue (Contra)
  jnlVoucher: '#8b5cf6', // Violet (Journal)
};

const PIE_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export function VoucherChartCard() {
  const { duration, branch, financialYear, chartViews, setChartView } =
    useDashboardStore();
  const currentView = chartViews.vouchers || 'bar';

  const data = useMemo(
    () => getVoucherDistributionData(duration, branch, financialYear),
    [duration, branch, financialYear]
  );

  const pieData = useMemo(() => {
    const totalDr = data.reduce((s, d) => s + d.drVoucher, 0);
    const totalCr = data.reduce((s, d) => s + d.crVoucher, 0);
    const totalCnt = data.reduce((s, d) => s + d.cntVoucher, 0);
    const totalJnl = data.reduce((s, d) => s + d.jnlVoucher, 0);
    return [
      { name: 'Dr Voucher (Payment)', value: totalDr },
      { name: 'Cr Voucher (Receive)', value: totalCr },
      { name: 'Contra Voucher', value: totalCnt },
      { name: 'Journal Voucher', value: totalJnl },
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
              {entry.value} vouchers
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartCardWrapper
      id="vouchers"
      title="Total Voucher Distribution"
      description="Monthly volume of Payment, Receive, Contra, and Journal vouchers"
      badge="Transaction Volume"
      currentView={currentView}
      onViewChange={(v) => setChartView('vouchers', v)}
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
            />
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              iconType="circle"
              iconSize={6}
            />
            <Line type="monotone" dataKey="drVoucher" name="Dr Voucher" stroke={COLORS.drVoucher} strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="crVoucher" name="Cr Voucher" stroke={COLORS.crVoucher} strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="cntVoucher" name="Contra Voucher" stroke={COLORS.cntVoucher} strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="jnlVoucher" name="Journal Voucher" stroke={COLORS.jnlVoucher} strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
          </LineChart>
        ) : currentView === 'area' ? (
          <AreaChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="vchDrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.drVoucher} stopOpacity={0.3} />
                <stop offset="90%" stopColor={COLORS.drVoucher} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="vchCrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.crVoucher} stopOpacity={0.3} />
                <stop offset="90%" stopColor={COLORS.crVoucher} stopOpacity={0.05} />
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
            />
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              iconType="circle"
              iconSize={6}
            />
            <Area type="monotone" dataKey="drVoucher" name="Dr Voucher" stroke={COLORS.drVoucher} fill="url(#vchDrGrad)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="crVoucher" name="Cr Voucher" stroke={COLORS.crVoucher} fill="url(#vchCrGrad)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="cntVoucher" name="Contra Voucher" stroke={COLORS.cntVoucher} fill="none" strokeWidth={1.5} isAnimationActive={false} />
            <Area type="monotone" dataKey="jnlVoucher" name="Journal Voucher" stroke={COLORS.jnlVoucher} fill="none" strokeWidth={1.5} strokeDasharray="3 3" isAnimationActive={false} />
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
            />
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              iconType="square"
              iconSize={7}
            />
            <Bar dataKey="drVoucher" fill={COLORS.drVoucher} name="Dr Voucher" radius={[2, 2, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="crVoucher" fill={COLORS.crVoucher} name="Cr Voucher" radius={[2, 2, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="cntVoucher" fill={COLORS.cntVoucher} name="Cnt Voucher" radius={[2, 2, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="jnlVoucher" fill={COLORS.jnlVoucher} name="Jnl Voucher" radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartCardWrapper>
  );
}
