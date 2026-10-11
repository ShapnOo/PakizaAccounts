export type FilterFieldType = 'reference' | 'text' | 'number' | 'date' | 'enum';

export type FilterField = {
  key: string; // e.g. "accountsHead"
  label: string; // e.g. "Accounts Head"
  type: FilterFieldType;
  optionsSource?:
    | 'coa'
    | 'subsidiary'
    | 'costCenter'
    | 'employee'
    | 'vehicle'
    | 'currency';
  enumOptions?: string[];
};

export type FilterOperator =
  | 'is'
  | 'isNot'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'before'
  | 'after'
  | 'isEmpty'
  | 'isNotEmpty';

export type FilterCondition = {
  id: string;
  fieldKey: string;
  operator: FilterOperator;
  value: string | number | [number, number] | [string, string] | null;
};

export type AdvanceFilterState = {
  combinator: 'AND' | 'OR';
  conditions: FilterCondition[];
  collapsed: boolean;
};

// Available fields (derived from source data model)
export const FILTER_FIELDS: FilterField[] = [
  {
    key: 'accountsHead',
    label: 'Accounts Head',
    type: 'reference',
    optionsSource: 'coa',
  },
  {
    key: 'subsidiary',
    label: 'Subsidiary',
    type: 'reference',
    optionsSource: 'subsidiary',
  },
  {
    key: 'costCenter',
    label: 'Cost Center',
    type: 'reference',
    optionsSource: 'costCenter',
  },
  {
    key: 'employee',
    label: 'Employee',
    type: 'reference',
    optionsSource: 'employee',
  },
  {
    key: 'vehicle',
    label: 'Vehicle',
    type: 'reference',
    optionsSource: 'vehicle',
  },
  { key: 'voucherNo', label: 'Voucher No', type: 'text' },
  { key: 'reference', label: 'Reference', type: 'text' },
  { key: 'narration', label: 'Narration', type: 'text' },
  {
    key: 'voucherType',
    label: 'Voucher Type',
    type: 'enum',
    enumOptions: ['Journal', 'Receive', 'Payment', 'Contra'],
  },
  {
    key: 'currency',
    label: 'Currency',
    type: 'enum',
    enumOptions: ['BDT', 'USD', 'EUR', 'GBP', 'INR'],
  },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'amount', label: 'Amount', type: 'number' },
];

// Operators per field type
export const OPERATORS_BY_TYPE: Record<
  FilterFieldType,
  { value: FilterOperator; label: string }[]
> = {
  reference: [
    { value: 'is', label: 'Is' },
    { value: 'isNot', label: 'Is Not' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' },
  ],
  text: [
    { value: 'is', label: 'Is' },
    { value: 'isNot', label: 'Is Not' },
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Does Not Contain' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' },
  ],
  number: [
    { value: 'eq', label: '= Equal to' },
    { value: 'neq', label: '≠ Not equal to' },
    { value: 'gt', label: '> Greater than' },
    { value: 'gte', label: '≥ Greater or equal' },
    { value: 'lt', label: '< Less than' },
    { value: 'lte', label: '≤ Less or equal' },
    { value: 'between', label: 'Between' },
    { value: 'isEmpty', label: 'Is Empty' },
  ],
  date: [
    { value: 'is', label: 'Is' },
    { value: 'before', label: 'Is Before' },
    { value: 'after', label: 'Is After' },
    { value: 'between', label: 'Between' },
    { value: 'isEmpty', label: 'Is Empty' },
  ],
  enum: [
    { value: 'is', label: 'Is' },
    { value: 'isNot', label: 'Is Not' },
    { value: 'isEmpty', label: 'Is Empty' },
  ],
};

// Value-optional operators (no value input needed)
export const VALUELESS_OPERATORS: FilterOperator[] = ['isEmpty', 'isNotEmpty'];
