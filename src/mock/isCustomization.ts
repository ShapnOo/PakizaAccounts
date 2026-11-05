import type { ISCustomization, MasterListItem } from '../types/isCustomization';
import { DEFAULT_TITLES } from '../types/isCustomization';
export { DEFAULT_TITLES };

// ─── DEFAULT COMPREHENSIVE (exact from Sheet1: 23 seed rows) ────────────
export const DEFAULT_COMPREHENSIVE: ISCustomization = {
  reportType: 'Comprehensive',
  reportTitle: 'Statement of Comprehensive Income',
  rows: [
    {
      id: 'r1',
      kind: 'parent',
      code: 'A',
      particulars: 'Operating Income',
      formula: '1+2+3',
      order: 0,
    },
    {
      id: 'r2',
      kind: 'child',
      code: '1',
      particulars: 'Sales Revenue',
      parentCode: 'A',
      order: 1,
    },
    {
      id: 'r3',
      kind: 'child',
      code: '2',
      particulars: 'Service Revenue',
      parentCode: 'A',
      order: 2,
    },
    {
      id: 'r4',
      kind: 'child',
      code: '3',
      particulars: 'Others Operating Income',
      parentCode: 'A',
      order: 3,
    },

    {
      id: 'r5',
      kind: 'parent',
      code: 'B',
      particulars: 'Less Cost of Goods',
      formula: '4+5+6',
      order: 4,
    },
    {
      id: 'r6',
      kind: 'child',
      code: '4',
      particulars: 'Cost of Revenue (Details Req.)',
      parentCode: 'B',
      order: 5,
    },
    {
      id: 'r7',
      kind: 'child',
      code: '5',
      particulars: 'Depreciation Direct',
      parentCode: 'B',
      order: 6,
    },
    {
      id: 'r8',
      kind: 'child',
      code: '6',
      particulars: 'Others Direct Expenses',
      parentCode: 'B',
      order: 7,
    },

    {
      id: 'r9',
      kind: 'parent',
      code: 'C',
      particulars: 'Gross Profit',
      formula: 'A-B',
      order: 8,
    },

    {
      id: 'r10',
      kind: 'parent',
      code: 'D',
      particulars: 'Add Non Operating Income',
      formula: '7+8+9',
      order: 9,
    },
    {
      id: 'r11',
      kind: 'child',
      code: '7',
      particulars: 'Exchange Gain/Loss',
      parentCode: 'D',
      order: 10,
    },
    {
      id: 'r12',
      kind: 'child',
      code: '8',
      particulars: 'Revenue from Scraps/Wastage Sales',
      parentCode: 'D',
      order: 11,
    },
    {
      id: 'r13',
      kind: 'child',
      code: '9',
      particulars: 'Others Non-Operating Income',
      parentCode: 'D',
      order: 12,
    },

    {
      id: 'r14',
      kind: 'parent',
      code: 'E',
      particulars: 'Less Indirect Expenses',
      formula: '10+11+12+13+14',
      order: 13,
    },
    {
      id: 'r15',
      kind: 'child',
      code: '10',
      particulars: 'Administrative Expenses',
      parentCode: 'E',
      order: 14,
    },
    {
      id: 'r16',
      kind: 'child',
      code: '11',
      particulars: 'Selling and Distribution Expenses',
      parentCode: 'E',
      order: 15,
    },
    {
      id: 'r17',
      kind: 'child',
      code: '12',
      particulars: 'Financial Expenses',
      parentCode: 'E',
      order: 16,
    },
    {
      id: 'r18',
      kind: 'child',
      code: '13',
      particulars: 'Depreciation Indirect',
      parentCode: 'E',
      order: 17,
    },
    {
      id: 'r19',
      kind: 'child',
      code: '14',
      particulars: 'Others Indirect Expenses',
      parentCode: 'E',
      order: 18,
    },

    {
      id: 'r20',
      kind: 'parent',
      code: 'F',
      particulars: 'Net Profit Before Tax',
      formula: 'C+D-E',
      order: 19,
    },

    {
      id: 'r21',
      kind: 'parent',
      code: 'G',
      particulars: 'Less Tax',
      formula: '15',
      order: 20,
    },
    {
      id: 'r22',
      kind: 'child',
      code: '15',
      particulars: 'Income Tax',
      parentCode: 'G',
      order: 21,
    },

    {
      id: 'r23',
      kind: 'parent',
      code: 'H',
      particulars: 'Net Profit After Tax',
      formula: 'F-G',
      order: 22,
    },
  ],
  updatedAt: new Date().toISOString(),
};

