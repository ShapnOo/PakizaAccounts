import { PaperSize, Orientation, PAPER_SIZES_MM } from '../types/voucherTemplate';

export interface CanvasDimensions {
  widthPx: number;
  heightPx: number;
  aspectRatio: number;
  widthMm: number;
  heightMm: number;
}

// 1 inch = 96 CSS pixels at 96 DPI
export const DPI = 96;
export const MM_PER_INCH = 25.4;
export const PX_PER_MM = DPI / MM_PER_INCH; // ~3.7795 px/mm

export function inchToPx(inch: number, scale: number = 1): number {
  return Math.round(inch * DPI * scale);
}

export function mmToPx(mm: number, scale: number = 1): number {
  return Math.round(mm * PX_PER_MM * scale);
}

export function getPaperDimensions(
  size: PaperSize,
  orientation: Orientation,
  scale: number = 1,
  customWidthMm?: number,
  customHeightMm?: number
): CanvasDimensions {
  const baseMm =
    size === 'Custom' && customWidthMm && customHeightMm
      ? { w: customWidthMm, h: customHeightMm }
      : PAPER_SIZES_MM[size] || PAPER_SIZES_MM.A4;

  const widthMm = orientation === 'Portrait' ? baseMm.w : baseMm.h;
  const heightMm = orientation === 'Portrait' ? baseMm.h : baseMm.w;

  const widthPx = mmToPx(widthMm, scale);
  const heightPx = mmToPx(heightMm, scale);
  const aspectRatio = widthMm / heightMm;

  return {
    widthPx,
    heightPx,
    aspectRatio,
    widthMm,
    heightMm,
  };
}
