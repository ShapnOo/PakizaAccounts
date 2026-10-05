import React from 'react';
import { inchToPx } from '../../lib/paperMath';

interface MarginGuidesProps {
  topInch: number;
  bottomInch: number;
  leftInch: number;
  rightInch: number;
  scale?: number;
  visible?: boolean;
}

export const MarginGuides: React.FC<MarginGuidesProps> = ({
  topInch,
  bottomInch,
  leftInch,
  rightInch,
  scale = 1,
  visible = true,
}) => {
  if (!visible) return null;

  const topPx = inchToPx(topInch, scale);
  const bottomPx = inchToPx(bottomInch, scale);
  const leftPx = inchToPx(leftInch, scale);
  const rightPx = inchToPx(rightInch, scale);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {/* ── Printable Content Boundary Box ── */}
      <div
        className="absolute border border-dashed border-indigo-400/50 dark:border-indigo-500/50"
        style={{
          top: `${topPx}px`,
          bottom: `${bottomPx}px`,
          left: `${leftPx}px`,
          right: `${rightPx}px`,
        }}
      >
        {/* Printable Area Badge */}
        <div className="absolute top-1 left-1.5 opacity-60">
          <span className="text-[8px] font-mono uppercase tracking-wider text-indigo-500 font-bold bg-indigo-50/80 dark:bg-indigo-950/80 px-1 py-0.5 rounded border border-indigo-200/50">
            Printable Area
          </span>
        </div>

        {/* 4 Corner Markers */}
        <div className="absolute -top-1 -left-1 size-2 border-t-2 border-l-2 border-indigo-600 dark:border-indigo-400" />
        <div className="absolute -top-1 -right-1 size-2 border-t-2 border-r-2 border-indigo-600 dark:border-indigo-400" />
        <div className="absolute -bottom-1 -left-1 size-2 border-b-2 border-l-2 border-indigo-600 dark:border-indigo-400" />
        <div className="absolute -bottom-1 -right-1 size-2 border-b-2 border-r-2 border-indigo-600 dark:border-indigo-400" />
      </div>

      {/* Top Margin Guide */}
      <div
        className="absolute left-0 right-0 border-b border-dashed border-indigo-300/60 dark:border-indigo-600/60 flex items-center justify-end px-2"
        style={{ top: `${topPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 bg-white/90 dark:bg-slate-900/90 px-1 rounded -translate-y-2.5 shadow-2xs border border-indigo-200/50">
          Top: {topInch}"
        </span>
      </div>

      {/* Bottom Margin Guide */}
      <div
        className="absolute left-0 right-0 border-t border-dashed border-indigo-300/60 dark:border-indigo-600/60 flex items-center justify-end px-2"
        style={{ bottom: `${bottomPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 bg-white/90 dark:bg-slate-900/90 px-1 rounded translate-y-2.5 shadow-2xs border border-indigo-200/50">
          Bottom: {bottomInch}"
        </span>
      </div>

      {/* Left Margin Guide */}
      <div
        className="absolute top-0 bottom-0 border-r border-dashed border-indigo-300/60 dark:border-indigo-600/60 flex flex-col justify-end pb-2 pl-0.5"
        style={{ left: `${leftPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 bg-white/90 dark:bg-slate-900/90 px-1 rounded -rotate-90 origin-bottom-left translate-x-4 shadow-2xs border border-indigo-200/50">
          Left: {leftInch}"
        </span>
      </div>

      {/* Right Margin Guide */}
      <div
        className="absolute top-0 bottom-0 border-l border-dashed border-indigo-300/60 dark:border-indigo-600/60 flex flex-col justify-end pb-2 pr-0.5"
        style={{ right: `${rightPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 bg-white/90 dark:bg-slate-900/90 px-1 rounded rotate-90 origin-bottom-right -translate-x-4 shadow-2xs border border-indigo-200/50">
          Right: {rightInch}"
        </span>
      </div>
    </div>
  );
};
