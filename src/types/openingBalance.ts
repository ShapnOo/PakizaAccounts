export type SubsidiaryPartyType = 'Vendor' | 'Customer' | 'Other';

export interface OpeningBalanceLine {
  id: string; // uuid, used as React row key
  accountHeadId: string;
  costCenterId?: string;
  subsidiaryId?: string;
  employeeId?: string;
  vehicleId?: string;
  reference?: string;
  description?: string;
  currency: string; // default "BDT"
  exchangeRate: number; // default 1
  debit?: number; // original currency
  credit?: number; // original currency
  debitBDT?: number; // BDT amount
  creditBDT?: number; // BDT amount
}

export interface OpeningBalance {
  id: string;
  openingDate: string; // ISO date string
  lines: OpeningBalanceLine[];
  note?: string;
  updatedAt: string;
}

export interface AccountOption {
  id: string;
  name: string;
  code?: string;
  path: string[];
}

export interface SubsidiaryOption {
  id: string;
  name: string;
  partyType: SubsidiaryPartyType;
}

export interface SimpleMasterOption {
  id: string;
  name: string;
  code?: string;
}

export const DEFAULT_CURRENCY = 'BDT';
export const DEFAULT_RATE = 1;
export const CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP', 'INR'] as const;

export const FISCAL_YEAR_STARTS: Record<string, string> = {
  '2025-2026': '2025-07-01',
  '2026-2027': '2026-07-01',
  '2027-2028': '2027-07-01',
};
