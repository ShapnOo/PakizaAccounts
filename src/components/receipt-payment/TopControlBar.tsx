import React from 'react';
import {
  useReceiptPaymentStore,
  useRpAdvanceFilterStore,
} from '../../stores/receiptPaymentStore';
import { ReportTypeToggle } from './ReportTypeToggle';
import { AccountsTypeSelect } from './AccountsTypeSelect';
import { ApprovalStatusSelect } from './ApprovalStatusSelect';
import { CurrencySelect } from './CurrencySelect';
import { DateRangeSelect } from './DateRangeSelect';
import { AccountsDetailsTypeMultiSelect } from './AccountsDetailsTypeMultiSelect';
import { ValueShowInSelect } from './ValueShowInSelect';
import { AccountsHeadPicker } from './AccountsHeadPicker';
import { AdvanceFilterToggle } from './AdvanceFilterToggle';
import { ExportMenu } from './ExportMenu';
import { AdvanceFilter } from '../gl/AdvanceFilter';
import { RotateCcw, Sliders } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const TopControlBar: React.FC = () => {
  const {
    filters,
    loading,
    setReportType,
    setAccountsType,
    setApprovalStatus,
    setCurrency,
    setDateRangePreset,
    setDateRange,
    setAccountsDetailsTypes,
    setValueShowIn,
    setAccountsHead,
    toggleAdvancedFilter,
    resetFilters,
    exportReport,
  } = useReceiptPaymentStore();

  const advanceFilterState = useRpAdvanceFilterStore((s) => s.state);
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
              Statement Parameters & Filters
            </span>
            <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
              Adjust filters to recalculate receipts, payments, and closing balances
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
            onClick={resetFilters}
            title="Reset parameters to defaults"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <RotateCcw className="size-3 text-slate-400" />
            <span>Reset</span>
          </button>

          <ExportMenu onExport={exportReport} disabled={loading} />
        </div>
      </div>

      {/* Primary Filter Grid - Row 1 & Row 2 evenly distributed */}
      <div className="p-4 space-y-4">
        {/* Row 1: Report Type, Accounts Type, Approval Status, Currency, Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          <ReportTypeToggle
            value={filters.reportType}
            onChange={setReportType}
            disabled={loading}
          />

          <AccountsTypeSelect
            value={filters.accountsType}
            onChange={setAccountsType}
            disabled={loading}
          />

          <ApprovalStatusSelect
            value={filters.approvalStatus}
            onChange={setApprovalStatus}
            disabled={loading}
          />

          <CurrencySelect
            value={filters.currency}
            onChange={setCurrency}
            disabled={loading}
          />

          <DateRangeSelect
            preset={filters.dateRangePreset}
            startDate={filters.startDate}
            endDate={filters.endDate}
            onPresetChange={setDateRangePreset}
            onDateChange={setDateRange}
            disabled={loading}
          />
        </div>

        {/* Row 2: Accounts Details Type, Value Show In, Accounts Head Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pt-2 border-t border-slate-100">
          <AccountsDetailsTypeMultiSelect
            selected={filters.accountsDetailsTypes}
            onChange={setAccountsDetailsTypes}
            disabled={loading}
          />

          <ValueShowInSelect
            value={filters.valueShowIn}
            onChange={setValueShowIn}
            disabled={loading}
          />

          <AccountsHeadPicker
            value={filters.accountsHead}
            onChange={setAccountsHead}
            disabled={loading}
          />
        </div>
      </div>

      {/* Collapsible Advance Criteria Filter Drawer (Default Collapsed!) */}
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
                Advanced Criteria Filter (Account / Subsidiary / Reference)
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">
                Filters opposite accounts and ledger vouchers
              </span>
            </div>
            <AdvanceFilter useStore={useRpAdvanceFilterStore} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
