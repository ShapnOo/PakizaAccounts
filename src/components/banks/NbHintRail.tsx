import React from 'react';
import { Info } from 'lucide-react';

interface NbHintProps {
  number: number;
  text: string;
  className?: string;
}

export const NbHint: React.FC<NbHintProps> = ({ number, text, className = '' }) => {
  return (
    <div
      className={`flex items-start gap-1.5 text-[11px] italic text-muted-foreground/90 bg-amber-500/5 border border-amber-500/15 rounded-md px-2.5 py-1.5 ${className}`}
    >
      <span className="font-bold text-amber-600 dark:text-amber-500 not-italic shrink-0">
        N.B. #{number}:
      </span>
      <span>{text}</span>
    </div>
  );
};

export const NbHintRail: React.FC = () => {
  return (
    <aside className="hidden xl:flex flex-col gap-6 w-64 pt-6 shrink-0">
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-border/80 rounded-xl p-4 space-y-3.5 sticky top-24 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Info className="size-3.5 text-indigo-500" />
          <span>Workbook Guidelines</span>
        </div>

        <div className="space-y-3 text-[11.5px] leading-relaxed text-muted-foreground italic">
          <div className="p-2.5 rounded-lg bg-background border border-border/60">
            <div className="font-bold not-italic text-amber-600 dark:text-amber-400 mb-0.5">
              1. Bank Name rule
            </div>
            "Bank name should come from Bank modal"
            <p className="mt-1 text-[10.5px] not-italic text-muted-foreground">
              Always select from the Bank master. Click <strong className="text-foreground">Add+</strong> to register new banks.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-background border border-border/60">
            <div className="font-bold not-italic text-amber-600 dark:text-amber-400 mb-0.5">
              2. Accounts Info rule
            </div>
            "Accounts Info. Should come from Chart of Accounts"
            <p className="mt-1 text-[10.5px] not-italic text-muted-foreground">
              Linked bank accounts are read-only snapshots mapped directly from COA heads.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
