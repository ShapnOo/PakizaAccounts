import React from 'react';
import { SlidersHorizontal, Plus, Eye, Sparkles } from 'lucide-react';
import { CustomFieldContext, CONTEXT_CONFIG } from '../../types/customField';

interface BuilderHeaderProps {
  activeContext: CustomFieldContext;
  activeCount: number;
  totalCount: number;
  onOpenNew: () => void;
  onOpenPreview: () => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  activeContext,
  activeCount,
  totalCount,
  onOpenNew,
  onOpenPreview,
}) => {
  const contextLabel = CONTEXT_CONFIG[activeContext]?.label || activeContext;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-xs">
            <SlidersHorizontal className="size-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-foreground">
                Custom Fields
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {contextLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add extra fields to voucher entry screens and system modules (CF1–CF8).
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Preview Button */}
        <button
          type="button"
          onClick={onOpenPreview}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          title="Preview how these custom fields appear in the transaction entry form"
        >
          <Eye className="size-3.5 text-indigo-600" />
          <span>Live Preview</span>
        </button>

        {/* New Field Button */}
        <button
          type="button"
          onClick={onOpenNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="size-3.5 stroke-[2.5]" />
          <span>New Field</span>
        </button>
      </div>
    </div>
  );
};
