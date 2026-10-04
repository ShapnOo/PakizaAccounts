import { Nature } from '../constants/accountsTypeTree';

export type HierarchyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface AuxiliaryDimensions {
  supplier?: string;
  customer?: string;
  employee?: string;
  reference?: string;
  vehicle?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountType: 'CD' | 'SB' | 'CC' | 'OD' | string;
}

export interface Account {
  id: string;
  name: string; // e.g. "DBBL-100001122" or "Cash at Bank DBBL"
  nameRaw?: string; // original raw string if typo exists (e.g. "Asstes")
  code: string; // 12-digit zero-padded code (e.g. "010103040101")
  manualCode?: string; // "111000"
  accountsType: string; // from taxonomy, e.g. "Cash & Cash Equivalent"
  nature: Nature;
  parentId: string | null;
  level: HierarchyLevel;
  path: string[]; // ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'Cash at Bank BDT', 'Cash at Bank DBBL']
  description?: string;
  activeStatus: 'Active' | 'Inactive';
  companyName: string; // "Pakiza Software Ltd."
  isParent: boolean; // "Make This Parent"
  defaultCurrency: 'BDT';
  isMandatory?: boolean;
  aux?: AuxiliaryDimensions;
  detailsType?: string; // "Bank", "Cash", etc.
  bankDetails?: BankDetails;
  children?: Account[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountFilter {
  search: string;
  accountsType: string;
  activeStatus: 'All' | 'Active' | 'Inactive';
  company: string;
  level?: HierarchyLevel | 'All';
}

export interface AccountFormData {
  name: string;
  accountsType: string;
  parentId: string | null;
  manualCode?: string;
  description?: string;
  activeStatus: 'Active' | 'Inactive';
  companyName: string;
  isParent: boolean;
  defaultCurrency: 'BDT';
  isMandatory?: boolean;
  aux?: AuxiliaryDimensions;
  detailsType?: string;
  bankDetails?: BankDetails;
}
