import React from 'react';
import { mmToPx, pxToMm, pxToInch, MM_PER_INCH } from '../../lib/paperMath';
import { RulerUnit } from './RulerBar';

interface AlignmentOverlayProps {
  widthPx: number;
  heightPx: number;
  widthMm: number;
  heightMm: number;
  scale: number;
  showGrid: boolean;
  showCenterAxes: boolean;
  showSectionOutlines: boolean;
  showColumnGuides: boolean;
  unit: RulerUnit;
  cursorX?: number | null;
  cursorY?: number | null;
}

export const AlignmentOverlay: React.FC<AlignmentOverlayProps> = ({
  widthPx,
  heightPx,
  widthMm,
  heightMm,
  scale,
  showGrid,
  showCenterAxes,
  showSectionOutlines,
  showColumnGuides,
  unit,
  cursorX,
  cursorY,
}) => {
  const stepMm = 10; // 10mm grid cells
  const gridStepPx = mmToPx(stepMm, scale);

  const formattedCoord = () => {
    if (cursorX === null || cursorX === undefined || cursorY === null || cursorY === undefined) {
      return null;
    }
    if (cursorX < 0 || cursorX > widthPx || cursorY < 0 || cursorY > heightPx) {
      return null;
    }

    if (unit === 'mm') {
      const x = pxToMm(cursorX, scale).toFixed(1);
      const y = pxToMm(cursorY, scale).toFixed(1);
      return `X: ${x} mm · Y: ${y} mm`;
    } else if (unit === 'in') {
      const x = pxToInch(cursorX, scale).toFixed(2);
      const y = pxToInch(cursorY, scale).toFixed(2);
      return `X: ${x}" · Y: ${y}"`;
    } else {
      return `X: ${Math.round(cursorX)} px · Y: ${Math.round(cursorY)} px`;
    }
  };

  const coordText = formattedCoord();

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-15 overflow-hidden">
      {/* ── 1. Drafting Grid Overlay ── */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-40 dark:opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: `${gridStepPx}px ${gridStepPx}px`,
          }}
        />
      )}

      {/* ── 2. Center Crosshairs ── */}
      {showCenterAxes && (
        <>
          {/* Vertical Center Axis */}
          <div
            className="absolute top-0 bottom-0 border-r border-rose-500/60 border-dashed z-20 flex flex-col justify-start items-center"
            style={{ left: '50%' }}
          >
            <span className="text-[8.5px] font-mono bg-rose-500 text-white px-1 py-0.5 rounded shadow-2xs mt-1 -translate-x-1/2">
              Center X (50%)
            </span>
          </div>

          {/* Horizontal Center Axis */}
          <div
            className="absolute left-0 right-0 border-b border-rose-500/60 border-dashed z-20 flex items-center justify-end px-2"
            style={{ top: '50%' }}
          >
            <span className="text-[8.5px] font-mono bg-rose-500 text-white px-1 py-0.5 rounded shadow-2xs -translate-y-1/2">
              Center Y (50%)
            </span>
          </div>
        </>
      )}

      {/* ── 3. Real-time Cursor Coordinates Floating Badge ── */}
      {coordText && (
        <div className="absolute bottom-2 right-2 z-30 bg-slate-900/90 text-white dark:bg-slate-800/90 dark:text-slate-100 px-2 py-1 rounded-md text-[10px] font-mono shadow-md border border-slate-700 backdrop-blur-xs flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{coordText}</span>
        </div>
      )}
    </div>
  );
};
