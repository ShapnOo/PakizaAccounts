import React from 'react';
import { Check, X } from 'lucide-react';

interface ActivePillProps {
  active: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

export const ActivePill: React.FC<ActivePillProps> = ({
  active,
  onClick,
  interactive = true,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all select-none whitespace-nowrap ${
        active
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
      } ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          active ? 'bg-emerald-500 shadow-[0_0_6px_var(--emerald-500)]' : 'bg-muted-foreground/60'
        }`}
      />
      <span>{active ? 'Active' : 'Inactive'}</span>
    </button>
  );
};
