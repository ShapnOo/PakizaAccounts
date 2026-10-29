import React from 'react';
import {
  useTrialBalanceStore,
  useTbAdvanceFilterStore,
} from '../../stores/trialBalanceStore';
import { CurrencySelect } from './CurrencySelect';
import { DateRangeSelect } from './DateRangeSelect';
import { ValueShowInSelect } from './ValueShowInSelect';
import { AdvanceFilterToggle } from './AdvanceFilterToggle';
import { GlOnlyToggle } from './GlOnlyToggle';
import { SubLedgerToggle } from './SubLedgerToggle';
import { ColumnTogglePopover } from './ColumnTogglePopover';
import { ExpandCollapseControls } from './ExpandCollapseControls';
import { ExportMenu } from './ExportMenu';
import { AdvanceFilter } from '../gl/AdvanceFilter';
import { RotateCcw, Sliders } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const TopControlBar: React.FC = () => {
  const {
    filters,
    loading,
    setCurrency,
    setDateRange,
    setCustomDateRange,
    setValueShowIn,
    toggleGlOnly,
    toggleSubLedger,
    toggleColumn,
    toggleAdvancedFilter,
    setExpandAll,
    reset,
    export: exportReport,
  } = useTrialBalanceStore();

  const advanceFilterState = useTbAdvanceFilterStore((s) => s.state);
  const activeFilterCount = advanceFilterState.conditions.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-4 transition-all overflow-hidden font-sans">
      {/* Top Header of Control Card */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
            <Sliders className="size-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Statement Filters & Tree Options
            </span>
            <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
              Adjust parameters, toggle columns, or filter by sub-ledger
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <AdvanceFilterToggle
            collapsed={filters.advancedFilterCollapsed}
            onToggle={toggleAdvancedFilter}
            activeCount={activeFilterCount}
          />

          <button
            type="button"
            onClick={reset}
            title="Reset parameters to defaults"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <RotateCcw className="size-3 text-slate-400" />
            <span>Reset</span>
          </button>

          <ExportMenu onExport={exportReport} disabled={loading} />
        </div>
      </div>

      {/* Control Grid: Row 1 (Core Filters) & Row 2 (Tree & Column Controls) */}
      <div className="p-4 space-y-3.5">
        {/* Row 1: Date Range, Currency, Value Show In */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <DateRangeSelect
            value={filters.dateRange}
            customFrom={filters.customFrom}
            customTo={filters.customTo}
            onChange={setDateRange}
            onCustomChange={setCustomDateRange}
            disabled={loading}
          />

          <CurrencySelect
            value={filters.currency}
            onChange={setCurrency}
            disabled={loading}
          />

          <ValueShowInSelect
            value={filters.valueShowIn}
            onChange={setValueShowIn}
            disabled={loading}
          />

          {/* Quick Info / Counter */}
          <div className="h-8.5 px-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-xs text-slate-600">
            <span>Trial Balance Grid</span>
            <span className="font-semibold text-indigo-700">6 Value Columns</span>
          </div>
        </div>

        {/* Row 2: GL only, Sub-Ledger toggle, Column Hide/Show, Expand/Collapse */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <GlOnlyToggle
              checked={filters.glOnly}
              onToggle={toggleGlOnly}
              disabled={loading}
            />

            <SubLedgerToggle
              checked={filters.subLedger}
              onToggle={toggleSubLedger}
              disabled={loading}
            />

            <ColumnTogglePopover
              columns={filters.visibleColumns}
              onToggle={toggleColumn}
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider hidden sm:inline">
              Tree Hierarchy:
            </span>
            <ExpandCollapseControls
              onExpandAll={() => setExpandAll(true)}
              onCollapseAll={() => setExpandAll(false)}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Advance Criteria Filter Drawer */}
      <AnimatePresence>
        {!filters.advancedFilterCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 bg-slate-50/50 p-4 overflow-hidden"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Advanced Criteria Filter (Account / Subsidiary / Vehicle / Reference)
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">
                Filters accounts and recomputes trial balance roll-ups
              </span>
            </div>
            <AdvanceFilter useStore={useTbAdvanceFilterStore} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

