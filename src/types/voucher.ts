export type VoucherType =
  | 'Journal Voucher'
  | 'Payment Voucher'
  | 'Receive Voucher'
  | 'Contra Voucher';

export interface DefaultAccountRow {
  id: string;
  accountId: string; // e.g. "Petty Cash In Hand"
  accountName?: string;
  nature: 'DR' | 'CR' | '';
  companyId: string; // "PSL" | "PKCL"
  active: boolean;
}

export interface VoucherDefinition {
  id: string;
  name: string; // "Cash Payment Voucher"
  shortName: string; // "CPV"
  voucherType: VoucherType;
  prefix?: string;
  resetFrequency?: 'Month' | 'Fiscal Year' | 'Calendar Year';
  accountCategory?: 'Bank & Cash Both' | 'Cash Only' | 'Bank Only';
  activeStatus: 'Active' | 'Inactive';
  defaultAccounts: DefaultAccountRow[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VoucherLine {
  id: string;
  accountHeadId: string;
  accountHeadName?: string;
  costCenterId?: string;
  subsidiaryId?: string;
  employeeId?: string;
  vehicleId?: string;
  reference?: string;
  description?: string;
  currency: string; // default "BDT"
  exchangeRate: number; // default 1
  debit?: number;
  credit?: number;
  debitBDT?: number; // debit * exchangeRate
  creditBDT?: number; // credit * exchangeRate
  customFields?: Record<string, any>;
}

export interface VoucherEntry {
  id?: string;
  voucherNumber?: string;
  voucherDefinitionId?: string;
  voucherType: VoucherType;
  date: string; // e.g. "2026-09-30"
  headerAccountId?: string; // Receive/Payment: "Petty Cash"
  headerAccountName?: string;
  headerCostCenterId?: string; // Receive/Payment
  lines: VoucherLine[];
  narration?: string;
  totals?: {
    debit: number;
    credit: number;
    debitBDT: number;
    creditBDT: number;
  };
  difference?: number;
  createdAt?: string;
}
