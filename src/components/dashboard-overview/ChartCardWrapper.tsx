import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart3,
  LineChart as LineIcon,
  AreaChart as AreaIcon,
  PieChart as PieIcon,
  ChevronDown,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';
import { ChartView } from '../../types/dashboard';

interface ChartCardWrapperProps {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  currentView: ChartView;
  onViewChange: (view: ChartView) => void;
  allowedViews?: ChartView[];
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

const VIEW_CONFIG: Record<
  ChartView,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  line: { label: 'Line Chart', icon: LineIcon },
  bar: { label: 'Bar Chart', icon: BarChart3 },
  area: { label: 'Area Chart', icon: AreaIcon },
  pie: { label: 'Pie / Donut', icon: PieIcon },
};

export function ChartCardWrapper({
  title,
  description,
  badge,
  currentView,
  onViewChange,
  allowedViews = ['line', 'bar', 'area', 'pie'],
  children,
  headerRight,
}: ChartCardWrapperProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const CurrentIcon = VIEW_CONFIG[currentView]?.icon || LineIcon;

  return (
    <div
      className={`rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
        isFullscreen ? 'fixed inset-4 z-50 bg-background shadow-2xl p-6' : 'h-[360px]'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-border/40 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {headerRight}

          {/* Chart View Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-7.5 items-center gap-1.5 rounded-lg border border-border bg-card px-2 text-[11px] font-semibold text-foreground hover:bg-muted transition-all cursor-pointer"
              title="Change Chart View"
            >
              <CurrentIcon className="size-3.5 text-primary" />
              <span className="hidden sm:inline font-medium">
                {VIEW_CONFIG[currentView]?.label}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-8.5 z-40 w-36 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-50 zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  Switch View
                </div>
                <div className="py-1">
                  {allowedViews.map((v) => {
                    const cfg = VIEW_CONFIG[v];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          onViewChange(v);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-2 py-1.5 text-xs rounded-md transition-all ${
                          currentView === v
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className="size-3.5" />
                          <span>{cfg.label}</span>
                        </div>
                        {currentView === v && <Check className="size-3 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Chart'}
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 w-full pt-3 min-h-0 relative">
        {children}
      </div>
    </div>
  );
}
