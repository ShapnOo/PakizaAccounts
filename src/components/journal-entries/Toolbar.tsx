import React from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  X,
} from 'lucide-react';
import {
  ViewType,
  VIEW_TYPES,
  FilterRange,
  FILTER_RANGES,
} from '../../types/journalEntry';

interface ToolbarProps {
  viewType: ViewType;
  onViewTypeChange: (v: ViewType) => void;
  filterRange: FilterRange;
  onFilterRangeChange: (r: FilterRange) => void;
  customFromDate?: string;
  customToDate?: string;
  onCustomDateChange: (from?: string, to?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  advancedOpen: boolean;
  onToggleAdvanced: () => void;
  activeFilterCount: number;
  onExportCsv: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewType,
  onViewTypeChange,
  filterRange,
  onFilterRangeChange,
  customFromDate,
  customToDate,
  onCustomDateChange,
  searchQuery,
  onSearchChange,
  advancedOpen,
  onToggleAdvanced,
  activeFilterCount,
  onExportCsv,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Side: View Type Selector & Filter Range */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented View Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/80 shadow-2xs">
            {VIEW_TYPES.map((vt) => {
              const Icon = vt.icon;
              const isActive = viewType === vt.value;
              return (
                <button
                  key={vt.value}
                  type="button"
                  onClick={() => onViewTypeChange(vt.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{vt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={filterRange}
              onChange={(e) => onFilterRangeChange(e.target.value as FilterRange)}
              className="h-9 pl-3 pr-8 rounded-xl border border-border bg-card text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer appearance-none"
            >
              {FILTER_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  Filter: {r.label}
                </option>
              ))}
            </select>
            <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Custom Date Inputs if Custom Range is selected */}
          {filterRange === 'custom' && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border shadow-2xs">
              <Calendar className="size-3.5 text-muted-foreground ml-1.5" />
              <input
                type="date"
                value={customFromDate || ''}
                onChange={(e) => onCustomDateChange(e.target.value, customToDate)}
                className="h-7 px-2 text-[11px] font-medium text-foreground bg-transparent border-none outline-none"
                placeholder="From"
              />
              <span className="text-muted-foreground text-xs font-bold">-</span>
              <input
                type="date"
                value={customToDate || ''}
                onChange={(e) => onCustomDateChange(customFromDate, e.target.value)}
                className="h-7 px-2 text-[11px] font-medium text-foreground bg-transparent border-none outline-none"
                placeholder="To"
              />
            </div>
          )}
        </div>

        {/* Right Side: Search, Advanced Filter & Export */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search voucher no, narration, account..."
              className="w-full h-9 pl-8 pr-7 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Advanced Filter Toggle */}
          <button
            type="button"
            onClick={onToggleAdvanced}
            className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              advancedOpen || activeFilterCount > 0
                ? 'bg-primary/10 border-primary text-primary shadow-primary/10'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Filter className="size-3.5" />
            <span>Advanced Filter</span>
            {activeFilterCount > 0 && (
              <span className="size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-black inline-flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`size-3 transition-transform duration-200 ${
                advancedOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={onExportCsv}
            title="Export filtered vouchers to CSV"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
