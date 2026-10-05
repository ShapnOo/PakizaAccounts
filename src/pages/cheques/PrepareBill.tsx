import React from 'react';
import { ChequeTabs } from '../../components/cheques/ChequeTabs';
import { ChequePrepareForm } from '../../components/cheques/ChequePrepareForm';
import { Receipt } from 'lucide-react';

export const PrepareBillPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      <ChequeTabs />

      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="size-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900 shadow-2xs">
          <Receipt className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Cheque Prepare
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Bill Payment
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Settle supplier purchase bills with auto-calculated balance and cheque amount locking
          </p>
        </div>
      </div>

      <ChequePrepareForm sourceType="bill" />
    </div>
  );
};
