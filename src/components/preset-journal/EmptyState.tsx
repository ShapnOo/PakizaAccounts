import { Link } from 'react-router-dom';
import { Bookmark, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card shadow-xs space-y-4">
      <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <Bookmark className="size-7" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-foreground">
          {hasFilters ? 'No Matching Presets Found' : 'No Presets Yet'}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasFilters
            ? 'No preset voucher templates match your current category tab or search query.'
            : 'Presets speed up repeated voucher entries. Create saved double-entry templates for rapid workflow.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2.5 pt-2">
        {hasFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        )}

        <Link
          to="/preset-journal/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Create Your First Preset</span>
        </Link>
      </div>
    </div>
  );
}
