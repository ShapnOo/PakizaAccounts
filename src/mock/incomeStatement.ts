import { ISFilterState } from '../types/incomeStatement';

export const MOCK_IS_FILTERS: ISFilterState = {
  reportType: 'Comprehensive',
  compareTo: 'Previous Period',
  dateRange: 'This Period',
  noOfPeriod: 2,
  displayedBy: 'Quarter',
  showInPercent: false,
  valueShowIn: 'N/A',
  currency: 'BDT',
  selectedCompanies: [
    'Pakiza Software Ltd.',
    'Pakiza Knit Composite Ltd.',
    'Pakiza Fashion & Design Ltd.',
  ],
  selectedCostCenters: ['Cripton ERP', 'Business Innovation'],
  advancedFilterCollapsed: true,
};

// Seed dataset per reportType & comparisonMode
export const MOCK_IS_DATA: Record<string, Record<string, number[]>> = {
  // 1. Comprehensive :: Previous Period (8 quarter columns: 4Q FY25-26 + 4Q FY26-27)
  'Comprehensive::periods': {
    salesRevenue:     [1000000, 950000, 900000, 850000, 1100000, 1050000, 1000000, 950000],
    costOfGoods:      [400000,  380000, 360000, 340000, 420000,  400000,  380000,  360000],
    exchangeGainLoss: [10000,   8000,   6000,   4000,   12000,   10000,   8000,    6000],
    scrapsRevenue:    [5000,    4000,   3000,   2000,   6000,    5000,    4000,    3000],
    adminExpenses:    [100000,  95000,  90000,  85000,  110000,  105000,  100000,  95000],
    sellingExpenses:  [50000,   45000,  40000,  35000,  55000,   50000,   45000,   40000],
    financialExpenses:[20000,  18000,  16000,  14000,  22000,   20000,   18000,   16000],
    incomeTax:        [50000,   47500,  45000,  42500,  55000,   52500,   50000,   47500],
  },

  // 2. Summary :: Previous Period
  'Summary::periods': {
    salesRevenue:     [1000000, 950000, 900000, 850000, 1100000, 1050000, 1000000, 950000],
    exchangeGainLoss: [10000,   8000,   6000,   4000,   12000,   10000,   8000,    6000],
    scrapsRevenue:    [5000,    4000,   3000,   2000,   6000,    5000,    4000,    3000],
    costOfGoods:      [400000,  380000, 360000, 340000, 420000,  400000,  380000,  360000],
    adminExpenses:    [100000,  95000,  90000,  85000,  110000,  105000,  100000,  95000],
    sellingExpenses:  [50000,   45000,  40000,  35000,  55000,   50000,   45000,   40000],
    financialExpenses:[20000,  18000,  16000,  14000,  22000,   20000,   18000,   16000],
  },

  // 3. Comprehensive :: Companies (5 companies)
  'Comprehensive::companies': {
    salesRevenue:     [1000000, 800000, 600000, 400000, 200000],
    costOfGoods:      [400000,  320000, 240000, 160000,  80000],
    exchangeGainLoss: [10000,   8000,   6000,   4000,    2000],
    scrapsRevenue:    [5000,    4000,   3000,   2000,    1000],
    adminExpenses:    [100000,  80000,  60000,  40000,  20000],
    sellingExpenses:  [50000,   40000,  30000,  20000,  10000],
    financialExpenses:[20000,  16000,  12000,   8000,   4000],
    incomeTax:        [50000,   40000,  30000,  20000,  10000],
  },

  // 4. Summary :: Companies
  'Summary::companies': {
    salesRevenue:     [1000000, 800000, 600000, 400000, 200000],
    exchangeGainLoss: [10000,   8000,   6000,   4000,    2000],
    scrapsRevenue:    [5000,    4000,   3000,   2000,    1000],
    costOfGoods:      [400000,  320000, 240000, 160000,  80000],
    adminExpenses:    [100000,  80000,  60000,  40000,  20000],
    sellingExpenses:  [50000,   40000,  30000,  20000,  10000],
    financialExpenses:[20000,  16000,  12000,   8000,   4000],
  },

  // 5. Comprehensive :: Cost Centers (2 cost centers)
  'Comprehensive::cost-centers': {
    salesRevenue:     [1000000, 800000],
    costOfGoods:      [400000,  320000],
    exchangeGainLoss: [10000,   8000],
    scrapsRevenue:    [5000,    4000],
    adminExpenses:    [100000,  80000],
    sellingExpenses:  [50000,   40000],
    financialExpenses:[20000,  16000],
    incomeTax:        [50000,   40000],
  },

  // 6. Summary :: Cost Centers
  'Summary::cost-centers': {
    salesRevenue:     [1000000, 800000],
    exchangeGainLoss: [10000,   8000],
    scrapsRevenue:    [5000,    4000],
    costOfGoods:      [400000,  320000],
    adminExpenses:    [100000,  80000],
    sellingExpenses:  [50000,   40000],
    financialExpenses:[20000,  16000],
  },

  // 7. Budget Mode
  'Comprehensive::budget': {
    salesRevenue:     [1000000, 950000, 50000],
    costOfGoods:      [400000,  420000, -20000],
    exchangeGainLoss: [10000,   12000,  -2000],
    scrapsRevenue:    [5000,    5000,   0],
    adminExpenses:    [100000,  105000, -5000],
    sellingExpenses:  [50000,   48000,  2000],
    financialExpenses:[20000,  20000,  0],
    incomeTax:        [50000,   45000,  5000],
  },
  'Summary::budget': {
    salesRevenue:     [1000000, 950000, 50000],
    exchangeGainLoss: [10000,   12000,  -2000],
    scrapsRevenue:    [5000,    5000,   0],
    costOfGoods:      [400000,  420000, -20000],
    adminExpenses:    [100000,  105000, -5000],
    sellingExpenses:  [50000,   48000,  2000],
    financialExpenses:[20000,  20000,  0],
  },
};
