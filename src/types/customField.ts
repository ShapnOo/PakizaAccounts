import { LucideIcon, BookOpen, ArrowUpRight, ArrowDownRight, Repeat, Scale, FolderTree } from 'lucide-react';

export type CustomFieldContext =
  | 'journal'
  | 'payment'
  | 'receive'
  | 'contra'
  | 'opening-balance'
  | 'coa';

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

export type CustomField = {
  id: string;
  context: CustomFieldContext;
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
  { label: string; icon: LucideIcon; description: string }
> = {
  'journal': {
    label: 'Journal Voucher',
    icon: BookOpen,
    description: 'Fields added to Journal entry lines',
  },
  'payment': {
    label: 'Payment Voucher',
    icon: ArrowUpRight,
    description: 'Fields added to Payment entry lines',
  },
  'receive': {
    label: 'Receive Voucher',
    icon: ArrowDownRight,
    description: 'Fields added to Receive entry lines',
  },
  'contra': {
    label: 'Contra Voucher',
    icon: Repeat,
    description: 'Fields added to Contra entry lines',
  },
  'opening-balance': {
    label: 'Opening Balance',
    icon: Scale,
    description: 'Fields added to Opening Balance lines',
  },
  'coa': {
    label: 'Chart of Accounts',
    icon: FolderTree,
    description: 'Fields added to COA create form',
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
