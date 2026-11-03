import type {
  PreviewLine,
  VoucherType,
} from '../types/voucherTemplate';
import { PAPER_SIZES_MM } from '../types/voucherTemplate';

/**
 * Derive signature slot labels based on voucher type.
 * Mirrors the Data sheet formula.
 */
export function deriveSignatureLabels(voucherType: VoucherType): string[] {
  if (voucherType === 'Payment') {
    return ['Received By', 'Prepared By', 'Checked By', 'Approved By'];
  }
  if (voucherType === 'Receive') {
    return ['Paid By', 'Prepared By', 'Checked By', 'Approved By'];
  }
  // Journal / Contra → 3 labels, 4th is empty
  return ['Prepared By', 'Checked By', 'Approved By', ''];
}

/**
 * Compute currency summary from lines.
 * Assigns sequential curNum (1..4) to first occurrence.
 */
export function computeCurrencySummary(lines: PreviewLine[]) {
  const seen = new Map<string, number>();
  let next = 1;
  lines.forEach((l) => {
    if (l.currency && !seen.has(l.currency)) {
      seen.set(l.currency, next++);
    }
  });

  const summary = Array.from(seen.entries()).map(([cur]) => {
    const filtered = lines.filter((l) => l.currency === cur);
    return {
      currency: cur,
      debitCur: filtered.reduce((s, l) => s + l.debit, 0),
      creditCur: filtered.reduce((s, l) => s + l.credit, 0),
      debitBDT: filtered.reduce((s, l) => s + l.debitBDT, 0),
      creditBDT: filtered.reduce((s, l) => s + l.creditBDT, 0),
    };
  });

  return summary.slice(0, 4);
}

/**
 * Compute per-line BDT amounts.
 */
export function computeLineBDT(
  line: PreviewLine
): { debitBDT: number; creditBDT: number } {
  return {
    debitBDT: line.debit * line.exchangeRate,
    creditBDT: line.credit * line.exchangeRate,
  };
}

/**
 * Compute totals.
 */
export function computeTotals(lines: PreviewLine[]) {
  const debitBDT = lines.reduce((s, l) => s + l.debitBDT, 0);
  const creditBDT = lines.reduce((s, l) => s + l.creditBDT, 0);
  const difference = debitBDT - creditBDT;
  return {
    debitBDT,
    creditBDT,
    difference,
    isBalanced: Math.abs(difference) < 0.01,
  };
}

/**
 * Compute paper pixel dimensions from A4-like sizes.
 */
export function computePaperSize(
  paperSize: string,
  orientation: string
): { widthPx: number; heightPx: number } {
  const mm =
    PAPER_SIZES_MM[paperSize as keyof typeof PAPER_SIZES_MM] ||
    PAPER_SIZES_MM.A4;
  const w = orientation === 'Portrait' ? mm.w : mm.h;
  const h = orientation === 'Portrait' ? mm.h : mm.w;
  const scale = 3.0;
  return { widthPx: Math.round(w * scale), heightPx: Math.round(h * scale) };
}

