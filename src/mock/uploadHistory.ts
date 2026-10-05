import { UploadHistoryRow } from '../types/bulk';

export const MOCK_UPLOAD_HISTORY: UploadHistoryRow[] = [
  {
    id: 'up-1',
    uploadDate: '2026-10-03T09:12:00Z',
    noOfVoucher: 42,
    status: 'Success',
    fileName: 'vouchers_oct_2026.xlsx',
    uploadedBy: 'Riazul Islam',
  },
  {
    id: 'up-2',
    uploadDate: '2026-10-01T14:05:00Z',
    noOfVoucher: 15,
    status: 'Partial',
    fileName: 'opening_balances_fy26.xlsx',
    uploadedBy: 'Ayesha Khatun',
  },
  {
    id: 'up-3',
    uploadDate: '2026-09-28T11:30:00Z',
    noOfVoucher: 28,
    status: 'Success',
    fileName: 'yarn_procurement_jv.xlsx',
    uploadedBy: 'Tanvir Ahmed',
  },
  {
    id: 'up-4',
    uploadDate: '2026-09-22T16:20:00Z',
    noOfVoucher: 8,
    status: 'Failed',
    fileName: 'utility_expenses_corrupted.csv',
    uploadedBy: 'Sadia Rahman',
  },
];
