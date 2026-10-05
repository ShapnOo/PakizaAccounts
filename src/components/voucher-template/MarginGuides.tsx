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
      {/* Top Margin Guide */}
      <div
        className="absolute left-0 right-0 border-b border-dashed border-indigo-400/60 dark:border-indigo-500/60 flex items-center justify-end px-2"
        style={{ top: `${topPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-500/80 -translate-y-2.5">
          Top: {topInch}"
        </span>
      </div>

      {/* Bottom Margin Guide */}
      <div
        className="absolute left-0 right-0 border-t border-dashed border-indigo-400/60 dark:border-indigo-500/60 flex items-center justify-end px-2"
        style={{ bottom: `${bottomPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-500/80 translate-y-2.5">
          Bottom: {bottomInch}"
        </span>
      </div>

      {/* Left Margin Guide */}
      <div
        className="absolute top-0 bottom-0 border-r border-dashed border-indigo-400/60 dark:border-indigo-500/60 flex flex-col justify-end pb-2 pl-0.5"
        style={{ left: `${leftPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-500/80 -rotate-90 origin-bottom-left translate-x-4">
          Left: {leftInch}"
        </span>
      </div>

      {/* Right Margin Guide */}
      <div
        className="absolute top-0 bottom-0 border-l border-dashed border-indigo-400/60 dark:border-indigo-500/60 flex flex-col justify-end pb-2 pr-0.5"
        style={{ right: `${rightPx}px` }}
      >
        <span className="text-[9px] font-mono text-indigo-500/80 rotate-90 origin-bottom-right -translate-x-4">
          Right: {rightInch}"
        </span>
      </div>
    </div>
  );
};
