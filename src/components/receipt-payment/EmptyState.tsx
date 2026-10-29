import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs font-sans">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">
        No Transactions Found
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4">
        No receipt or payment transactions matched your selected filters. Try broadening the date range or resetting filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
      >
        <RotateCcw className="size-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};

