import React from 'react';
import { ChequeTabs } from '../../components/cheques/ChequeTabs';
import { ChequePrepareForm } from '../../components/cheques/ChequePrepareForm';
import { Banknote } from 'lucide-react';

export const PrepareDirectPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      <ChequeTabs />

      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="size-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900 shadow-2xs">
          <Banknote className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Cheque Prepare
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              Direct Payment
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Issue and prepare a bank cheque leaf directly without prior purchase bill or requisition
          </p>
        </div>
      </div>

      <ChequePrepareForm sourceType="direct" />
    </div>
  );
};
