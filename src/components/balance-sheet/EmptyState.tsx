import React from 'react';
import { FileSpreadsheet, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
        <FileSpreadsheet className="size-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800">No Balance Sheet Records Found</h3>
      <p className="text-xs text-slate-500 max-w-md">
        No accounts match the current filters or date range. Try clearing advanced filter
        conditions or adjusting the comparative period.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
      >
        <RotateCcw className="size-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};

