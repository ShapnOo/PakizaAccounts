import React, { useMemo } from 'react';
import { inchToPx, mmToPx, MM_PER_INCH } from '../../lib/paperMath';

export type RulerUnit = 'mm' | 'in' | 'px';

interface RulerBarProps {
  unit: RulerUnit;
  onUnitChange: (unit: RulerUnit) => void;
  widthPx: number;
  heightPx: number;
  widthMm: number;
  heightMm: number;
  scale: number;
  marginTopInch: number;
  marginBottomInch: number;
  marginLeftInch: number;
  marginRightInch: number;
  cursorX?: number | null; // relative to canvas
  cursorY?: number | null; // relative to canvas
}

export const RulerBar: React.FC<RulerBarProps> = ({
  unit,
  onUnitChange,
  widthPx,
  heightPx,
  widthMm,
  heightMm,
  scale,
  marginTopInch,
  marginBottomInch,
  marginLeftInch,
  marginRightInch,
  cursorX,
  cursorY,
}) => {
  const RULER_THICKNESS = 22; // px

  // Margin positions in px
  const leftMarginPx = inchToPx(marginLeftInch, scale);
  const rightMarginPx = widthPx - inchToPx(marginRightInch, scale);
  const topMarginPx = inchToPx(marginTopInch, scale);
  const bottomMarginPx = heightPx - inchToPx(marginBottomInch, scale);

  // Horizontal ticks
  const horizontalTicks = useMemo(() => {
    const ticks: Array<{ pos: number; isMajor: boolean; isMid: boolean; label?: string }> = [];

    if (unit === 'mm') {
      const step = 5; // every 5mm
      for (let mm = 0; mm <= widthMm; mm += step) {
        const pos = mmToPx(mm, scale);
        const isMajor = mm % 20 === 0;
        const isMid = mm % 10 === 0 && !isMajor;
        ticks.push({
          pos,
          isMajor,
          isMid,
          label: isMajor ? `${mm}` : undefined,
        });
      }
    } else if (unit === 'in') {
      const widthInches = widthMm / MM_PER_INCH;
      const step = 0.25; // every 1/4 inch
      for (let inch = 0; inch <= widthInches + 0.1; inch += step) {
        const pos = inchToPx(inch, scale);
        const isMajor = Math.abs(inch - Math.round(inch)) < 0.01;
        const isMid = Math.abs(inch % 0.5) < 0.01 && !isMajor;
        ticks.push({
          pos,
          isMajor,
          isMid,
          label: isMajor ? `${Math.round(inch)}"` : undefined,
        });
      }
    } else {
      // px
      const step = 50;
      for (let px = 0; px <= widthPx; px += step) {
        const isMajor = px % 100 === 0;
        ticks.push({
          pos: px,
          isMajor,
          isMid: !isMajor,
          label: isMajor ? `${px}` : undefined,
        });
      }
    }
    return ticks;
  }, [unit, widthMm, widthPx, scale]);

  // Vertical ticks
  const verticalTicks = useMemo(() => {
    const ticks: Array<{ pos: number; isMajor: boolean; isMid: boolean; label?: string }> = [];

    if (unit === 'mm') {
      const step = 5;
      for (let mm = 0; mm <= heightMm; mm += step) {
        const pos = mmToPx(mm, scale);
        const isMajor = mm % 20 === 0;
        const isMid = mm % 10 === 0 && !isMajor;
        ticks.push({
          pos,
          isMajor,
          isMid,
          label: isMajor ? `${mm}` : undefined,
        });
      }
    } else if (unit === 'in') {
      const heightInches = heightMm / MM_PER_INCH;
      const step = 0.25;
      for (let inch = 0; inch <= heightInches + 0.1; inch += step) {
        const pos = inchToPx(inch, scale);
        const isMajor = Math.abs(inch - Math.round(inch)) < 0.01;
        const isMid = Math.abs(inch % 0.5) < 0.01 && !isMajor;
        ticks.push({
          pos,
          isMajor,
          isMid,
          label: isMajor ? `${Math.round(inch)}"` : undefined,
        });
      }
    } else {
      // px
      const step = 50;
      for (let px = 0; px <= heightPx; px += step) {
        const isMajor = px % 100 === 0;
        ticks.push({
          pos: px,
          isMajor,
          isMid: !isMajor,
          label: isMajor ? `${px}` : undefined,
        });
      }
    }
    return ticks;
  }, [unit, heightMm, heightPx, scale]);

  const cycleUnit = () => {
    if (unit === 'mm') onUnitChange('in');
    else if (unit === 'in') onUnitChange('px');
    else onUnitChange('mm');
  };

  return (
    <>
      {/* ── Top-Left Origin Unit Switcher ── */}
      <div
        onClick={cycleUnit}
        title={`Ruler unit: ${unit.toUpperCase()} (Click to toggle)`}
        style={{
          width: `${RULER_THICKNESS}px`,
          height: `${RULER_THICKNESS}px`,
        }}
        className="absolute top-0 left-0 z-30 bg-slate-200 dark:bg-slate-800 border-r border-b border-border/80 flex items-center justify-center cursor-pointer select-none hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors shadow-2xs"
      >
        <span className="text-[9px] font-mono font-black text-indigo-600 dark:text-indigo-400">
          {unit}
        </span>
      </div>

      {/* ── Horizontal (Top) Ruler ── */}
      <div
        style={{
          left: `${RULER_THICKNESS}px`,
          top: 0,
          width: `${widthPx}px`,
          height: `${RULER_THICKNESS}px`,
        }}
        className="absolute z-30 bg-slate-100/95 dark:bg-slate-800/95 border-b border-border/80 overflow-hidden select-none pointer-events-none"
      >
        {/* Active Margin Zones on Ruler */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-indigo-500/15 border-r border-indigo-500/30"
          style={{ width: `${leftMarginPx}px` }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 bg-indigo-500/15 border-l border-indigo-500/30"
          style={{ width: `${widthPx - rightMarginPx}px` }}
        />

        {/* Ticks and Labels */}
        {horizontalTicks.map((t, idx) => (
          <div
            key={idx}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${t.pos}px` }}
          >
            <div
              className={`w-px ${
                t.isMajor
                  ? 'h-3 bg-slate-500 dark:bg-slate-300'
                  : t.isMid
                  ? 'h-2 bg-slate-400/80 dark:bg-slate-400'
                  : 'h-1 bg-slate-300 dark:bg-slate-600'
              }`}
            />
            {t.label && (
              <span className="text-[8px] font-mono text-slate-500 dark:text-slate-400 leading-none -translate-x-1/2 select-none">
                {t.label}
              </span>
            )}
          </div>
        ))}

        {/* Cursor Hairline indicator */}
        {cursorX !== null && cursorX !== undefined && cursorX >= 0 && cursorX <= widthPx && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-40 transition-transform duration-75"
            style={{ left: `${cursorX}px` }}
          />
        )}
      </div>

      {/* ── Vertical (Left) Ruler ── */}
      <div
        style={{
          top: `${RULER_THICKNESS}px`,
          left: 0,
          width: `${RULER_THICKNESS}px`,
          height: `${heightPx}px`,
        }}
        className="absolute z-30 bg-slate-100/95 dark:bg-slate-800/95 border-r border-border/80 overflow-hidden select-none pointer-events-none"
      >
        {/* Active Margin Zones on Ruler */}
        <div
          className="absolute left-0 right-0 top-0 bg-indigo-500/15 border-b border-indigo-500/30"
          style={{ height: `${topMarginPx}px` }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 bg-indigo-500/15 border-t border-indigo-500/30"
          style={{ height: `${heightPx - bottomMarginPx}px` }}
        />

        {/* Ticks and Labels */}
        {verticalTicks.map((t, idx) => (
          <div
            key={idx}
            className="absolute left-0 flex items-center justify-end"
            style={{ top: `${t.pos}px`, width: `${RULER_THICKNESS}px` }}
          >
            {t.label && (
              <span className="text-[7.5px] font-mono text-slate-500 dark:text-slate-400 leading-none pr-0.5 select-none -rotate-90 origin-right">
                {t.label}
              </span>
            )}
            <div
              className={`h-px ${
                t.isMajor
                  ? 'w-3 bg-slate-500 dark:bg-slate-300'
                  : t.isMid
                  ? 'w-2 bg-slate-400/80 dark:bg-slate-400'
                  : 'w-1 bg-slate-300 dark:bg-slate-600'
              }`}
            />
          </div>
        ))}

        {/* Cursor Hairline indicator */}
        {cursorY !== null && cursorY !== undefined && cursorY >= 0 && cursorY <= heightPx && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-rose-500 z-40 transition-transform duration-75"
            style={{ top: `${cursorY}px` }}
          />
        )}
      </div>
    </>
  );
};
