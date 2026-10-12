import { LucideIcon, BookOpen, Layers, FileSpreadsheet } from 'lucide-react';

export type CustomFieldContext =
  | 'voucher-master'
  | 'voucher-details';

export type CustomFieldDataType =
  | 'Text'
  | 'LongText'
  | 'Number'
  | 'Currency'
  | 'Date'
  | 'DateTime'
  | 'Dropdown'
  | 'YesNo'
  | 'MultiSelect';

export type CustomFieldScope = 'Master' | 'Details';

export type CustomField = {
  id: string;
  context: CustomFieldContext;
  scope?: CustomFieldScope;        // 'Master' | 'Details'
  label: string;                  // "Invoice"
  dataType: CustomFieldDataType;
  mandatory: boolean;             // Yes → true
  activeStatus: 'Active' | 'Inactive';
  order: number;                  // for drag-and-drop
  options?: string[];             // Dropdown / MultiSelect only
  defaultValue?: string | number | boolean | null;
  createdAt: string;
  updatedAt: string;
};

export const CONTEXT_CONFIG: Record<
  CustomFieldContext,
  { label: string; icon: LucideIcon; description: string; scopeText: string }
> = {
  'voucher-master': {
    label: 'Voucher Master',
    icon: BookOpen,
    description: 'Fields added to all types of journal/voucher entries in the master (header) part',
    scopeText: 'Master Header Level',
  },
  'voucher-details': {
    label: 'Voucher Details',
    icon: FileSpreadsheet,
    description: 'Fields added to all types of vouchers as well as opening balance sheet line items',
    scopeText: 'Line Item / Detail Level',
  },
};

export const DATA_TYPES: CustomFieldDataType[] = [
  'Text',
  'LongText',
  'Number',
  'Currency',
  'Date',
  'DateTime',
  'Dropdown',
  'YesNo',
  'MultiSelect',
];
