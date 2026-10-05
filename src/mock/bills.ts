export interface Bill {
  id: string;
  supplierId: string;
  billNo: string;
  billDate: string;
  billValue: number;
  prevPaid: number;
}

export const MOCK_BILLS: Bill[] = [
  {
    id: 'bill-1',
    supplierId: 'sup-1', // BD Com
    billNo: 'BL/260000001',
    billDate: '2026-06-24',
    billValue: 100000,
    prevPaid: 40000,
  },
  {
    id: 'bill-2',
    supplierId: 'sup-1',
    billNo: 'BL/260000002',
    billDate: '2026-07-15',
    billValue: 75000,
    prevPaid: 25000,
  },
  {
    id: 'bill-3',
    supplierId: 'sup-2', // Partex Tissue
    billNo: 'BL/260000003',
    billDate: '2026-08-01',
    billValue: 120000,
    prevPaid: 0,
  },
];
