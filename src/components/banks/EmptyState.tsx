import React from 'react';
import { Building2, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-slate-50/40 dark:bg-slate-900/10">
      <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground mb-3">
        <Building2 className="size-6 text-muted-foreground/80" />
      </div>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
