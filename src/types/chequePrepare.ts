export type SourceType = 'direct' | 'bill' | 'iou';
export type ChequeType = 'AC Payee' | 'Crossed' | 'Open' | 'Bearer';
export type ChequeFor = 'Supplier' | 'Employee' | 'Customer' | 'Other';

export interface PrepareLine {
  id: string;
  chequeType: ChequeType;
  chequeNo: string;
  chequeDate: string;
  payTo: string;
  chequeFor?: ChequeFor; // Direct only
  name?: string; // Direct only
  glAccountId: string;
  amount: number; // DR. Amount
}

export interface BillInfo {
  billNo: string;
  billDate: string;
  billValue: number;
  prevPaid: number;
  balance: number; // computed: billValue - prevPaid
  payAmount: number;
}

export interface IouInfo {
  requisitionNo: string;
  reqDate: string;
  reqValue: number;
  prevPaid: number;
  balance: number; // computed: reqValue - prevPaid
  payAmount: number;
}

export interface ChequePrepare {
  id: string;
  sourceType: SourceType;
  accountsBankId: string;
  bankName: string;
  bookName: string;

  chequeFor?: ChequeFor; // Bill/IOU only (single)
  name?: string; // Bill/IOU only (single)

  bill?: BillInfo;
  iou?: IouInfo;

  lines: PrepareLine[]; // Direct: 1..N; Bill/IOU: exactly 1

  voucherDate?: string;
  voucherType?: string;
  narration?: string;

  voucherId?: string;
  voucherNo?: string;
  createdAt: string;
}

export const SOURCE_TYPES: { value: SourceType; label: string; route: string }[] = [
  { value: 'direct', label: 'Direct Payment', route: '/cheques/prepare/direct' },
  { value: 'bill', label: 'Bill Payment', route: '/cheques/prepare/bill' },
  { value: 'iou', label: 'IOU Payment', route: '/cheques/prepare/iou' },
];

export const CHEQUE_TYPES: ChequeType[] = [
  'AC Payee',
  'Crossed',
  'Open',
  'Bearer',
];

export const CHEQUE_FOR: ChequeFor[] = [
  'Supplier',
  'Employee',
  'Customer',
  'Other',
];

export const VOUCHER_TYPES = [
  'Bank Payment',
  'Cash Payment',
  'Journal',
  'Contra',
];
