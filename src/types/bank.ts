export interface Bank {
  id: string;
  name: string; // e.g. "Dutch Bangla Bank Lt."
  alias: string; // e.g. "DBBL"
  createdAt: string;
}

export interface BankAccountRef {
  id: string; // uuid for row key
  coaAccountId: string; // FK -> COA account with Bank details
  accountsType: string; // snapshot: "CD" | "SB" | "CC" | "OD" | string
  accountsNumber: string; // snapshot from COA
  accountsName: string; // snapshot from COA
}

export interface Branch {
  id: string;
  bankId: string;
  bankName: string;
  bankAlias: string;
  branchName: string;
  address: string;
  routingNo?: string;
  swiftCode?: string;
  accounts: BankAccountRef[];
  createdAt: string;
  updatedAt: string;
}

export const ACCOUNT_TYPES = ['CD', 'SB', 'CC', 'OD'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];
