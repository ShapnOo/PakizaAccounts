export interface IouRequisition {
  id: string;
  employeeId: string;
  requisitionNo: string;
  reqDate: string;
  reqValue: number;
  prevPaid: number;
}

export const MOCK_IOUS: IouRequisition[] = [
  {
    id: 'iou-1',
    employeeId: 'emp-1', // Riazul Islam
    requisitionNo: 'MR/260000001',
    reqDate: '2026-06-24',
    reqValue: 100000,
    prevPaid: 40000,
  },
  {
    id: 'iou-2',
    employeeId: 'emp-2', // Ayesha Khatun
    requisitionNo: 'MR/260000002',
    reqDate: '2026-07-10',
    reqValue: 50000,
    prevPaid: 15000,
  },
];
