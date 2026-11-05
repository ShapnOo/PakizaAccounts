import { VoucherLine } from '../types/voucher';

export interface NarrationContext {
  date?: string;
  month?: string;
  year?: string;
  partyName?: string;
  invoiceNo?: string;
  chequeNo?: string;
  bankName?: string;
  amount?: string | number;
  purpose?: string;
  lines?: VoucherLine[];
}

/**
 * Extracts sensible context from transaction form state if not explicitly passed
 */
export const extractNarrationContext = (
  dateStr?: string,
  lines?: VoucherLine[],
  headerAccountName?: string,
  totalAmount?: number
): NarrationContext => {
  let partyName = '';
  let invoiceNo = '';
  let chequeNo = '';
  let purpose = '';

  if (lines && lines.length > 0) {
    for (const line of lines) {
      if (!partyName && (line.subsidiaryId || line.accountHeadName)) {
        partyName = line.subsidiaryId || line.accountHeadName || '';
      }
      if (!invoiceNo && line.reference) {
        invoiceNo = line.reference;
      }
      if (!chequeNo && (line.reference?.startsWith('CHQ') || line.reference?.startsWith('CQ'))) {
        chequeNo = line.reference;
      }
      if (!purpose && line.description) {
        purpose = line.description;
      }
    }
  }

  // Parse Month and Year from date
  let month = '';
  let year = '';
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      month = d.toLocaleString('en-US', { month: 'long' });
      year = d.getFullYear().toString();
    }
  }

  return {
    date: dateStr,
    month: month || undefined,
    year: year || undefined,
    partyName: partyName || undefined,
    invoiceNo: invoiceNo || undefined,
    chequeNo: chequeNo || undefined,
    bankName: headerAccountName || undefined,
    amount: totalAmount ? totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : undefined,
    purpose: purpose || undefined,
  };
};

/**
 * Replaces dynamic variables in a template with resolved values or fallback tokens
 */
export const interpolateNarration = (
  template: string,
  context: NarrationContext
): string => {
  if (!template) return '';

  return template
    .replace(/\{party_name\}/g, context.partyName || '{party_name}')
    .replace(/\{invoice_no\}/g, context.invoiceNo || '{invoice_no}')
    .replace(/\{cheque_no\}/g, context.chequeNo || '{cheque_no}')
    .replace(/\{bank_name\}/g, context.bankName || '{bank_name}')
    .replace(/\{month\}/g, context.month || '{month}')
    .replace(/\{year\}/g, context.year || '{year}')
    .replace(/\{purpose\}/g, context.purpose || '{purpose}')
    .replace(/\{amount\}/g, context.amount ? String(context.amount) : '{amount}');
};
