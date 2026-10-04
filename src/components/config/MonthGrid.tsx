import React from 'react';
import { Calendar, Lock, Unlock, Check, Minus } from 'lucide-react';

interface MonthGridProps {
  fiscalYear: string;
  months: Record<string, boolean>;
  onChange: (months: Record<string, boolean>) => void;
}

const ROW_1 = ['Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May'];
const ROW_2 = ['Aug', 'Oct', 'Dec', 'Feb', 'Apr', 'Jun'];
const ALL_MONTHS = [...ROW_1, ...ROW_2];

export const MonthGrid: React.FC<MonthGridProps> = ({
  fiscalYear,
  months,
  onChange,
}) => {
  const selectedCount = ALL_MONTHS.filter((m) => months[m]).length;
  const isAllSelected = selectedCount === ALL_MONTHS.length;
  const isSomeSelected = selectedCount > 0 && !isAllSelected;

  const handleToggleAll = () => {
    const nextVal = !isAllSelected;
    const updated: Record<string, boolean> = {};
    ALL_MONTHS.forEach((m) => {
      updated[m] = nextVal;
    });
    onChange(updated);
  };

  const handleToggleMonth = (m: string) => {
    onChange({
      ...months,
      [m]: !months[m],
    });
  };

  return (
    <div className="w-full space-y-2 py-1 select-none">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="size-3.5 text-primary shrink-0" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase">Fiscal Year:</span>
          <span className="text-[11px] font-black font-mono text-foreground px-2 py-0.5 rounded bg-card border border-border/60 shadow-2xs">
            {fiscalYear}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="inline-block size-2 rounded-full bg-primary" />
            <span>
              <strong className="text-foreground">{selectedCount}</strong> of 12 Months Locked
            </span>
          </div>

          {/* Tri-state All Checkbox Chip */}
          <button
            type="button"
            onClick={handleToggleAll}
            className={`inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
              isAllSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                : isSomeSelected
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            <div className="size-3 rounded border grid place-items-center bg-card/20 border-current">
              {isAllSelected && <Check className="size-2 stroke-[3]" />}
              {isSomeSelected && <Minus className="size-2 stroke-[3]" />}
            </div>
            <span>All</span>
          </button>
        </div>
      </div>

      {/* 2 Rows × 6 Columns Checkbox Grid */}
      <div className="space-y-1.5">
        {/* Row 1: Jul Sep Nov Jan Mar May */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {ROW_1.map((month) => {
            const isLocked = !!months[month];
            return (
              <button
                key={month}
                type="button"
                onClick={() => handleToggleMonth(month)}
                className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all duration-150 border flex items-center justify-between cursor-pointer ${
                  isLocked
                    ? 'bg-primary/10 border-primary/40 text-primary shadow-2xs ring-1 ring-primary/20'
                    : 'bg-card border-border/70 text-foreground/75 hover:bg-muted/40 hover:border-border'
                }`}
              >
                <span>{month}</span>
                {isLocked ? (
                  <Lock className="size-3 text-primary stroke-[2.5]" />
                ) : (
                  <Unlock className="size-3 text-muted-foreground/40" />
                )}
              </button>
            );
          })}
        </div>

        {/* Row 2: Aug Oct Dec Feb Apr Jun */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {ROW_2.map((month) => {
            const isLocked = !!months[month];
            return (
              <button
                key={month}
                type="button"
                onClick={() => handleToggleMonth(month)}
                className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all duration-150 border flex items-center justify-between cursor-pointer ${
                  isLocked
                    ? 'bg-primary/10 border-primary/40 text-primary shadow-2xs ring-1 ring-primary/20'
                    : 'bg-card border-border/70 text-foreground/75 hover:bg-muted/40 hover:border-border'
                }`}
              >
                <span>{month}</span>
                {isLocked ? (
                  <Lock className="size-3 text-primary stroke-[2.5]" />
                ) : (
                  <Unlock className="size-3 text-muted-foreground/40" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
