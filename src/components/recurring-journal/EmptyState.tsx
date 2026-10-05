import React from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionTo?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No recurring profiles found',
  description = 'Create schedule-based voucher templates that auto-repeat on a daily, weekly, monthly, or annual cadence.',
  actionText = 'New Recurring Profile',
  actionTo = '/recurring-journal/new',
}) => {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 space-y-4">
      <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Repeat className="size-6 stroke-[2.2]" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-black text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};
