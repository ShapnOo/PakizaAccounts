import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Plus, Sparkles } from 'lucide-react';

interface ListHeaderProps {
  totalCount: number;
  activeCount: number;
}

export const ListHeader: React.FC<ListHeaderProps> = ({ totalCount, activeCount }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Repeat className="size-5 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-foreground">
              Recurring Journals
            </h1>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {totalCount} {totalCount === 1 ? 'Profile' : 'Profiles'}
            </span>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              {activeCount} Active
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground ml-11.5">
          Schedule automated voucher templates that execute on daily, weekly, monthly, quarterly, or annual cadences
        </p>
      </div>

      <div className="flex items-center gap-2.5 ml-11.5 sm:ml-0">
        <Link
          to="/recurring-journal/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/25 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New Recurring Profile</span>
        </Link>
      </div>
    </div>
  );
};
