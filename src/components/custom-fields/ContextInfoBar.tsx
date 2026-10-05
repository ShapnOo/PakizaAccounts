import React from 'react';
import { CustomFieldContext, CONTEXT_CONFIG } from '../../types/customField';
import { Info, Sparkles } from 'lucide-react';

interface ContextInfoBarProps {
  context: CustomFieldContext;
}

export const ContextInfoBar: React.FC<ContextInfoBarProps> = ({ context }) => {
  const config = CONTEXT_CONFIG[context];

  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-indigo-50/40 dark:bg-indigo-950/20 border-x border-b border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-900 dark:text-indigo-300">
      <div className="flex items-center gap-2">
        <Info className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className="font-medium">
          Fields defined in this context appear as dynamic extra columns in the{' '}
          <strong className="font-bold underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2">
            {config.label}
          </strong>{' '}
          entry form.
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold shrink-0">
        <Sparkles className="size-3 text-indigo-500" />
        <span>Context-bound Schema (CF1)</span>
      </div>
    </div>
  );
};
