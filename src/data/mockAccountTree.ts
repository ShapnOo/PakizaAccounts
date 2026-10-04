import { AccountNode } from '../types/config';

export const mockAccountTree: AccountNode[] = [
  {
    id: '1000',
    code: '1000',
    name: '1000 - Current Assets',
    type: 'Asset',
    isSelectable: false,
    children: [
      {
        id: '1010',
        code: '1010',
        name: '1010 - Cash & Bank Balances',
        type: 'Asset',
        isSelectable: false,
        children: [
          { id: '1011', code: '1011', name: '1011 - Cash in Hand', type: 'Asset', isSelectable: true },
          { id: '1012', code: '1012', name: '1012 - Dutch Bangla Bank Ltd (A/C: 110-120-4321)', type: 'Asset', isSelectable: true },
          { id: '1013', code: '1013', name: '1013 - Eastern Bank PLC (A/C: 104-100-8899)', type: 'Asset', isSelectable: true },
          { id: '1014', code: '1014', name: '1014 - Standard Chartered Bank (A/C: 01-234567-01)', type: 'Asset', isSelectable: true },
        ],
      },
      {
        id: '1020',
        code: '1020',
        name: '1020 - Trade Debtors (Accounts Receivable)',
        type: 'Asset',
        isSelectable: false,
        children: [
          { id: '1021', code: '1021', name: '1021 - Accounts Receivable (Domestic Customers)', type: 'Asset', isSelectable: true },
          { id: '1022', code: '1022', name: '1022 - Accounts Receivable (Foreign Customers)', type: 'Asset', isSelectable: true },
          { id: '1023', code: '1023', name: '1023 - Accounts Receivable (Corporate Retail)', type: 'Asset', isSelectable: true },
        ],
      },
      {
        id: '1030',
        code: '1030',
        name: '1030 - Advances, Deposits & Prepayments',
        type: 'Asset',
        isSelectable: false,
        children: [
          { id: '1031', code: '1031', name: '1031 - Advance Payment to Suppliers & Contractors', type: 'Asset', isSelectable: true },
          { id: '1032', code: '1032', name: '1032 - Advance Salary & Employee Loans', type: 'Asset', isSelectable: true },
          { id: '1033', code: '1033', name: '1033 - Advance Rent & Utilities', type: 'Asset', isSelectable: true },
        ],
      },
    ],
  },
  {
    id: '2000',
    code: '2000',
    name: '2000 - Current Liabilities',
    type: 'Liability',
    isSelectable: false,
    children: [
      {
        id: '2010',
        code: '2010',
        name: '2010 - Trade Creditors (Accounts Payable)',
        type: 'Liability',
        isSelectable: false,
        children: [
          { id: '2011', code: '2011', name: '2011 - Accounts Payable (Local Raw Material Suppliers)', type: 'Liability', isSelectable: true },
          { id: '2012', code: '2012', name: '2012 - Accounts Payable (Import & Foreign Vendors)', type: 'Liability', isSelectable: true },
          { id: '2013', code: '2013', name: '2013 - Accounts Payable (Service & Utility Providers)', type: 'Liability', isSelectable: true },
        ],
      },
      {
        id: '2020',
        code: '2020',
        name: '2020 - Advance From Customers (Liabilities)',
        type: 'Liability',
        isSelectable: false,
        children: [
          { id: '2021', code: '2021', name: '2021 - Advance Received from Customers (Pre-Orders)', type: 'Liability', isSelectable: true },
          { id: '2022', code: '2022', name: '2022 - Unearned Corporate Retainers', type: 'Liability', isSelectable: true },
        ],
      },
    ],
  },
];

export function findAccountById(id: string | null, nodes: AccountNode[] = mockAccountTree): AccountNode | null {
  if (!id) return null;
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findAccountById(id, node.children);
      if (found) return found;
    }
  }
  return null;
}
