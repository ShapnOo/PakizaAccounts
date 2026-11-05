import React from 'react';
import { Layers, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onAddLine: () => void;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddLine,
  onReset,
}) => {
  return (
    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-3">
      <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Layers className="size-5" />
      </div>
      <div>
        <h4 className="text-[14px] font-semibold text-slate-800">
          No Rows Defined
        </h4>
        <p className="text-[13px] text-slate-500 max-w-sm mt-0.5">
          There are no rows in this income statement report structure. Add custom lines or restore default settings.
        </p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={onAddLine}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium shadow-xs transition cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add Line (Text)</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-medium text-slate-700 shadow-2xs transition cursor-pointer"
        >
          <RotateCcw className="size-3.5 text-slate-400" />
          <span>Reset to Default</span>
        </button>
      </div>
    </div>
  );
};

