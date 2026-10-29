export type ReportType = 'Comprehensive' | 'Summary';

export type CompareMode =
  | 'Previous Period'
  | 'Company'
  | 'Cost Center'
  | 'Budget';

export type DisplayedBy = 'Month' | 'Quarter' | 'Year';

export type ValueShowIn = 'N/A' | 'Absolute' | 'Percent' | 'Ratio';

export type Currency = 'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR';

export type ISFilterState = {
  reportType: ReportType;
  compareTo: CompareMode;
  dateRange: string;
  noOfPeriod: number;
  displayedBy: DisplayedBy;
  showInPercent: boolean;
  valueShowIn: ValueShowIn;
  currency: Currency;
  selectedCompanies: string[];
  selectedCostCenters: string[];
  advancedFilterCollapsed: boolean;
};

export type ISColumnGroup = {
  label: string;
  subColumns?: { key: string; label: string; subLabel?: string }[];
};

export type ISRowKey =
  | 'operatingIncome'
  | 'salesRevenue'
  | 'lessCostOfGoods'
  | 'costOfGoods'
  | 'grossProfit'
  | 'nonOperatingIncome'
  | 'exchangeGainLoss'
  | 'scrapsRevenue'
  | 'lessIndirectExpenses'
  | 'adminExpenses'
  | 'sellingExpenses'
  | 'financialExpenses'
  | 'netProfitBeforeTax'
  | 'lessTax'
  | 'incomeTax'
  | 'netProfitAfterTax'
  // Summary only:
  | 'incomeHeader'
  | 'expensesHeader';

export type ISRow = {
  id: string;
  key: ISRowKey;
  label: string;
  level: 0 | 1;                      // 0 = section header, 1 = line item
  isSectionHeader: boolean;
  isBold: boolean;
  isFormula: boolean;                // computed rollup row (Gross Profit, NPBT, NPAT)
  letterCode?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  values: number[];                  // one per data column
  formula?: string;                  // e.g. "A-B"
};

export const REPORT_TYPES: ReportType[] = ['Comprehensive', 'Summary'];

export const COMPARE_MODES: CompareMode[] = [
  'Previous Period',
  'Company',
  'Cost Center',
  'Budget',
];

export const DISPLAYED_BY_OPTIONS: DisplayedBy[] = [
  'Month',
  'Quarter',
  'Year',
];

export const VALUE_SHOW_IN_OPTIONS: ValueShowIn[] = [
  'N/A',
  'Absolute',
  'Percent',
  'Ratio',
];

export const CURRENCIES: Currency[] = ['BDT', 'USD', 'EUR', 'GBP', 'INR'];

export const COMPANIES = [
  'Pakiza Software Ltd.',
  'Pakiza Knit Composite Ltd.',
  'Pakiza Fashion & Design Ltd.',
  'Pakiza Bagan Bari Ltd.',
  'Tripty Supar Shop',
];

export const COST_CENTERS = [
  'Cripton ERP',
  'Business Innovation',
];

// Row definitions per report type
export const COMPREHENSIVE_ROWS: {
  key: ISRowKey;
  label: string;
  level: 0 | 1;
  isSectionHeader: boolean;
  isBold: boolean;
  letterCode?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
}[] = [
  { key: 'operatingIncome', label: 'Operating Income', level: 0, isSectionHeader: true, isBold: true, letterCode: 'A' },
  { key: 'salesRevenue', label: 'Sales Revenue', level: 1, isSectionHeader: false, isBold: false },
  { key: 'lessCostOfGoods', label: 'Less Cost of Goods', level: 0, isSectionHeader: true, isBold: true, letterCode: 'B' },
  { key: 'costOfGoods', label: 'Cost of Goods', level: 1, isSectionHeader: false, isBold: false },
  { key: 'grossProfit', label: 'Gross Profit', level: 0, isSectionHeader: false, isBold: true, letterCode: 'C' },
  { key: 'nonOperatingIncome', label: 'Add Non Operating Income', level: 0, isSectionHeader: true, isBold: true, letterCode: 'D' },
  { key: 'exchangeGainLoss', label: 'Exchange Gain/Loss', level: 1, isSectionHeader: false, isBold: false },
  { key: 'scrapsRevenue', label: 'Revenue from Scraps/Wastage Sales', level: 1, isSectionHeader: false, isBold: false },
  { key: 'lessIndirectExpenses', label: 'Less Indirect Expenses', level: 0, isSectionHeader: true, isBold: true, letterCode: 'E' },
  { key: 'adminExpenses', label: 'Administrative Expenses', level: 1, isSectionHeader: false, isBold: false },
  { key: 'sellingExpenses', label: 'Selling and Distribution Expenses', level: 1, isSectionHeader: false, isBold: false },
  { key: 'financialExpenses', label: 'Financial Expenses', level: 1, isSectionHeader: false, isBold: false },
  { key: 'netProfitBeforeTax', label: 'Net Profit Before Tax', level: 0, isSectionHeader: false, isBold: true, letterCode: 'F' },
  { key: 'lessTax', label: 'Less Tax', level: 0, isSectionHeader: true, isBold: true, letterCode: 'G' },
  { key: 'incomeTax', label: 'Income Tax', level: 1, isSectionHeader: false, isBold: false },
  { key: 'netProfitAfterTax', label: 'Net Profit After Tax', level: 0, isSectionHeader: false, isBold: true },
];

export const SUMMARY_ROWS: typeof COMPREHENSIVE_ROWS = [
  { key: 'incomeHeader', label: 'Income', level: 0, isSectionHeader: true, isBold: true },
  { key: 'salesRevenue', label: 'Sales Revenue', level: 1, isSectionHeader: false, isBold: false },
  { key: 'exchangeGainLoss', label: 'Exchange Gain/Loss', level: 1, isSectionHeader: false, isBold: false },
  { key: 'scrapsRevenue', label: 'Revenue from Scraps/Wastage Sales', level: 1, isSectionHeader: false, isBold: false },
  { key: 'expensesHeader', label: 'Expenses', level: 0, isSectionHeader: true, isBold: true },
  { key: 'costOfGoods', label: 'Cost of Goods', level: 1, isSectionHeader: false, isBold: false },
  { key: 'adminExpenses', label: 'Administrative Expenses', level: 1, isSectionHeader: false, isBold: false },
  { key: 'sellingExpenses', label: 'Selling and Distribution Expenses', level: 1, isSectionHeader: false, isBold: false },
  { key: 'financialExpenses', label: 'Financial Expenses', level: 1, isSectionHeader: false, isBold: false },
  { key: 'netProfitBeforeTax', label: 'Net Profit Before Tax', level: 0, isSectionHeader: false, isBold: true },
];
