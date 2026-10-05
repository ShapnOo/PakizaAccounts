import { PreparedCheque } from '../types/cheque';

export const MOCK_PREPARED_CHEQUES: PreparedCheque[] = [
  {
    id: 'prep-1',
    sourceType: 'direct',
    chequeBookId: 'cb-1',
    accountsBankId: 'acc-01-01-01-02-01-01',
    bankName: 'DBBL',
    bookName: 'Test Book',
    chequeFor: 'Supplier',
    partyName: 'BD Com',
    chequeType: 'AC Payee',
    chequeNo: 'CQ26000003',
    chequeDate: '2026-02-09',
    payTo: 'Mr. Xyz',
    glAccountId: 'acc-02-01-01-01',
    amount: 50000,
    voucherDate: '2026-02-09',
    voucherType: 'Payment Voucher',
    narration: 'Cheque issued to Mr. Xyz against direct office setup supplies',
    createdAt: '2026-02-09T10:30:00Z',
  },
];
