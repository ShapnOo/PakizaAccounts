export interface GLTransactionLine {
  id: string;
  voucherNo: string;
  voucherType: 'Journal' | 'Receive' | 'Payment' | 'Contra';
  date: string;
  accountsHead: string; // e.g. "Accounts Payable", "Cash in Hand", etc.
  subsidiary: string; // e.g. "Partex Tissue Ltd.", etc.
  oppositeAccount?: string; // Opposite double-entry account e.g. "Islami Bank Ltd.", "Office Supplies"
  costCenter: string;
  employee: string;
  vehicle: string;
  reference: string;
  narration: string;
  currency: string;
  debit: number;
  credit: number;
  amount: number;
  balance?: number;
}

export interface GLAccountSummary {
  accountsHead: string;
  accountCode: string;
  subsidiary: string;
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  children?: GLAccountSummary[];
  lines?: GLTransactionLine[];
}

export const MOCK_GL_LINES: GLTransactionLine[] = [
  // AP - Partex Tissue Ltd. lines (matches seed filter condition!)
  {
    id: 'gl-01',
    voucherNo: 'JV-2026-0042',
    voucherType: 'Journal',
    date: '2026-03-01',
    accountsHead: 'Accounts Payable',
    subsidiary: 'Partex Tissue Ltd.',
    oppositeAccount: 'Office Supplies & Stationery',
    costCenter: 'Head Office (Dhaka)',
    employee: 'Riazul Islam',
    vehicle: 'Dhaka Metro-GA-11-2041 (Toyota Hiace)',
    reference: 'INV-PT-9801',
    narration: 'Office paper & tissue consumable procurement',
    currency: 'BDT',
    debit: 0,
    credit: 85000,
    amount: 85000,
  },
  {
    id: 'gl-02',
    voucherNo: 'PV-2026-0118',
    voucherType: 'Payment',
    date: '2026-03-05',
    accountsHead: 'Accounts Payable',
    subsidiary: 'Partex Tissue Ltd.',
    oppositeAccount: 'Islami Bank Bangladesh Ltd.',
    costCenter: 'Head Office (Dhaka)',
    employee: 'Farzana Akter',
    vehicle: 'Dhaka Metro-GA-11-2041 (Toyota Hiace)',
    reference: 'CHQ-772019',
    narration: 'Partial payment against invoice INV-PT-9801',
    currency: 'BDT',
    debit: 45000,
    credit: 0,
    amount: 45000,
  },
  {
    id: 'gl-03',
    voucherNo: 'JV-2026-0089',
    voucherType: 'Journal',
    date: '2026-03-12',
    accountsHead: 'Accounts Payable',
    subsidiary: 'Partex Tissue Ltd.',
    oppositeAccount: 'Factory Consumable Stores',
    costCenter: 'Factory Unit-1 (Dhamrai)',
    employee: 'Kamrul Hasan',
    vehicle: 'Dhaka Metro-CHA-53-9012 (Delivery Covered Van)',
    reference: 'INV-PT-9940',
    narration: 'Bulk hygiene tissue supply for Dhamrai plant',
    currency: 'BDT',
    debit: 0,
    credit: 120000,
    amount: 120000,
  },
  {
    id: 'gl-04',
    voucherNo: 'PV-2026-0164',
    voucherType: 'Payment',
    date: '2026-03-20',
    accountsHead: 'Accounts Payable',
    subsidiary: 'Partex Tissue Ltd.',
    oppositeAccount: 'Eastern Bank PLC',
    costCenter: 'Factory Unit-1 (Dhamrai)',
    employee: 'Tahmid Afsar',
    vehicle: 'Dhaka Metro-CHA-53-9012 (Delivery Covered Van)',
    reference: 'CHQ-772150',
    narration: 'Settlement cheque for industrial supplies',
    currency: 'BDT',
    debit: 90000,
    credit: 0,
    amount: 90000,
  },

  // Other AP lines for different vendors
  {
    id: 'gl-05',
    voucherNo: 'JV-2026-0033',
    voucherType: 'Journal',
    date: '2026-03-02',
    accountsHead: 'Accounts Payable',
    subsidiary: 'Square Pharmaceuticals Ltd.',
    oppositeAccount: 'Raw Materials - Chemicals',
    costCenter: 'Factory Unit-1 (Dhamrai)',
    employee: 'Kamrul Hasan',
    vehicle: 'Dhaka Metro-GHA-22-1099 (Prime Mover)',
    reference: 'INV-SQ-102',
    narration: 'Industrial chemical supplies',
    currency: 'BDT',
    debit: 0,
    credit: 340000,
    amount: 340000,
  },
  {
    id: 'gl-06',
    voucherNo: 'PV-2026-0105',
    voucherType: 'Payment',
    date: '2026-03-10',
    accountsHead: 'Accounts Payable',
    subsidiary: 'Square Pharmaceuticals Ltd.',
    oppositeAccount: 'Standard Chartered Bank',
    costCenter: 'Factory Unit-1 (Dhamrai)',
    employee: 'Riazul Islam',
    vehicle: 'Dhaka Metro-GHA-22-1099 (Prime Mover)',
    reference: 'CHQ-88012',
    narration: 'Bank settlement for chemical supplies',
    currency: 'BDT',
    debit: 200000,
    credit: 0,
    amount: 200000,
  },

  // Accounts Receivable lines
  {
    id: 'gl-07',
    voucherNo: 'RV-2026-0012',
    voucherType: 'Receive',
    date: '2026-03-04',
    accountsHead: 'Accounts Receivable',
    subsidiary: 'Apex Footwear Ltd.',
    oppositeAccount: 'City Bank Ltd. (Foreign Branch)',
    costCenter: 'Garments Division',
    employee: 'Tanvir Hossain',
    vehicle: 'Dhaka Metro-LA-19-4501 (Director Car)',
    reference: 'MR-90021',
    narration: 'Collection against export batch shipment',
    currency: 'BDT',
    debit: 150000,
    credit: 0,
    amount: 150000,
  },
  {
    id: 'gl-08',
    voucherNo: 'JV-2026-0102',
    voucherType: 'Journal',
    date: '2026-03-14',
    accountsHead: 'Accounts Receivable',
    subsidiary: 'Apex Footwear Ltd.',
    oppositeAccount: 'Fabric Processing Revenue',
    costCenter: 'Garments Division',
    employee: 'Tanvir Hossain',
    vehicle: 'Dhaka Metro-LA-19-4501 (Director Car)',
    reference: 'INV-AF-4001',
    narration: 'Billing for fabric processing job order',
    currency: 'BDT',
    debit: 0,
    credit: 210000,
    amount: 210000,
  },

  // Cash / Bank entries
  {
    id: 'gl-09',
    voucherNo: 'CV-2026-0005',
    voucherType: 'Contra',
    date: '2026-03-08',
    accountsHead: 'Cash in Hand',
    subsidiary: 'General Utilities Corporation',
    oppositeAccount: 'Dutch-Bangla Bank Ltd.',
    costCenter: 'Head Office (Dhaka)',
    employee: 'Farzana Akter',
    vehicle: 'Dhaka Metro-GA-11-2041 (Toyota Hiace)',
    reference: 'CASH-W-01',
    narration: 'Cash withdrawal for petty cash float',
    currency: 'BDT',
    debit: 50000,
    credit: 0,
    amount: 50000,
  },
  {
    id: 'gl-10',
    voucherNo: 'PV-2026-0210',
    voucherType: 'Payment',
    date: '2026-03-18',
    accountsHead: 'Printing & Stationery',
    subsidiary: 'Partex Tissue Ltd.',
    oppositeAccount: 'Petty Cash Float',
    costCenter: 'Head Office (Dhaka)',
    employee: 'Ayesha Khatun',
    vehicle: 'Dhaka Metro-GA-11-2041 (Toyota Hiace)',
    reference: 'CSH-V-12',
    narration: 'Direct stationery purchases',
    currency: 'BDT',
    debit: 12500,
    credit: 0,
    amount: 12500,
  },
];

