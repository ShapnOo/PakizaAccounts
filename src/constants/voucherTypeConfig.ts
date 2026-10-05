import { VoucherType } from '../types/voucher';

export const DEFAULT_CURRENCY = 'BDT';
export const DEFAULT_DATE = '2026-09-30';
export const COMPANIES = ['PSL', 'PKCL'] as const;
export const CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP'] as const;
export const VOUCHER_TYPES: VoucherType[] = [
  'Journal Voucher',
  'Payment Voucher',
  'Receive Voucher',
  'Contra Voucher',
];

export interface VoucherTypeConfig {
  type: VoucherType;
  shortName: string;
  isDoubleEntry: boolean;
  showDebit: boolean;
  showCredit: boolean;
  hasHeaderAccount: boolean;
  headerAccountLabel?: string;
  dynamicSetupLabel: string;
  defaultNature: 'DR' | 'CR' | '';
  colorToken: 'indigo' | 'rose' | 'emerald' | 'amber';
  breadcrumbTitle: string;
  allowOnlyCashBankLines: boolean;
  headerAccountOnlyCashBank: boolean;
  notes?: string;
}

export const VOUCHER_TYPE_CONFIGS: Record<VoucherType, VoucherTypeConfig> = {
  'Journal Voucher': {
    type: 'Journal Voucher',
    shortName: 'JV',
    isDoubleEntry: true,
    showDebit: true,
    showCredit: true,
    hasHeaderAccount: false,
    dynamicSetupLabel: 'Default Accounts',
    defaultNature: '',
    colorToken: 'indigo',
    breadcrumbTitle: 'Journal Voucher >',
    allowOnlyCashBankLines: false,
    headerAccountOnlyCashBank: false,
  },
  'Payment Voucher': {
    type: 'Payment Voucher',
    shortName: 'PV',
    isDoubleEntry: false,
    showDebit: true,
    showCredit: false,
    hasHeaderAccount: true,
    headerAccountLabel: 'Payment Accounts',
    dynamicSetupLabel: 'Payment by',
    defaultNature: 'CR',
    colorToken: 'rose',
    breadcrumbTitle: 'Payment Voucher >',
    allowOnlyCashBankLines: false,
    headerAccountOnlyCashBank: true,
    notes: 'Cash and Bank only for payment voucher and receive voucher',
  },
  'Receive Voucher': {
    type: 'Receive Voucher',
    shortName: 'RV',
    isDoubleEntry: false,
    showDebit: false,
    showCredit: true,
    hasHeaderAccount: true,
    headerAccountLabel: 'Receive Accounts',
    dynamicSetupLabel: 'Receive by',
    defaultNature: 'DR',
    colorToken: 'emerald',
    breadcrumbTitle: 'Receive Voucher >',
    allowOnlyCashBankLines: false,
    headerAccountOnlyCashBank: true,
    notes: 'Cash and Bank only for payment voucher and receive voucher',
  },
  'Contra Voucher': {
    type: 'Contra Voucher',
    shortName: 'CV',
    isDoubleEntry: true,
    showDebit: true,
    showCredit: true,
    hasHeaderAccount: false,
    dynamicSetupLabel: 'Default Accounts',
    defaultNature: '',
    colorToken: 'amber',
    breadcrumbTitle: 'Contra Voucher >',
    allowOnlyCashBankLines: true,
    headerAccountOnlyCashBank: true,
    notes: 'Only bank and cash account will show as accounts head',
  },
};

export const COST_CENTERS = [
  { id: 'cc-1', name: 'Head Office - Administration' },
  { id: 'cc-2', name: 'Factory Unit 01 - Knitting' },
  { id: 'cc-3', name: 'Factory Unit 02 - Dyeing & Finishing' },
  { id: 'cc-4', name: 'Factory Unit 03 - Garments Stitching' },
];

export const SUBSIDIARIES = [
  { id: 'sub-1', name: 'Local Yarn Suppliers Ltd.' },
  { id: 'sub-2', name: 'Bengal Chemicals & Dyes Ltd.' },
  { id: 'sub-3', name: 'Dhaka Packaging Materials Ltd.' },
  { id: 'sub-4', name: 'Global Logistics Partners' },
];

export const EMPLOYEES = [
  { id: 'emp-1', name: 'Tahmid Afsar (Accounts & Finance)' },
  { id: 'emp-2', name: 'Rahim Ullah (Procurement Officer)' },
  { id: 'emp-3', name: 'Kamal Hossain (Production Manager)' },
  { id: 'emp-4', name: 'Salma Khatun (Commercial Executive)' },
];

export const VEHICLES = [
  { id: 'veh-1', name: 'DM-TA-11-2099 (Covered Van 3.5T)' },
  { id: 'veh-2', name: 'DM-GA-34-1100 (Pickup 1.5T)' },
  { id: 'veh-3', name: 'DM-BHA-22-4411 (Microbus 12-Seater)' },
];
