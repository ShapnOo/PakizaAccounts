import React, { ReactNode } from 'react';
import { Check } from 'lucide-react';

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
  controlClassName?: string;
  labelClassName?: string;
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
  controlClassName = '',
  labelClassName = '',
}) => {
  return (
    <div
      className={`min-h-[50px] py-2.5 px-3 sm:px-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between border-b border-border/25 last:border-0 hover:bg-muted/20 transition-colors gap-2.5 md:gap-6 ${className}`}
    >
      {/* 1. Label Column (Fixed width for strict tabular vertical alignment) */}
      <div className={`w-full ${labelClassName || 'md:w-64 lg:w-72'} shrink-0 flex items-center gap-1.5`}>
        <label
          className="text-[12.5px] font-bold text-foreground/90 select-none leading-snug"
          title={hint}
        >
          {label}
        </label>
        {required && (
          <span className="text-rose-500 font-black text-xs leading-none" title="Required field">
            *
          </span>
        )}
      </div>

      {/* 2. Control Area Column (Starts at exact same vertical line across all rows) */}
      <div className={`w-full flex-1 min-w-0 flex items-center justify-start gap-3 ${controlClassName}`}>
        {children}

        {/* 3. Action Column (Only rendered if showApply is explicitly requested) */}
        {showApply && (
          <div className="shrink-0 flex items-center ml-auto">
            <button
              type="button"
              onClick={onApply}
              disabled={!isDirty}
              className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer shadow-2xs ${
                isDirty
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-primary/20 ring-1 ring-primary/30'
                  : 'bg-muted/50 text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
              }`}
            >
              <Check className="size-3.5 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">{actionLabel}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
