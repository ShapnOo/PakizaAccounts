import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Plus } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="py-14 text-center space-y-3">
      <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center mx-auto border border-indigo-200/50 shadow-sm">
        <Coins className="size-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground">No Currencies Configured</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          Add your organization's base currency and foreign trading currencies.
        </p>
      </div>
      <Link
        to="/currency-setup/new"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
      >
        <Plus className="size-3.5" />
        <span>Add Your First Currency</span>
      </Link>
    </div>
  );
};
