import React from 'react';
import { Calendar, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { FiscalYear } from '../../types/financialPeriod';

interface KpiProps {
  currentFy: FiscalYear;
  onSetActive: (code: string) => void;
}

export const FinancialPeriodKpiCards: React.FC<KpiProps> = ({ currentFy, onSetActive }) => {
  const total = currentFy.periods.length;
  const lockedCount = currentFy.periods.filter((p) => p.status === 'Locked').length;
  const softClosedCount = currentFy.periods.filter((p) => p.status === 'Soft-Closed').length;
  const openCount = currentFy.periods.filter((p) => p.status === 'Open').length;
  const futureCount = currentFy.periods.filter((p) => p.status === 'Future').length;

  const activePeriod = currentFy.periods.find((p) => p.status === 'Open') || currentFy.periods[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Fiscal Year */}
      <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Fiscal Year
          </span>
          {currentFy.isActive ? (
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active System FY
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onSetActive(currentFy.code)}
              className="text-[10.5px] font-bold text-primary hover:underline cursor-pointer transition-all"
            >
              Set as Active
            </button>
          )}
        </div>

        <div className="mt-2.5">
          <div className="text-lg font-black text-foreground font-mono flex items-center gap-2">
            <Calendar className="size-4 text-primary shrink-0" />
            <span>FY {currentFy.code}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ml-auto ${
                currentFy.isClosed
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
              }`}
            >
              {currentFy.isClosed ? 'Closed' : 'Open'}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {currentFy.startDate} – {currentFy.endDate}
          </div>
        </div>
      </div>

      {/* 2. Active Period */}
      <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Current Active Period
          </span>
          {activePeriod && (
            <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {activePeriod.quarter}
            </span>
          )}
        </div>

        <div className="mt-2.5">
          <div className="text-lg font-black text-foreground flex items-center justify-between">
            <span>{activePeriod ? activePeriod.periodName : 'No Open Period'}</span>
            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border">
              {activePeriod?.periodCode}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
            <span>Posting open & active</span>
          </div>
        </div>
      </div>

      {/* 3. Period Lock Status */}
      <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Period Lock Status
          </span>
          <span className="text-[11px] font-mono font-bold text-muted-foreground">
            {lockedCount}/{total} Locked
          </span>
        </div>

        <div className="mt-2.5">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              <span className="font-bold text-foreground">{lockedCount}</span>
              <span className="text-muted-foreground text-[11px]">Locked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-foreground">{openCount}</span>
              <span className="text-muted-foreground text-[11px]">Open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-400" />
              <span className="font-bold text-foreground">{futureCount}</span>
              <span className="text-muted-foreground text-[11px]">Future</span>
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden flex mt-2.5">
            <div
              className="bg-rose-500 h-full"
              style={{ width: `${(lockedCount / total) * 100}%` }}
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(softClosedCount / total) * 100}%` }}
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(openCount / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Retained Earnings / Equity */}
      <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Year-End Closing Account
          </span>
          <span className="text-[10px] font-bold text-muted-foreground">Equity</span>
        </div>

        <div className="mt-2.5">
          <div className="text-sm font-bold text-foreground truncate" title={currentFy.retainedEarningsAccountName}>
            {currentFy.retainedEarningsAccountName || 'Retained Earnings / Surplus'}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground mt-1 flex items-center justify-between">
            <span>Code: {currentFy.retainedEarningsAccount || '3101-001'}</span>
            <span className="text-[10.5px] text-emerald-600 font-semibold">Configured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
