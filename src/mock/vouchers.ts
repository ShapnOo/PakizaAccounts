import { VoucherDefinition, VoucherEntry } from '../types/voucher';

export const INITIAL_VOUCHER_DEFINITIONS: VoucherDefinition[] = [
  {
    id: 'vdef-01',
    name: 'Journal Voucher',
    shortName: 'JV',
    voucherType: 'Journal Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
  {
    id: 'vdef-02',
    name: 'Cash Payment Voucher',
    shortName: 'CPV',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-01',
        accountId: 'acc-01-01-01-01-01',
        accountName: 'Petty Cash In Hand',
        nature: 'CR',
        companyId: 'PSL',
        active: true,
      },
      {
        id: 'da-02',
        accountId: 'acc-01-01-01-01-02',
        accountName: 'General Cash In Hand',
        nature: 'CR',
        companyId: 'PKCL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-03',
    name: 'Cash Receive Voucher',
    shortName: 'CRV',
    voucherType: 'Receive Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-03',
        accountId: 'acc-01-01-01-01-01',
        accountName: 'Petty Cash In Hand',
        nature: 'DR',
        companyId: 'PSL',
        active: true,
      },
      {
        id: 'da-04',
        accountId: 'acc-01-01-01-01-02',
        accountName: 'General Cash In Hand',
        nature: 'DR',
        companyId: 'PKCL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-04',
    name: 'Bank Payment Voucher',
    shortName: 'BPV',
    voucherType: 'Payment Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-05',
        accountId: 'acc-01-01-01-02-01-01',
        accountName: 'Cash at Bank DBBL',
        nature: 'CR',
        companyId: 'PSL',
        active: true,
      },
      {
        id: 'da-06',
        accountId: 'acc-01-01-01-02-01-02',
        accountName: 'Cash at Bank MTB',
        nature: 'CR',
        companyId: 'PKCL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-05',
    name: 'Bank Receive Voucher',
    shortName: 'BRV',
    voucherType: 'Receive Voucher',
    activeStatus: 'Active',
    defaultAccounts: [
      {
        id: 'da-07',
        accountId: 'acc-01-01-01-02-01-01',
        accountName: 'Cash at Bank DBBL',
        nature: 'DR',
        companyId: 'PSL',
        active: true,
      },
    ],
  },
  {
    id: 'vdef-06',
    name: 'Contra Voucher',
    shortName: 'CV',
    voucherType: 'Contra Voucher',
    activeStatus: 'Active',
    defaultAccounts: [],
  },
];

const LOCAL_STORAGE_VOUCHERS_KEY = 'pakiza_vouchers_definitions_v1';
const LOCAL_STORAGE_POSTED_KEY = 'pakiza_posted_vouchers_v1';

export function getStoredVouchers(): VoucherDefinition[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VOUCHERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_VOUCHER_DEFINITIONS;
}

export function saveStoredVouchers(data: VoucherDefinition[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_VOUCHERS_KEY, JSON.stringify(data));
  } catch (e) {}
}

export function getStoredPostedVouchers(): VoucherEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_POSTED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function saveStoredPostedVouchers(entries: VoucherEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTED_KEY, JSON.stringify(entries));
  } catch (e) {}
}
