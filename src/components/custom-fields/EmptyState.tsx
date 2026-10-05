import React from 'react';
import { CustomFieldContext, CONTEXT_CONFIG } from '../../types/customField';
import { SlidersHorizontal, Plus } from 'lucide-react';

interface EmptyStateProps {
  context: CustomFieldContext;
  onAddField: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  context,
  onAddField,
  isFiltered = false,
  onClearFilters,
}) => {
  const config = CONTEXT_CONFIG[context];

  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
      <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-xs">
        <SlidersHorizontal className="size-6" />
      </div>

      <div className="max-w-sm space-y-1">
        <h3 className="text-sm font-bold text-foreground">
          {isFiltered
            ? 'No matching custom fields found'
            : `No custom fields for ${config.label}`}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isFiltered
            ? 'Try adjusting your search keywords or filter criteria to see fields.'
            : `Create your first custom field to extend ${config.label} line items with specialized tracking data.`}
        </p>
      </div>

      <div className="pt-2">
        {isFiltered ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddField}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Your First Field</span>
          </button>
        )}
      </div>
    </div>
  );
};
