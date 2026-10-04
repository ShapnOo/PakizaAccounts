import React, { ReactNode } from 'react';
import { Info, Check } from 'lucide-react';

interface ConfigRowProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  showApply?: boolean;
  actionLabel?: string;
  onApply?: () => void;
  isDirty?: boolean;
  className?: string;
}

export const ConfigRow: React.FC<ConfigRowProps> = ({
  label,
  required,
  hint,
  children,
  showApply = false,
  actionLabel = 'Apply Change',
  onApply,
  isDirty = false,
  className = '',
}) => {
  return (
    <div
      className={`min-h-[44px] py-2 px-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between border-b border-border/30 last:border-0 hover:bg-muted/25 transition-colors gap-2 md:gap-4 ${className}`}
    >
      {/* 1. Label Column (Fixed width for tabular alignment) */}
      <div className="w-full md:w-56 shrink-0 flex items-center gap-1.5">
        <label className="text-[12px] font-bold text-foreground/85 select-none leading-tight">
          {label}
        </label>
        {required && (
          <span className="text-rose-500 font-black text-xs leading-none" title="Required field">
            *
          </span>
        )}
      </div>

      {/* 2. Control Area Column (Fixed width for aligned inputs) */}
      <div className="w-full md:w-72 shrink-0 flex items-center">
        {children}
      </div>

      {/* 3. N.B. Hint Column (Flexible, fills middle space) */}
      <div className="flex-1 min-w-0 flex items-center md:px-2">
        {hint ? (
          <div className="flex items-center gap-1.5 text-[10.5px] italic text-muted-foreground/75 leading-tight select-none">
            <Info className="size-3 shrink-0 text-muted-foreground/50 not-italic" />
            <span className="truncate" title={hint}>
              N.B. {hint}
            </span>
          </div>
        ) : (
          <div className="hidden md:block flex-1" />
        )}
      </div>

      {/* 4. Action Column (Only rendered if showApply is explicitly requested) */}
      {showApply && (
        <div className="w-full md:w-auto shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={onApply}
            disabled={!isDirty}
            className={`inline-flex items-center gap-1.5 h-7.5 px-3 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer shadow-2xs ${
              isDirty
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-primary/20 ring-1 ring-primary/30'
                : 'bg-muted/50 text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
            }`}
          >
            <Check className="size-3 stroke-[2.5] shrink-0" />
            <span className="whitespace-nowrap">{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
