export interface Bill {
  id: string;
  supplierId: string;
  billNo: string;
  billDate: string;
  billValue: number;
  prevPaid: number;
}

export const MOCK_BILLS: Bill[] = [
  { id: 'bill-1', supplierId: 'sup-1', billNo: 'BL/260000001', billDate: '2026-06-24', billValue: 100000, prevPaid: 40000 },
  { id: 'bill-2', supplierId: 'sup-1', billNo: 'BL/260000002', billDate: '2026-07-15', billValue: 75000, prevPaid: 25000 },
  { id: 'bill-3', supplierId: 'sup-2', billNo: 'BL/260000003', billDate: '2026-08-01', billValue: 120000, prevPaid: 0 },
  { id: 'bill-4', supplierId: 'sup-2', billNo: 'BL/260000004', billDate: '2026-08-10', billValue: 95000, prevPaid: 45000 },
  { id: 'bill-5', supplierId: 'sup-3', billNo: 'BL/260000005', billDate: '2026-08-20', billValue: 450000, prevPaid: 150000 },
  { id: 'bill-6', supplierId: 'sup-3', billNo: 'BL/260000006', billDate: '2026-09-01', billValue: 320000, prevPaid: 0 },
  { id: 'bill-7', supplierId: 'sup-4', billNo: 'BL/260000007', billDate: '2026-09-05', billValue: 185000, prevPaid: 50000 },
  { id: 'bill-8', supplierId: 'sup-5', billNo: 'BL/260000008', billDate: '2026-09-10', billValue: 210000, prevPaid: 0 },
  { id: 'bill-9', supplierId: 'sup-6', billNo: 'BL/260000009', billDate: '2026-09-15', billValue: 380000, prevPaid: 100000 },
  { id: 'bill-10', supplierId: 'sup-7', billNo: 'BL/260000010', billDate: '2026-09-20', billValue: 145000, prevPaid: 0 },
  { id: 'bill-11', supplierId: 'sup-8', billNo: 'BL/260000011', billDate: '2026-09-25', billValue: 290000, prevPaid: 140000 },
  { id: 'bill-12', supplierId: 'sup-9', billNo: 'BL/260000012', billDate: '2026-09-28', billValue: 540000, prevPaid: 200000 },
];
