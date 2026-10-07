import React, { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface SectionCardProps {
  sectionNo?: string;
  title: string;
  icon?: any;
  children: ReactNode;
  onApply?: () => void;
  isDirty?: boolean;
  applyLabel?: string;
  showApplyFooter?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  sectionNo,
  title,
  icon: Icon,
  children,
  onApply,
  isDirty = false,
  applyLabel = 'Apply Change',
  showApplyFooter = false,
}) => {
  return (
    <section className="bg-card border border-border/60 rounded-xl shadow-2xs overflow-visible transition-all duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/40 bg-muted/20 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="size-7 rounded-lg bg-primary/10 text-primary grid place-items-center shadow-2xs shrink-0">
              <Icon className="size-3.5" />
            </div>
          )}
          <div className="flex items-center gap-2">
            {sectionNo && (
              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                {sectionNo}
              </span>
            )}
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
              {title}
            </h2>
          </div>
        </div>

        {isDirty && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
            Unsaved Changes
          </span>
        )}
      </div>

      {/* Body: Form Rows */}
      <div className="p-2 sm:p-3 space-y-0.5">
        {children}
      </div>

      {/* Footer-Right: Single Unified Apply Change button */}
      {showApplyFooter && onApply && (
        <div className="px-4 py-2.5 bg-muted/15 border-t border-border/30 flex items-center justify-end">
          <button
            type="button"
            onClick={onApply}
            disabled={!isDirty}
            className={`inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer shadow-2xs ${
              isDirty
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-primary/20 ring-1 ring-primary/30'
                : 'bg-muted/50 text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
            }`}
          >
            <Check className="size-3.5 stroke-[2.5] shrink-0" />
            <span className="whitespace-nowrap">{applyLabel}</span>
          </button>
        </div>
      )}
    </section>
  );
};
