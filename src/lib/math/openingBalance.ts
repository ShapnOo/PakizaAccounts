import { OpeningBalanceLine } from '../../types/openingBalance';

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export interface OpeningBalanceTotals {
  totalDebitBDT: number;
  totalCreditBDT: number;
  difference: number;
  balanced: boolean;
}

export function calculateOpeningBalanceTotals(
  lines: OpeningBalanceLine[]
): OpeningBalanceTotals {
  let totalDebitBDT = 0;
  let totalCreditBDT = 0;

  for (const line of lines) {
    totalDebitBDT += line.debitBDT || 0;
    totalCreditBDT += line.creditBDT || 0;
  }

  totalDebitBDT = round2(totalDebitBDT);
  totalCreditBDT = round2(totalCreditBDT);
  const difference = round2(totalDebitBDT - totalCreditBDT);
  const balanced = Math.abs(difference) < 0.01 && lines.length > 0;

  return {
    totalDebitBDT,
    totalCreditBDT,
    difference,
    balanced,
  };
}

/**
 * Handle currency change logic:
 * Case A (to BDT): compute BDT amounts, set rate to 1, clear original
 * Case B (from BDT to Foreign): copy BDT amount to original currency amount, set default rate
 */
export function handleLineCurrencyChange(
  line: OpeningBalanceLine,
  newCurrency: string
): OpeningBalanceLine {
  if (newCurrency === 'BDT') {
    // Switching to BDT
    const rate = 1;
    const debitBDT =
      line.debit !== undefined && line.debit > 0
        ? round2(line.debit * (line.exchangeRate || 1))
        : line.debitBDT;
    const creditBDT =
      line.credit !== undefined && line.credit > 0
        ? round2(line.credit * (line.exchangeRate || 1))
        : line.creditBDT;

    return {
      ...line,
      currency: 'BDT',
      exchangeRate: 1,
      debit: undefined,
      credit: undefined,
      debitBDT,
      creditBDT,
    };
  } else {
    // Switching to Foreign Currency
    const currentRate = line.exchangeRate > 0 && line.exchangeRate !== 1 ? line.exchangeRate : 1;
    const debit = line.debitBDT !== undefined && line.debitBDT > 0 ? line.debitBDT : line.debit || 0;
    const credit =
      line.creditBDT !== undefined && line.creditBDT > 0 ? line.creditBDT : line.credit || 0;

    return {
      ...line,
      currency: newCurrency,
      exchangeRate: currentRate,
      debit: debit > 0 ? debit : undefined,
      credit: credit > 0 ? credit : undefined,
      debitBDT: debit > 0 ? round2(debit * currentRate) : undefined,
      creditBDT: credit > 0 ? round2(credit * currentRate) : undefined,
    };
  }
}
