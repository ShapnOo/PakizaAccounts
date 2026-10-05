import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const HINTS = [
  { num: 1, text: 'Accounts field should come from bank accounts setup' },
  { num: 2, text: 'Bank name should be populate by accounts automatically' },
  { num: 3, text: 'GL name should come from chart of accounts' },
  { num: 4, text: 'When enforce by serial is yes then cheque must be used in serial' },
  { num: 5, text: 'Footer is a text field for signature caption' },
  { num: 6, text: 'Book name should be text field' },
  { num: 7, text: 'First cheque no. should be text field' },
  { num: 8, text: 'Number of cheque will be number field' },
  { num: 9, text: 'After clicking add button cheque details will be populate automatically as per number of cheque' },
  { num: 10, text: 'Inactive cheque not to be showed in cheque prepare page' },
];

export const NbHint: React.FC<{ num: number; text: string; className?: string }> = ({
  num,
  text,
  className = '',
}) => (
  <div
    className={`flex items-start gap-1.5 text-[11px] italic text-muted-foreground/90 bg-amber-500/5 border border-amber-500/15 rounded-md px-2.5 py-1.5 ${className}`}
  >
    <span className="font-bold text-amber-600 dark:text-amber-500 not-italic shrink-0">
      N.B. #{num}:
    </span>
    <span>{text}</span>
  </div>
);

export const NbHintRail: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="w-full xl:w-72 shrink-0">
      <div className="bg-card border border-border rounded-xl p-4 shadow-2xs space-y-3 sticky top-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Info className="size-3.5 text-indigo-500" />
            <span>10 Workbook Rules (N.B.)</span>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground xl:hidden p-0.5 cursor-pointer"
          >
            {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="space-y-2 text-[11px] text-muted-foreground leading-relaxed max-h-[70vh] overflow-y-auto sidebar-scroll pr-1">
            {HINTS.map((h) => (
              <div
                key={h.num}
                className="p-2 rounded-lg bg-background border border-border/60 hover:border-amber-400/50 transition-colors"
              >
                <span className="font-bold text-amber-600 dark:text-amber-400 mr-1 not-italic">
                  #{h.num}
                </span>
                <span className="italic">{h.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
