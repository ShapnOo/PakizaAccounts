import { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  Sliders,
  RefreshCw,
  Building2,
  TrendingUp,
  LayoutGrid,
  PieChart,
  Check,
} from 'lucide-react';
import { useDashboardStore } from '../../stores/useDashboardStore';
import {
  BRANCH_OPTIONS,
  DURATION_OPTIONS,
  FINANCIAL_YEAR_OPTIONS,
} from '../../services/dashboardService';
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
      toast.success('Dashboard metrics updated');
    }, 450);
  };

  const handleDownload = () => {
    toast.info('Generating Financial Executive Summary PDF...', {
      description: `Period: ${duration} • Entity: ${currentBranchLabel}`,
    });
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Main Row: Title + Mode Switcher + Action buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ledger
            </span>
            <span className="text-xs text-muted-foreground font-medium">•</span>
            <span className="text-xs font-medium text-muted-foreground">
              Pakiza Group F&A Suite
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Financial & Management Overview
          </h1>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-muted/70 border border-border/60 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setMode('executive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'executive'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="size-3.5 text-primary" />
            <span>Executive</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('operational')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'operational'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="size-3.5 text-emerald-600" />
            <span>Operational</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('full')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'full'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PieChart className="size-3.5 text-indigo-600" />
            <span>Full Integrated</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh Ledger Calculations"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-xs"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setCustomizerOpen(!customizerOpen)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium shadow-xs transition-all cursor-pointer"
          >
            <Sliders className="size-3.5 text-muted-foreground" />
            <span>Customize</span>
            <span className="px-1.5 py-0.2 rounded-full bg-muted font-mono text-[10px] text-muted-foreground font-semibold">
              {activeWidgetsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Control Strip: Clean, unified, single line */}
      <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Entity / Branch Selector */}
          <div className="relative" ref={branchRef}>
            <button
              type="button"
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex h-8.5 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted/50 transition-all"
            >
              <Building2 className="size-3.5 text-muted-foreground" />
              <span className="max-w-[180px] truncate">{currentBranchLabel}</span>
              <ChevronDown
                className={`size-3 text-muted-foreground transition-transform ${
                  branchOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {branchOpen && (
              <div className="absolute left-0 top-10 z-30 w-72 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-50 zoom-in-95">
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
                          ? 'bg-primary/10 text-primary font-semibold'
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

          {/* Period Selector */}
          <div className="relative" ref={durationRef}>
            <button
              type="button"
              onClick={() => setDurationOpen(!durationOpen)}
              className="flex h-8.5 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted/50 transition-all"
            >
              <Calendar className="size-3.5 text-muted-foreground" />
              <span>Period: {duration}</span>
              <ChevronDown
                className={`size-3 text-muted-foreground transition-transform ${
                  durationOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {durationOpen && (
              <div className="absolute left-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-50 zoom-in-95">
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
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{d}</span>
                      {duration === d && <Check className="size-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Settings: Currency & Financial Year */}
        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-muted border border-border/60 text-[11px] font-medium">
            {(['BDT', 'USD', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === curr
                    ? 'bg-card text-foreground shadow-xs font-semibold'
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
            className="h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
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