export const MOCK_GL_TREE_DATA: GLAccountSummary[] = [
  {
    accountsHead: 'Current Liabilities',
    accountCode: '020100000000',
    subsidiary: 'Consolidated',
    openingBalance: 420000,
    totalDebit: 335000,
    totalCredit: 545000,
    closingBalance: 630000,
    children: [
      {
        accountsHead: 'Accounts Payable',
        accountCode: '020101000000',
        subsidiary: 'Partex Tissue Ltd.',
        openingBalance: 25000,
        totalDebit: 135000,
        totalCredit: 205000,
        closingBalance: 95000,
      },
      {
        accountsHead: 'Accounts Payable',
        accountCode: '020101000000',
        subsidiary: 'Square Pharmaceuticals Ltd.',
        openingBalance: 150000,
        totalDebit: 200000,
        totalCredit: 340000,
        closingBalance: 290000,
      },
    ],
  },
  {
    accountsHead: 'Current Assets',
    accountCode: '010100000000',
    subsidiary: 'Consolidated',
    openingBalance: 880000,
    totalDebit: 200000,
    totalCredit: 210000,
    closingBalance: 870000,
    children: [
      {
        accountsHead: 'Accounts Receivable',
        accountCode: '010103000000',
        subsidiary: 'Apex Footwear Ltd.',
        openingBalance: 320000,
        totalDebit: 150000,
        totalCredit: 210000,
        closingBalance: 260000,
      },
      {
        accountsHead: 'Cash in Hand',
        accountCode: '010101010000',
        subsidiary: 'General Utilities Corporation',
        openingBalance: 120000,
        totalDebit: 50000,
        totalCredit: 0,
        closingBalance: 170000,
      },
    ],
  },
];
