import React from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  FinancialPeriod,
  PeriodStatus,
  ModuleLockState,
} from '../../types/financialPeriod';

interface TableProps {
  periods: FinancialPeriod[];
  onToggleModuleLock: (periodId: string, moduleKey: keyof ModuleLockState) => void;
  onSetStatus: (periodId: string, status: PeriodStatus) => void;
  onQuickLock: (periodId: string) => void;
  onQuickUnlock: (periodId: string) => void;
  isYearClosed: boolean;
}

export const FinancialPeriodTable: React.FC<TableProps> = ({
  periods,
  onToggleModuleLock,
  onSetStatus,
  onQuickLock,
  onQuickUnlock,
  isYearClosed,
}) => {
  const getStatusBadge = (status: PeriodStatus) => {
    switch (status) {
      case 'Locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/80 whitespace-nowrap">
            <Lock className="size-3 text-rose-600 shrink-0" />
            <span>Hard Locked</span>
          </span>
        );
      case 'Soft-Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 whitespace-nowrap">
            <AlertCircle className="size-3 text-amber-600 shrink-0" />
            <span>Soft Closed</span>
          </span>
        );
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 whitespace-nowrap">
            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
            <span>Open for Postings</span>
          </span>
        );
      case 'Future':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 whitespace-nowrap">
            <Clock className="size-3 text-slate-500 shrink-0" />
            <span>Future Period</span>
          </span>
        );
    }
  };

  const renderModuleToggle = (
    period: FinancialPeriod,
    moduleKey: keyof ModuleLockState,
    label: string
  ) => {
    const isLocked = period.moduleLocks[moduleKey];
    return (
      <button
        type="button"
        disabled={isYearClosed}
        onClick={() => onToggleModuleLock(period.id, moduleKey)}
        title={`${label}: ${isLocked ? 'Locked (Click to unlock)' : 'Open (Click to lock)'}`}
        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 whitespace-nowrap shrink-0 ${
          isLocked
            ? 'bg-rose-50 text-rose-700 border-rose-300/80 dark:bg-rose-950/40 dark:text-rose-300 shadow-2xs'
            : 'bg-emerald-50/70 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300'
        } ${isYearClosed ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {isLocked ? <Lock className="size-2.5 text-rose-600" /> : <Unlock className="size-2.5 text-emerald-600" />}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
      {/* Table Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/70 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Monthly Accounting Periods Calendar
          </span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-card border border-border">
            12 Periods
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[11.5px]">Open (Posting Allowed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            <span className="text-[11.5px]">Soft-Closed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" />
            <span className="text-[11.5px]">Hard Locked</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-muted-foreground font-bold">
              <th className="py-2.5 px-4 w-24 text-center whitespace-nowrap">Period</th>
              <th className="py-2.5 px-4 whitespace-nowrap">Period Name & Quarter</th>
              <th className="py-2.5 px-4 whitespace-nowrap">Date Range</th>
              <th className="py-2.5 px-4 text-center whitespace-nowrap">
                Module-Level Posting Controls
              </th>
              <th className="py-2.5 px-4 text-center whitespace-nowrap">Period Status</th>
              <th className="py-2.5 px-4 text-center whitespace-nowrap">Vouchers</th>
              <th className="py-2.5 px-4 whitespace-nowrap">Audit & Last Lock</th>
              <th className="py-2.5 px-4 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-medium">
            {periods.map((p) => {
              const isLocked = p.status === 'Locked';
              const isOpen = p.status === 'Open';

              return (
                <tr
                  key={p.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    isOpen ? 'bg-primary/5 font-semibold' : ''
                  }`}
                >
                  {/* Period Code - FIXED: 1 line with whitespace-nowrap, never breaks */}
                  <td className="py-3 px-4 text-center whitespace-nowrap w-24 shrink-0">
                    <span className="inline-block whitespace-nowrap font-mono font-bold px-2.5 py-1 rounded bg-muted/60 text-foreground border border-border/80 text-xs">
                      {p.periodCode}
                    </span>
                  </td>

                  {/* Period Name & Quarter */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm whitespace-nowrap">
                        {p.periodName}
                      </span>
                      <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 whitespace-nowrap">
                        {p.quarter}
                      </span>
                      {isOpen && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 whitespace-nowrap">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                      Financial Month {p.periodNumber} of 12
                    </div>
                  </td>

                  {/* Date Range - Clean 1 line */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                      {p.startDate} <span className="text-muted-foreground font-normal">to</span> {p.endDate}
                    </div>
                  </td>

                  {/* Module Locks */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      {renderModuleToggle(p, 'gl', 'GL')}
                      {renderModuleToggle(p, 'ap', 'AP')}
                      {renderModuleToggle(p, 'ar', 'AR')}
                      {renderModuleToggle(p, 'banking', 'Bank')}
                      {renderModuleToggle(p, 'inventory', 'Inv')}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 whitespace-nowrap">
                      {getStatusBadge(p.status)}
                    </div>
                  </td>

                  {/* Voucher Count */}
                  <td className="py-3 px-4 text-center font-mono font-semibold text-foreground whitespace-nowrap">
                    {p.voucherCount ? p.voucherCount.toLocaleString() : '—'}
                  </td>

                  {/* Audit / Last Lock Info */}
                  <td className="py-3 px-4 text-[11px] text-muted-foreground whitespace-nowrap">
                    {p.lockedAt ? (
                      <div className="whitespace-nowrap">
                        <div className="font-mono text-foreground font-semibold">{p.lockedAt}</div>
                        <div className="text-[10px] text-muted-foreground">by {p.lockedBy || 'Finance Dept'}</div>
                      </div>
                    ) : (
                      <span className="italic text-muted-foreground/70">Unlocked</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                      {isLocked ? (
                        <button
                          type="button"
                          disabled={isYearClosed}
                          onClick={() => onQuickUnlock(p.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-card border border-border text-foreground hover:bg-muted hover:text-primary transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                            isYearClosed ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Unlock className="size-3 text-emerald-600 shrink-0" />
                          <span>Unlock</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isYearClosed}
                          onClick={() => onQuickLock(p.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-card border border-border text-foreground hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                            isYearClosed ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Lock className="size-3 text-rose-600 shrink-0" />
                          <span>Lock Month</span>
                        </button>
                      )}

                      {/* Status Selector Dropdown */}
                      <select
                        aria-label={`Change status for ${p.periodName}`}
                        disabled={isYearClosed}
                        value={p.status}
                        onChange={(e) => onSetStatus(p.id, e.target.value as PeriodStatus)}
                        className={`text-[11px] font-bold bg-card border border-border rounded-md px-2 py-1 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer whitespace-nowrap ${
                          isYearClosed ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="Soft-Closed">Soft-Closed</option>
                        <option value="Locked">Locked</option>
                        <option value="Future">Future</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
