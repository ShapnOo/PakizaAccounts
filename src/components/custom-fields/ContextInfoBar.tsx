import React from 'react';
import { CustomFieldContext, CONTEXT_CONFIG } from '../../types/customField';
import { Info, Sparkles } from 'lucide-react';

interface ContextInfoBarProps {
  context: CustomFieldContext;
}

export const ContextInfoBar: React.FC<ContextInfoBarProps> = ({ context }) => {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-indigo-50/40 dark:bg-indigo-950/20 border-x border-b border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-300">
      <div className="flex items-center gap-2">
        <Info className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className="font-medium">
          {context === 'voucher-master' ? (
            <>
              Fields defined in this context will be added in{' '}
              <strong className="font-bold underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2">
                all types of journal & voucher entries in the master (header) part
              </strong>.
            </>
          ) : (
            <>
              Fields defined in this context will be added in{' '}
              <strong className="font-bold underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2">
                all types of vouchers as well as opening balance sheet line items
              </strong>.
            </>
          )}
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold shrink-0">
        <Sparkles className="size-3 text-indigo-500" />
        <span>{context === 'voucher-master' ? 'Master-Level Schema' : 'Details-Level Schema'}</span>
      </div>
    </div>
  );
};
