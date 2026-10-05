import React from 'react';
import { Tag } from 'lucide-react';

interface BankAliasDisplayProps {
  alias: string;
}

export const BankAliasDisplay: React.FC<BankAliasDisplayProps> = ({ alias }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <Tag className="size-3 text-indigo-600" />
          <span>Bank Alias</span>
        </label>
        <span className="text-[10px] text-muted-foreground font-mono">
          Auto-populated (Read-only)
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          readOnly
          disabled
          value={alias ? alias : '—'}
          className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono font-bold tracking-wider uppercase text-foreground/80 outline-none select-none shadow-2xs"
        />
        {alias && (
          <span className="absolute right-2.5 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[10.5px] border border-indigo-200 dark:border-indigo-800">
            {alias}
          </span>
        )}
      </div>
    </div>
  );
};
