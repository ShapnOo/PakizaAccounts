export type Config = {
  costCenter: {
    effectiveCompany: string;
    mandatory: boolean;
    effectivePart: 'Balance sheet' | 'Income Statement';
    partEffectiveCompany: string;
  };
  voucherControlling: {
    enabled: boolean;
    maxDueDays: number;
    effectivePart: { voucherType: string; user: string };
    effectiveCompany: string;
  };
  monthLock: {
    fiscalYear: string;
    months: Record<string, boolean>; // 12 keys
    effectiveCompany: string;
  };
  voucher: {
    dateFormat: string; // "DD/MM/YYYY"
    idRenewal: boolean;
    fiscalYearly: boolean;
  };
  accountsCode: {
    mergeView: boolean;
    pathVisible: boolean;
    effectiveCompany: string;
  };
  accountsIdentifications: {
    accountsPayable: string | null;
    accountsReceivable: string | null;
    advancePayment: string | null;
    advanceReceive: string | null;
  };
  bankCheque: {
    defaultVoucherType: string; // "Bank Payment Voucher"
    defaultAccount: string | null;
  };
  globalEffectiveCompany: string;
};

export type ConfigSectionKey =
  | 'costCenter'
  | 'voucherControlling'
  | 'monthLock'
  | 'voucher'
  | 'accountsCode'
  | 'accountsIdentifications'
  | 'bankCheque';

export interface AccountNode {
  id: string;
  code: string;
  name: string;
  type?: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  isSelectable?: boolean;
  children?: AccountNode[];
}
