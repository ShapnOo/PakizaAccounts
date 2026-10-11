import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Lock,
  Unlock,
  Building2,
  RotateCcw,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useFinancialPeriodStore } from '../../stores/financialPeriodStore';
import { FinancialPeriodKpiCards } from '../../components/financial-period/FinancialPeriodKpiCards';
import { FinancialPeriodTable } from '../../components/financial-period/FinancialPeriodTable';
import { NewFiscalYearModal } from '../../components/financial-period/NewFiscalYearModal';
import { YearEndClosingModal } from '../../components/financial-period/YearEndClosingModal';
import { COMPANY_LIST } from '../../hooks/useConfigState';
import { PeriodStatus } from '../../types/financialPeriod';

export const FinancialPeriodSetupPage: React.FC = () => {
  const {
    fiscalYears,
    selectedFyCode,
    selectedCompany,
    setSelectedFyCode,
    setSelectedCompany,
    setActiveFiscalYear,
    togglePeriodModuleLock,
    setPeriodStatus,
    quickLockPeriod,
    quickUnlockPeriod,
    batchLockAllPeriods,
    batchUnlockAllPeriods,
    createFiscalYear,
    closeFiscalYear,
    reopenFiscalYear,
    resetDefaults,
  } = useFinancialPeriodStore();

  const [quarterFilter, setQuarterFilter] = useState<'All' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | PeriodStatus>('All');
  const [isNewFyModalOpen, setIsNewFyModalOpen] = useState(false);
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);

  // Active or selected fiscal year
  const currentFy = useMemo(() => {
    return fiscalYears.find((fy) => fy.code === selectedFyCode) || fiscalYears[0];
  }, [fiscalYears, selectedFyCode]);

  // Filtered periods
  const filteredPeriods = useMemo(() => {
    if (!currentFy) return [];
    return currentFy.periods.filter((p) => {
      if (quarterFilter !== 'All' && p.quarter !== quarterFilter) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      return true;
    });
  }, [currentFy, quarterFilter, statusFilter]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 md:py-6 space-y-4 pb-20">
      {/* ── Breadcrumb & Clean Header ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
          <span>Home</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span>Accounts Configuration</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-primary font-black">Financial Period Setup</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <CalendarDays className="size-5.5 text-primary" />
              <span>Financial Period Setup</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Define accounting calendars, 12 monthly periods, subledger posting locks, and year-end closing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              title="Reset default periods configuration"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            {currentFy.isClosed ? (
              <button
                type="button"
                onClick={() => reopenFiscalYear(currentFy.code)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
              >
                <Unlock className="size-3.5" />
                <span>Reopen Fiscal Year</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsClosingModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-foreground text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Lock className="size-3.5 text-rose-600" />
                <span>Year-End Closing</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsNewFyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>+ New Fiscal Year</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Clean KPI Metrics Strip ── */}
      {currentFy && (
        <FinancialPeriodKpiCards
          currentFy={currentFy}
          onSetActive={setActiveFiscalYear}
        />
      )}

      {/* ── Streamlined Toolbar (Single-card unified controls) ── */}
      <div className="rounded-xl border border-border bg-card p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Side: Fiscal Year Tabs & Company Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Fiscal Year Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {fiscalYears.map((fy) => {
              const isSelected = fy.code === selectedFyCode;
              return (
                <button
                  key={fy.id}
                  type="button"
                  onClick={() => setSelectedFyCode(fy.code)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                      : 'bg-muted/30 text-muted-foreground border-border/70 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Calendar className="size-3" />
                  <span>FY {fy.code}</span>
                  {fy.isActive && (
                    <span className="size-1.5 rounded-full bg-emerald-400" title="Active Year" />
                  )}
                  {fy.isClosed && (
                    <span title="Year Closed">
                      <Lock className="size-2.5 text-rose-300" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* Company Scope */}
          <div className="flex items-center gap-1.5">
            <Building2 className="size-3.5 text-muted-foreground shrink-0" />
            <select
              aria-label="Filter company scope"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="text-xs font-semibold bg-muted/40 border border-border rounded-lg px-2 py-1 text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Companies</option>
              {COMPANY_LIST.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Quarter Tabs & Bulk Locks */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quarter Filter Chips */}
          <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/70">
            {(['All', 'Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuarterFilter(q)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  quarterFilter === q
                    ? 'bg-card text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* Bulk Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentFy.isClosed}
              onClick={() => batchLockAllPeriods(currentFy.code)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-muted/50 text-rose-700 dark:text-rose-400 border border-border hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 transition-all cursor-pointer whitespace-nowrap ${
                currentFy.isClosed ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Lock className="size-2.5 text-rose-600" />
              <span>Lock All</span>
            </button>
            <button
              type="button"
              disabled={currentFy.isClosed}
              onClick={() => batchUnlockAllPeriods(currentFy.code)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-muted/50 text-emerald-700 dark:text-emerald-400 border border-border hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 transition-all cursor-pointer whitespace-nowrap ${
                currentFy.isClosed ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Unlock className="size-2.5 text-emerald-600" />
              <span>Unlock All</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Financial Period Table ── */}
      {currentFy && (
        <FinancialPeriodTable
          periods={filteredPeriods}
          onToggleModuleLock={(periodId, moduleKey) =>
            togglePeriodModuleLock(currentFy.code, periodId, moduleKey)
          }
          onSetStatus={(periodId, status) =>
            setPeriodStatus(currentFy.code, periodId, status)
          }
          onQuickLock={(periodId) => quickLockPeriod(currentFy.code, periodId)}
          onQuickUnlock={(periodId) => quickUnlockPeriod(currentFy.code, periodId)}
          isYearClosed={currentFy.isClosed}
        />
      )}

      {/* ── Modals ── */}
      <NewFiscalYearModal
        isOpen={isNewFyModalOpen}
        onClose={() => setIsNewFyModalOpen(false)}
        onCreate={createFiscalYear}
      />

      {currentFy && (
        <YearEndClosingModal
          isOpen={isClosingModalOpen}
          onClose={() => setIsClosingModalOpen(false)}
          fiscalYear={currentFy}
          onConfirmClose={closeFiscalYear}
        />
      )}
    </div>
  );
};

export default FinancialPeriodSetupPage;