// ─── DEFAULT SUMMARY ──────────────────────────────────────
export const DEFAULT_SUMMARY: ISCustomization = {
  reportType: 'Summary',
  reportTitle: 'Statement of Summary Income',
  rows: [
    {
      id: 's1',
      kind: 'parent',
      code: 'A',
      particulars: 'Income',
      formula: '1+2+3',
      order: 0,
    },
    {
      id: 's2',
      kind: 'child',
      code: '1',
      particulars: 'Sales Revenue',
      parentCode: 'A',
      order: 1,
    },
    {
      id: 's3',
      kind: 'child',
      code: '2',
      particulars: 'Exchange Gain/Loss',
      parentCode: 'A',
      order: 2,
    },
    {
      id: 's4',
      kind: 'child',
      code: '3',
      particulars: 'Revenue from Scraps/Wastage Sales',
      parentCode: 'A',
      order: 3,
    },

    {
      id: 's5',
      kind: 'parent',
      code: 'B',
      particulars: 'Expenses',
      formula: '4+5+6+7',
      order: 4,
    },
    {
      id: 's6',
      kind: 'child',
      code: '4',
      particulars: 'Cost of Goods',
      parentCode: 'B',
      order: 5,
    },
    {
      id: 's7',
      kind: 'child',
      code: '5',
      particulars: 'Administrative Expenses',
      parentCode: 'B',
      order: 6,
    },
    {
      id: 's8',
      kind: 'child',
      code: '6',
      particulars: 'Selling and Distribution Expenses',
      parentCode: 'B',
      order: 7,
    },
    {
      id: 's9',
      kind: 'child',
      code: '7',
      particulars: 'Financial Expenses',
      parentCode: 'B',
      order: 8,
    },

    {
      id: 's10',
      kind: 'parent',
      code: 'C',
      particulars: 'Net Profit Before Tax',
      formula: 'A-B',
      order: 9,
    },
  ],
  updatedAt: new Date().toISOString(),
};

// ─── SHEET2 MASTER LIST (grouped) ─────────────────────────
// This drives the Particulars dropdown AND the Add Line (List) modal.
export const MASTER_LIST: MasterListItem[] = [
  // Section 1
  {
    id: 'sec-1',
    section: 'Income - Operating Income',
    label: 'Income - Operating Income',
    isSectionHeader: true,
  },
  {
    id: 'm1',
    section: 'Income - Operating Income',
    label: 'Sales Revenue',
    isSectionHeader: false,
  },
  {
    id: 'm2',
    section: 'Income - Operating Income',
    label: 'Service Revenue',
    isSectionHeader: false,
  },
  {
    id: 'm3',
    section: 'Income - Operating Income',
    label: 'Others Operating Income',
    isSectionHeader: false,
  },

  // Section 2
  {
    id: 'sec-2',
    section: 'Income - Non-Operating Income',
    label: 'Income - Non-Operating Income',
    isSectionHeader: true,
  },
  {
    id: 'm4',
    section: 'Income - Non-Operating Income',
    label: 'Exchange Gain/Loss',
    isSectionHeader: false,
  },
  {
    id: 'm5',
    section: 'Income - Non-Operating Income',
    label: 'Revenue from Scraps/Wastage Sales',
    isSectionHeader: false,
  },
  {
    id: 'm6',
    section: 'Income - Non-Operating Income',
    label: 'Others Non-Operating Income',
    isSectionHeader: false,
  },

  // Section 3
  {
    id: 'sec-3',
    section: 'Expenses - Direct Expenses',
    label: 'Expenses - Direct Expenses',
    isSectionHeader: true,
  },
  {
    id: 'm7',
    section: 'Expenses - Direct Expenses',
    label: 'Cost of Revenue (Details Req.)',
    isSectionHeader: false,
  },
  {
    id: 'm8',
    section: 'Expenses - Direct Expenses',
    label: 'Depreciation Direct',
    isSectionHeader: false,
  },
  {
    id: 'm9',
    section: 'Expenses - Direct Expenses',
    label: 'Others Direct Expenses',
    isSectionHeader: false,
  },

  // Section 4
  {
    id: 'sec-4',
    section: 'Expenses - Indirect Expenses',
    label: 'Expenses - Indirect Expenses',
    isSectionHeader: true,
  },
  {
    id: 'm10',
    section: 'Expenses - Indirect Expenses',
    label: 'Administrative Expenses',
    isSectionHeader: false,
  },
  {
    id: 'm11',
    section: 'Expenses - Indirect Expenses',
    label: 'Selling and Distribution Expenses',
    isSectionHeader: false,
  },
  {
    id: 'm12',
    section: 'Expenses - Indirect Expenses',
    label: 'Financial Expenses',
    isSectionHeader: false,
  },
  {
    id: 'm13',
    section: 'Expenses - Indirect Expenses',
    label: 'Depreciation Indirect',
    isSectionHeader: false,
  },
  {
    id: 'm14',
    section: 'Expenses - Indirect Expenses',
    label: 'Others Indirect Expenses',
    isSectionHeader: false,
  },

  // Section 5
  {
    id: 'sec-5',
    section: 'Income Tax',
    label: 'Income Tax',
    isSectionHeader: true,
  },
  {
    id: 'm15',
    section: 'Income Tax',
    label: 'Income Tax',
    isSectionHeader: false,
  },
];

// Parent-preset labels (used for parent Particulars dropdown / combobox)
export const PARENT_PRESETS: string[] = [
  'Operating Income',
  'Less Cost of Goods',
  'Gross Profit',
  'Add Non Operating Income',
  'Less Indirect Expenses',
  'Net Profit Before Tax',
  'Less Tax',
  'Net Profit After Tax',
  'Income',
  'Expenses',
];
