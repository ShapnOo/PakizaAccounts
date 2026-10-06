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

export function pxToMm(px: number, scale: number = 1): number {
  return px / (PX_PER_MM * scale);
}

export function pxToInch(px: number, scale: number = 1): number {
  return px / (DPI * scale);
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

export function resolveThemeColor(theme?: string, color?: string): string {
  if (color && color !== '#000000' && color !== '#0f172a' && color.trim() !== '') {
    return color;
  }
  switch (theme) {
    case 'Modern':
      return '#2563eb';
    case 'Corporate':
      return '#0f766e';
    case 'Minimal':
      return '#475569';
    case 'Bold':
      return '#7c3aed';
    case 'Crimson':
      return '#b91c1c';
    case 'Amber':
      return '#c2410c';
    case 'Classic':
    default:
      return '#1e293b';
  }
}
