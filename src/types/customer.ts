export type CustomerType =
  | 'General'
  | 'Retail'
  | 'Wholesale'
  | 'Corporate'
  | 'Government';

export type PaymentType =
  | 'Credit'
  | 'Cash'
  | 'Advance'
  | 'LC'
  | 'Others';

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isPrimary: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  dataUrl: string; // base64 for local preview & localStorage
}

export interface Customer {
  id: string;
  customerName: string;
  shortName: string;
  groupId: string;
  customerType: CustomerType;
  country: string;
  paymentType: PaymentType;
  makeSupplierAlso: boolean;
  addresses: Address[];
  email?: string;
  bin?: string;
  tin?: string;
  keyPerson?: string;
  mobile?: string;
  note?: string;
  accountsReceivableId: string | null;
  advanceReceiveAccountId: string | null;
  attachments: Attachment[];
  effectiveCompanyId: string;
  activeStatus: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
}

export const CUSTOMER_TYPES: CustomerType[] = [
  'General',
  'Retail',
  'Wholesale',
  'Corporate',
  'Government',
];

export const PAYMENT_TYPES: PaymentType[] = [
  'Credit',
  'Cash',
  'Advance',
  'LC',
  'Others',
];

export const CUSTOMER_TYPES_WITH_HINTS: { value: CustomerType; hint: string }[] = [
  { value: 'General', hint: 'Default classification' },
  { value: 'Retail', hint: 'Walk-in / end consumers' },
  { value: 'Wholesale', hint: 'Bulk buyers / distributors' },
  { value: 'Corporate', hint: 'Registered companies' },
  { value: 'Government', hint: 'Public sector entities' },
];
