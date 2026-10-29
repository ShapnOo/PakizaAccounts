import React from 'react';
import { useBalanceSheetStore, useBsAdvanceFilterStore } from '../../stores/balanceSheetStore';
import { AsOnDatePicker } from './AsOnDatePicker';
import { CompareWithSelect } from './CompareWithSelect';
import { ShowInPercentToggle } from './ShowInPercentToggle';
import { ValueShowInSelect } from './ValueShowInSelect';
import { AdvanceFilterToggle } from './AdvanceFilterToggle';
import { NumberOfYearsInput } from './NumberOfYearsInput';
import { CurrencySelect } from './CurrencySelect';
import { ExportMenu } from './ExportMenu';
import { AdvanceFilter } from '../gl/AdvanceFilter';
import { RotateCcw, Sliders } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const TopControlBar: React.FC = () => {
  const {
    filters,
    loading,
    setAsOn,
    setCompareWith,
    setShowInPercent,
    setValueShowIn,
    setNumberOfYears,
    setCurrency,
    toggleAdvanceFilter,
    setCustomPeriod,
    exportReport,
    resetFilters,
  } = useBalanceSheetStore();

  const advanceFilterState = useBsAdvanceFilterStore((s) => s.state);
  const activeFilterCount = advanceFilterState.conditions.length;

  const colCount =
    filters.compareWith === 'None'
      ? 1
      : filters.compareWith === 'Budget' || filters.compareWith === 'Custom Period'
      ? 2
      : filters.numberOfYears + 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-4 transition-all overflow-hidden">
      {/* Top Header of Control Card */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
            <Sliders className="size-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Report Parameters & Controls
          </span>
          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Active Columns: <strong className="text-indigo-700 font-mono font-bold">{colCount}</strong>
          </span>
        </div>

        {/* Action Buttons on Right */}
        <div className="flex items-center gap-2 flex-wrap">
          <AdvanceFilterToggle
            collapsed={filters.advancedFilterCollapsed}
            onToggle={toggleAdvanceFilter}
            activeCount={activeFilterCount}
          />

          <button
            type="button"
            onClick={resetFilters}
            title="Reset all filters to defaults"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="size-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <ExportMenu onExport={exportReport} loading={loading} />
        </div>
      </div>

      {/* Evenly Distributed Grid of Filter Inputs */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <AsOnDatePicker
            value={filters.asOn}
            onChange={setAsOn}
            disabled={loading}
          />

          <CompareWithSelect
            value={filters.compareWith}
            onChange={setCompareWith}
            customStartDate={filters.customStartDate}
            customEndDate={filters.customEndDate}
            onCustomDateChange={setCustomPeriod}
          />

          <NumberOfYearsInput
            value={filters.numberOfYears}
            onChange={setNumberOfYears}
            disabled={loading || filters.compareWith === 'None'}
          />

          <CurrencySelect
            value={filters.currency}
            onChange={setCurrency}
          />

          <ShowInPercentToggle
            value={filters.showInPercent}
            onChange={setShowInPercent}
          />

          <ValueShowInSelect
            value={filters.valueShowIn}
            onChange={setValueShowIn}
          />
        </div>
      </div>

      {/* Advance Filter Drawer (Collapsible) */}
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
                Recalculates rollup totals dynamically on applied criteria
              </span>
            </div>
            <AdvanceFilter useStore={useBsAdvanceFilterStore} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
