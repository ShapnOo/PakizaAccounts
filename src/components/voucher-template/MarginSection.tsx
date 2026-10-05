import React, { useState } from 'react';
import { Ruler, ChevronDown } from 'lucide-react';

interface MarginSectionProps {
  top: number;
  bottom: number;
  left: number;
  right: number;
  defaultCollapsed?: boolean;
  onChange: (patch: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }) => void;
}

export const MarginSection: React.FC<MarginSectionProps> = ({
  top,
  bottom,
  left,
  right,
  defaultCollapsed = false,
  onChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="bg-card rounded-xl border border-border/80 shadow-2xs overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-left cursor-pointer group"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-2">
          <Ruler className="size-3.5 text-indigo-600 transition-transform group-hover:scale-110" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Margin (Inches)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono bg-muted/80 px-2 py-0.5 rounded-md">
            T:{top}" B:{bottom}" L:{left}" R:{right}"
          </span>
          <ChevronDown
            className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          />
        </div>
      </button>

      {!isCollapsed && (
        <div className="p-3.5 pt-1 border-t border-border/40">

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Top */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Top
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="3"
            value={top}
            onChange={(e) =>
              onChange({ top: parseFloat(e.target.value) || 0 })
            }
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs text-right"
          />
        </div>

        {/* Bottom */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Bottom
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="3"
            value={bottom}
            onChange={(e) =>
              onChange({ bottom: parseFloat(e.target.value) || 0 })
            }
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs text-right"
          />
        </div>

        {/* Left */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Left
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="3"
            value={left}
            onChange={(e) =>
              onChange({ left: parseFloat(e.target.value) || 0 })
            }
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs text-right"
          />
        </div>

        {/* Right */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-muted-foreground block">
            Right
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="3"
            value={right}
            onChange={(e) =>
              onChange({ right: parseFloat(e.target.value) || 0 })
            }
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs text-right"
          />
        </div>
      </div>
    </div>
    )}
  </div>
  );
};
