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
        No Statement Data Found
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4">
        No movement or equity data matched your selected period. Try changing the date range.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
      >
        <RotateCcw className="size-3.5" />
        <span>Reset to Default Period</span>
      </button>
    </div>
  );
};

