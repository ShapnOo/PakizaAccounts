export type ReportType = 'Comprehensive' | 'Summary';

export type AccountsType =
  | 'Cash & Cash Equivalent'
  | 'Bank Accounts'
  | 'All Liquid Accounts';

export type ApprovalStatus = 'All' | 'Approved' | 'Pending' | 'Posted';

export type Currency = 'BDT' | 'USD' | 'EUR' | 'GBP';

export type DateRangePreset =
  | 'This Month'
  | 'This Quarter'
  | 'This Year'
  | 'Last Month'
  | 'Custom Range';

export type AccountsDetailType =
  | 'Cash'
  | 'Non-Restricted Bank'
  | 'Restricted Bank'
  | 'Short Term Investment';

export type ValueShowIn =
  | 'N/A'
  | 'Thousand(/1000)'
  | 'Lakh(/100000)'
  | 'Million(/1000000)'
  | 'Crore(/10000000)';

export interface BreakdownItem {
  key: string;
  label: string;
  amount: number;
}

export interface RPBalanceBlock {
  title: string;
  asOnDate: string;
  total: number;
  breakdown: BreakdownItem[];
}

export interface RPTransaction {
  id: string;
  date: string; // ISO date 'YYYY-MM-DD'
  voucherNo: string;
  particulars: string;
  oppositeAccounts: string;
  amount: number;
  accountType?: AccountsDetailType;
  approvalStatus?: ApprovalStatus;
}

export interface RPSummaryItem {
  oppositeAccounts: string;
  amount: number;
  voucherCount: number;
}

export interface RPFilterState {
  reportType: ReportType;
  accountsType: AccountsType;
  approvalStatus: ApprovalStatus;
  currency: Currency;
  dateRangePreset: DateRangePreset;
  startDate: string;
  endDate: string;
  accountsDetailsTypes: AccountsDetailType[];
  valueShowIn: ValueShowIn;
  accountsHead: string;
  advancedFilterCollapsed: boolean;
}

export interface RPStatementData {
  receiptOpening: RPBalanceBlock;
  receiptTransactions: RPTransaction[];
  receiptSummaryItems: RPSummaryItem[];
  totalDebit: number;
  grandTotalReceipt: number;

  paymentTransactions: RPTransaction[];
  paymentSummaryItems: RPSummaryItem[];
  totalCredit: number;
  paymentClosing: RPBalanceBlock;
  grandTotalPayment: number;

  isBalanced: boolean;
  difference: number;
}

export const REPORT_TYPES: ReportType[] = ['Comprehensive', 'Summary'];

export const ACCOUNTS_TYPES: AccountsType[] = [
  'Cash & Cash Equivalent',
  'Bank Accounts',
  'All Liquid Accounts',
];

export const APPROVAL_STATUSES: ApprovalStatus[] = [
  'All',
  'Approved',
  'Pending',
  'Posted',
];

export const CURRENCIES: Currency[] = ['BDT', 'USD', 'EUR', 'GBP'];

export const DATE_RANGES: DateRangePreset[] = [
  'This Month',
  'This Quarter',
  'This Year',
  'Last Month',
  'Custom Range',
];

export const ACCOUNTS_DETAILS_TYPES: AccountsDetailType[] = [
  'Cash',
  'Non-Restricted Bank',
  'Restricted Bank',
  'Short Term Investment',
];

export const VALUE_SHOW_IN_OPTIONS: ValueShowIn[] = [
  'N/A',
  'Thousand(/1000)',
  'Lakh(/100000)',
  'Million(/1000000)',
  'Crore(/10000000)',
];
