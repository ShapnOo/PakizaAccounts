import { VoucherLine, VoucherType } from '../types/voucher';

export interface VoucherTotalsResult {
  totalDebit: number;
  totalCredit: number;
  totalDebitBDT: number;
  totalCreditBDT: number;
  difference: number; // Debit(BDT) - Credit(BDT)
  isBalanced: boolean;
}

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculateVoucherTotals(
  lines: VoucherLine[],
  voucherType: VoucherType
): VoucherTotalsResult {
  let totalDebit = 0;
  let totalCredit = 0;
  let totalDebitBDT = 0;
  let totalCreditBDT = 0;

  lines.forEach((line) => {
    const rate = line.exchangeRate > 0 ? line.exchangeRate : 1;
    const debit = line.debit || 0;
    const credit = line.credit || 0;

    totalDebit += debit;
    totalCredit += credit;
    totalDebitBDT += round2(debit * rate);
    totalCreditBDT += round2(credit * rate);
  });

  totalDebit = round2(totalDebit);
  totalCredit = round2(totalCredit);
  totalDebitBDT = round2(totalDebitBDT);
  totalCreditBDT = round2(totalCreditBDT);

  const difference = round2(totalDebitBDT - totalCreditBDT);
  // For double-entry vouchers (Journal, Contra), difference must equal 0
  const isBalanced =
    voucherType === 'Journal Voucher' || voucherType === 'Contra Voucher'
      ? Math.abs(difference) < 0.01 && lines.length > 0 && totalDebitBDT > 0
      : true;

  return {
    totalDebit,
    totalCredit,
    totalDebitBDT,
    totalCreditBDT,
    difference,
    isBalanced,
  };
}
