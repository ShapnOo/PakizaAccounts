export type UploadStatus = 'Success' | 'Partial' | 'Failed';
export type UpdateStatus = 'Complete' | 'Partial' | 'Failed' | 'In Progress';

export interface UploadHistoryRow {
  id: string;
  uploadDate: string; // ISO string
  noOfVoucher: number;
  status: UploadStatus;
  fileName: string;
  uploadedBy: string;
}

export interface UpdateHistoryRow {
  id: string;
  updateDate: string;
  description: string; // e.g. "Accounts Update: Advance to Employee to Advance Supplier"
  noOfData: number;
  userName: string;
  status: UpdateStatus;
  affectedVoucherNos: string[]; // for drill-down modal
}

export interface VoucherRow {
  id: string;
  voucherNo: string;
  voucherDate: string;
  voucherType: 'Journal' | 'Receive' | 'Payment' | 'Contra';
  narration: string;
  amount: number;
  // Fields available for bulk update:
  accountsHead: string;
  accountsHeadId?: string;
  costCenter?: string;
  subsidiary?: string;
  subsidy?: string;
  employee?: string;
  vehicle?: string;
  reference?: string;
}

export interface FilterCriteria {
  dateFrom?: string;
  dateTo?: string;
  accountsName?: string;
  amountMin?: number;
  amountMax?: number;
  costCenter?: string;
  subsidy?: string;
  employee?: string;
  vehicle?: string;
}

export type UpdateField =
  | 'accountsHead'
  | 'costCenter'
  | 'subsidiary'
  | 'subsidy'
  | 'employee'
  | 'vehicle'
  | 'reference';

export const UPDATE_FIELDS: { value: UpdateField; label: string }[] = [
  { value: 'accountsHead', label: 'Accounts Head' },
  { value: 'costCenter', label: 'Cost Center' },
  { value: 'subsidiary', label: 'Subsidiary' },
  { value: 'subsidy', label: 'Subsidy' },
  { value: 'employee', label: 'Employee' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'reference', label: 'Reference' },
];
