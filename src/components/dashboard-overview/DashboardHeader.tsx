import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Sliders,
  RefreshCw,
  Building2,
  TrendingUp,
  LayoutGrid,
  PieChart,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useDashboardStore } from '../../stores/useDashboardStore';
import {
  BRANCH_OPTIONS,
  DURATION_OPTIONS,
  FINANCIAL_YEAR_OPTIONS,
} from '../../services/dashboardService';
import { DashboardMode, DurationFilter } from '../../types/dashboard';
import { toast } from 'sonner';

export function DashboardHeader() {
  const {
    mode,
    setMode,
    duration,
    setDuration,
    branch,
    setBranch,
    financialYear,
    setFinancialYear,
    currency,
    setCurrency,
    customizerOpen,
    setCustomizerOpen,
    widgets,
    triggerRefresh,
  } = useDashboardStore();

  const [durationOpen, setDurationOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const durationRef = useRef<HTMLDivElement | null>(null);
  const branchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (durationRef.current && !durationRef.current.contains(e.target as Node)) {
        setDurationOpen(false);
      }
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setBranchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeWidgetsCount = Object.values(widgets).filter(Boolean).length;
  const currentBranchLabel =
    BRANCH_OPTIONS.find((b) => b.id === branch)?.name || 'All Entities';

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard metrics refreshed with live ledger balances');
    }, 450);
  };

  const handleDownload = () => {
    toast.info('Generating Financial Executive Summary PDF...', {
      description: `Data range: ${duration} • Branch: ${currentBranchLabel}`,
    });
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 md:px-5 md:py-4 shadow-sm">
        {/* Left: Title + Mode Switcher */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold tracking-wide uppercase">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Accounts Ledger
            </span>

            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              •
            </span>

            <span className="text-xs font-semibold text-foreground/80">
              Pakiza Group F&A Suite
            </span>

            <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground font-medium">
              {financialYear}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
            Financial & Management Overview
          </h1>
        </div>

        {/* Center: Mode Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-muted/80 border border-border/60 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setMode('executive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'executive'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="size-3.5 text-primary" />
            <span>Executive</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('operational')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'operational'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="size-3.5 text-emerald-600" />
            <span>Operational</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('full')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'full'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PieChart className="size-3.5 text-indigo-600" />
            <span>Full Integrated</span>
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh Ledger Calculations"
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-xs"
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`}
            />
          </button>

          {/* Customize Widgets Button */}
          <button
            type="button"
            onClick={() => setCustomizerOpen(!customizerOpen)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs hover:bg-indigo-100/60 transition-all cursor-pointer"
          >
            <Sliders className="size-3.5" />
            <span>Customize</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-mono">
              {activeWidgetsCount}
            </span>
          </button>

          {/* Download Report */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Left: Entity & Duration Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Entity / Branch Selector */}
          <div className="relative" ref={branchRef}>
            <button
              type="button"
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-xs hover:bg-muted/60 transition-all"
            >
              <Building2 className="size-3.5 text-primary" />
              <span className="max-w-[190px] truncate">{currentBranchLabel}</span>
              <ChevronDown
                className={`size-3 text-muted-foreground transition-transform ${
                  branchOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {branchOpen && (
              <div className="absolute left-0 top-10.5 z-30 w-72 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-50 zoom-in-95">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  Select Operating Entity
                </div>
                <div className="py-1 max-h-64 overflow-y-auto sidebar-scroll">
                  {BRANCH_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setBranch(item.id);
                        setBranchOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all ${
                        branch === item.id
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground px-1 py-0.5 rounded bg-muted">
                          {item.code}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      {branch === item.id && <Check className="size-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Duration Selector */}
          <div className="relative" ref={durationRef}>
            <button
              type="button"
              onClick={() => setDurationOpen(!durationOpen)}
              className="flex h-9 items-center gap-2 rounded-xl border border-emerald-300/80 dark:border-emerald-800 bg-card px-3 text-xs font-semibold text-foreground shadow-xs hover:border-emerald-400 transition-all"
            >
              <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Period: {duration}</span>
              <ChevronDown
                className={`size-3 text-muted-foreground transition-transform ${
                  durationOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {durationOpen && (
              <div className="absolute left-0 top-10.5 z-30 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-50 zoom-in-95">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  Select Duration
                </div>
                <div className="py-1">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDuration(d);
                        setDurationOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-all ${
                        duration === d
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{d}</span>
                      {duration === d && (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Currency & Financial Year */}
        <div className="flex items-center gap-2">
          {/* Currency Pill Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-muted border border-border text-[11px] font-bold">
            {(['BDT', 'USD', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === curr
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {curr === 'BDT' ? '৳ BDT' : curr === 'USD' ? '$ USD' : '€ EUR'}
              </button>
            ))}
          </div>

          {/* Financial Year Selector */}
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
          >
            {FINANCIAL_YEAR_OPTIONS.map((y) => (
              <option key={y.id} value={y.id}>
                {y.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
