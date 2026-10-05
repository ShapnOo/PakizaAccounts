export type SourceType = 'direct' | 'bill' | 'iou';
export type ChequeType = 'AC Payee' | 'Crossed' | 'Open' | 'Bearer';
export type ChequeFor = 'Supplier' | 'Employee' | 'Customer' | 'Other';

export interface ChequeEntry {
  id: string;
  sl: number;
  chequeNo: string;
  isInactive: boolean;
  signatory: string;
  used: boolean;
  usedOnVoucherId?: string;
}

export interface ChequeBook {
  id: string;
  accountsBankId: string; // COA bank account id
  bankName: string; // snapshot (e.g. DBBL)
  glName: string; // snapshot (e.g. DBBL-00123)
  enforceBySerial: boolean;
  bookName: string;
  firstChequeNo: string;
  noOfCheque: number;
  cheques: ChequeEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface PreparedCheque {
  id: string;
  sourceType: SourceType;
  chequeBookId: string;
  accountsBankId: string;
  bankName: string;
  bookName: string;
  chequeFor: ChequeFor;
  partyName: string;

  // bill/IOU only
  billNo?: string;
  billDate?: string;
  billValue?: number;
  prevPaid?: number;
  balance?: number;
  payAmount?: number;

  chequeType: ChequeType;
  chequeNo: string;
  chequeDate: string;
  payTo: string;
  glAccountId: string;
  amount: number;

  voucherDate?: string;
  voucherType?: string;
  narration?: string;

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
