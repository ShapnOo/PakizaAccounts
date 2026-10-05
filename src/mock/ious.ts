export interface IouRequisition {
  id: string;
  employeeId: string;
  requisitionNo: string;
  reqDate: string;
  reqValue: number;
  prevPaid: number;
}

export const MOCK_IOUS: IouRequisition[] = [
  { id: 'iou-1', employeeId: 'emp-1', requisitionNo: 'MR/260000001', reqDate: '2026-06-24', reqValue: 100000, prevPaid: 40000 },
  { id: 'iou-2', employeeId: 'emp-2', requisitionNo: 'MR/260000002', reqDate: '2026-07-10', reqValue: 50000, prevPaid: 15000 },
  { id: 'iou-3', employeeId: 'emp-3', requisitionNo: 'MR/260000003', reqDate: '2026-07-22', reqValue: 80000, prevPaid: 20000 },
  { id: 'iou-4', employeeId: 'emp-4', requisitionNo: 'MR/260000004', reqDate: '2026-08-05', reqValue: 65000, prevPaid: 0 },
  { id: 'iou-5', employeeId: 'emp-5', requisitionNo: 'MR/260000005', reqDate: '2026-08-15', reqValue: 120000, prevPaid: 50000 },
  { id: 'iou-6', employeeId: 'emp-6', requisitionNo: 'MR/260000006', reqDate: '2026-08-25', reqValue: 45000, prevPaid: 10000 },
  { id: 'iou-7', employeeId: 'emp-7', requisitionNo: 'MR/260000007', reqDate: '2026-09-02', reqValue: 90000, prevPaid: 30000 },
  { id: 'iou-8', employeeId: 'emp-8', requisitionNo: 'MR/260000008', reqDate: '2026-09-10', reqValue: 35000, prevPaid: 0 },
  { id: 'iou-9', employeeId: 'emp-9', requisitionNo: 'MR/260000009', reqDate: '2026-09-18', reqValue: 75000, prevPaid: 25000 },
  { id: 'iou-10', employeeId: 'emp-10', requisitionNo: 'MR/260000010', reqDate: '2026-09-22', reqValue: 110000, prevPaid: 40000 },
  { id: 'iou-11', employeeId: 'emp-11', requisitionNo: 'MR/260000011', reqDate: '2026-09-26', reqValue: 55000, prevPaid: 0 },
  { id: 'iou-12', employeeId: 'emp-12', requisitionNo: 'MR/260000012', reqDate: '2026-10-01', reqValue: 85000, prevPaid: 35000 },
];
