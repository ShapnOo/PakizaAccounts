import React from 'react';
import { Ruler } from 'lucide-react';

interface MarginSectionProps {
  top: number;
  bottom: number;
  left: number;
  right: number;
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
  onChange,
}) => {
  return (
    <div className="space-y-3 p-3.5 bg-card rounded-xl border border-border/80 shadow-2xs">
      <div className="flex items-center justify-between pb-1 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Ruler className="size-3.5 text-indigo-600" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Margin (Inches)
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          Top/Bottom: {top}" | Left/Right: {left}"
        </span>
      </div>

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
  );
};
