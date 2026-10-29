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
import { RotateCcw } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs mb-4 transition-all">
      {/* Top Control Bar: Main Controls */}
      <div className="p-4 space-y-3">
        {/* ROW 1: As on | Compare With | Show In % | Value show In | Export */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3 flex-1">
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

            <ShowInPercentToggle
              value={filters.showInPercent}
              onChange={setShowInPercent}
            />

            <ValueShowInSelect
              value={filters.valueShowIn}
              onChange={setValueShowIn}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              title="Reset all filters to defaults"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="size-4" />
            </button>

            <ExportMenu onExport={exportReport} loading={loading} />
          </div>
        </div>

        {/* ROW 2: Advance Filter | Number of Years | Currency */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <AdvanceFilterToggle
              collapsed={filters.advancedFilterCollapsed}
              onToggle={toggleAdvanceFilter}
              activeCount={activeFilterCount}
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
          </div>

          <div className="text-[11px] text-slate-500 font-medium italic">
            Column count:{' '}
            <strong className="text-slate-800 font-bold font-mono">
              {filters.compareWith === 'None'
                ? 1
                : filters.compareWith === 'Budget' || filters.compareWith === 'Custom Period'
                ? 2
                : filters.numberOfYears + 1}
            </strong>{' '}
            (Current {filters.compareWith === 'Previous Years' ? `+ ${filters.numberOfYears} Prior Years` : ''})
          </div>
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
            className="border-t border-slate-200 bg-slate-50/50 p-4 overflow-hidden rounded-b-xl"
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

