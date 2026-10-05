import React from 'react';
import { Plus, SearchX, Layers } from 'lucide-react';
import { SubledgerType, SUBLEDGER_CONFIG } from '../../types/subledger';

interface EmptyStateProps {
  type: SubledgerType;
  isFiltered: boolean;
  onClearFilters: () => void;
  onAddNew: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  isFiltered,
  onClearFilters,
  onAddNew,
}) => {
  const config = SUBLEDGER_CONFIG[type];
  const singular = config?.singular || 'Record';

  if (isFiltered) {
    return (
      <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
        <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <SearchX className="size-6" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-bold text-slate-800">
            No matching {config?.label.toLowerCase() || 'records'} found
          </h3>
          <p className="text-xs text-slate-500">
            No results match your search query or company filters. Try adjusting or clearing your active filters.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
      <div className="size-14 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
        <Layers className="size-7" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-slate-800">
          No {config?.label.toLowerCase()} yet
        </h3>
        <p className="text-xs text-slate-500">
          Get started by defining your organization&apos;s first {singular.toLowerCase()} to enable tracking across vouchers and balances.
        </p>
      </div>
      <button
        type="button"
        onClick={onAddNew}
        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-sm transition-all cursor-pointer"
      >
        <Plus className="size-3.5" />
        <span>Add your first {singular}</span>
      </button>
    </div>
  );
};
