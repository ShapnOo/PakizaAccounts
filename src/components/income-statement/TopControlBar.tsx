import React from 'react';
import {
  useIncomeStatementStore,
  useIsAdvanceFilterStore,
} from '../../stores/incomeStatementStore';
import { ReportTypeToggle } from './ReportTypeToggle';
import { CompareToSelect } from './CompareToSelect';
import { CurrencySelect } from './CurrencySelect';
import { DateRangeSelect } from './DateRangeSelect';
import { NoOfPeriodInput } from './NoOfPeriodInput';
import { DisplayedBySelect } from './DisplayedBySelect';
import { CompanyMultiSelect } from './CompanyMultiSelect';
import { CostCenterMultiSelect } from './CostCenterMultiSelect';
import { ShowInPercentToggle } from './ShowInPercentToggle';
import { ValueShowInSelect } from './ValueShowInSelect';
import { AdvanceFilterToggle } from './AdvanceFilterToggle';
import { HeaderExpandCollapseControls } from './HeaderExpandCollapseControls';
import { ExportMenu } from './ExportMenu';
import { AdvanceFilter } from '../gl/AdvanceFilter';
import { RotateCcw, Sliders } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const TopControlBar: React.FC = () => {
  const {
    filters,
    loading,
    fyExpanded,
    dataColumns,
    setReportType,
    setCompareTo,
    setDateRange,
    setNoOfPeriod,
    setDisplayedBy,
    setShowInPercent,
    setValueShowIn,
    setCurrency,
    setSelectedCompanies,
    setSelectedCostCenters,
    toggleAdvancedFilter,
    setFyExpanded,
    exportReport,
    resetFilters,
  } = useIncomeStatementStore();

  const advanceFilterState = useIsAdvanceFilterStore((s) => s.state);
  const activeFilterCount = advanceFilterState.conditions.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-4 transition-all overflow-hidden font-sans">
      {/* Top Header of Control Card */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
            <Sliders className="size-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Income Statement Parameters ({filters.reportType})
          </span>
          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Mode: <strong className="text-indigo-700 font-bold">{filters.compareTo}</strong> ({dataColumns.length} Data Columns + Total)
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.compareTo === 'Previous Period' && (
            <HeaderExpandCollapseControls
              expanded={fyExpanded}
              onExpand={() => setFyExpanded(true)}
              onCollapse={() => setFyExpanded(false)}
            />
          )}

          <AdvanceFilterToggle
            collapsed={filters.advancedFilterCollapsed}
            onToggle={toggleAdvancedFilter}
            activeCount={activeFilterCount}
          />

          <button
            type="button"
            onClick={resetFilters}
            title="Reset parameters to defaults"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <RotateCcw className="size-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <ExportMenu onExport={exportReport} loading={loading} />
        </div>
      </div>

      {/* Primary Evenly Distributed Grid of Controls */}
      <div className="p-4 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <ReportTypeToggle
            value={filters.reportType}
            onChange={setReportType}
          />

          <CompareToSelect
            value={filters.compareTo}
            onChange={setCompareTo}
          />

          <DateRangeSelect
            value={filters.dateRange}
            onChange={setDateRange}
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

        {/* Dynamic Mode-Specific Row (Properly Sized & Aligned) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4">
          {filters.compareTo === 'Previous Period' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 w-full">
              <NoOfPeriodInput
                value={filters.noOfPeriod}
                onChange={setNoOfPeriod}
                disabled={loading}
              />
              <DisplayedBySelect
                value={filters.displayedBy}
                onChange={setDisplayedBy}
                disabled={loading}
              />
              <div className="hidden md:flex items-center text-xs text-slate-500 italic pt-5">
                Generates {filters.noOfPeriod} Fiscal Years × {filters.displayedBy === 'Year' ? 1 : filters.displayedBy === 'Month' ? 12 : 4} periods
              </div>
            </div>
          )}

          {filters.compareTo === 'Company' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 w-full">
              <CompanyMultiSelect
                selected={filters.selectedCompanies}
                onChange={setSelectedCompanies}
              />
              <div className="flex items-center text-xs text-slate-500 italic pt-5">
                Selected {filters.selectedCompanies.length} companies appear as comparative columns
              </div>
            </div>
          )}

          {filters.compareTo === 'Cost Center' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 w-full">
              <CostCenterMultiSelect
                selected={filters.selectedCostCenters}
                onChange={setSelectedCostCenters}
              />
              <div className="flex items-center text-xs text-slate-500 italic pt-5">
                Selected {filters.selectedCostCenters.length} cost centers appear as comparative columns
              </div>
            </div>
          )}

          {filters.compareTo === 'Budget' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 w-full">
              <DisplayedBySelect
                value={filters.displayedBy}
                onChange={setDisplayedBy}
                disabled={loading}
              />
              <div className="flex items-center text-xs text-slate-500 italic pt-5">
                Compares Actual results vs Budget target with Variance calculation
              </div>
            </div>
          )}
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
                Advanced Criteria Filter (Account / Subsidiary / Cost Center / Reference)
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">
                Filters accounts and updates statement calculations
              </span>
            </div>
            <AdvanceFilter useStore={useIsAdvanceFilterStore} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

