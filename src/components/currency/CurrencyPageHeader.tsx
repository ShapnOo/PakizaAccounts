import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Plus, ChevronRight } from 'lucide-react';
import { CurrencyTabs } from './CurrencyTabs';

interface CurrencyPageHeaderProps {
  showNewButton?: boolean;
}

export const CurrencyPageHeader: React.FC<CurrencyPageHeaderProps> = ({ showNewButton = true }) => {
  return (
    <div className="space-y-3 pb-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
        <span>Home</span>
        <ChevronRight className="size-3 text-muted-foreground/40" />
        <span>Accounts Configuration</span>
        <ChevronRight className="size-3 text-muted-foreground/40" />
        <span className="text-primary font-black">Currency Setup</span>
      </div>

      {/* Main Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-indigo-50 border border-indigo-200/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-2xs">
            <Coins className="size-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <span>Currency Setup</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Manage configured currencies, base currency rules, and daily exchange rates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <CurrencyTabs />

          {showNewButton && (
            <Link
              to="/currency-setup/new"
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>+ New Currency</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
