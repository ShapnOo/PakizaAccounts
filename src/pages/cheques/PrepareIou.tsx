import React from 'react';
import { ChequeTabs } from '../../components/cheques/ChequeTabs';
import { ChequePrepareForm } from '../../components/cheques/ChequePrepareForm';
import { FileText } from 'lucide-react';

export const PrepareIouPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      <ChequeTabs />

      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="size-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 flex items-center justify-center border border-violet-100 dark:border-violet-900 shadow-2xs">
          <FileText className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Cheque Prepare
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
              IOU Payment
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Disburse employee advance and expense requisitions with tracked balances
          </p>
        </div>
      </div>

      <ChequePrepareForm sourceType="iou" />
    </div>
  );
};
