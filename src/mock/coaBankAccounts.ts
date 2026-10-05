import { INITIAL_ACCOUNTS } from './accounts';

export interface CoaBankAccount {
  id: string;
  accountName: string;
  accountsType: string;
  accountsNumber: string;
  bankName: string;
  parentPath: string[];
}

export const MOCK_COA_BANK_ACCOUNTS: CoaBankAccount[] = [
  {
    id: 'acc-01-01-01-02-01-01',
    accountName: 'DBBL-100001122',
    accountsType: 'CD',
    accountsNumber: '100001122',
    bankName: 'Dutch Bangla Bank Lt.',
    parentPath: [
      'Assets',
      'Current Assets',
      'Cash & Cash Equivalent',
      'Cash at Bank',
      'Cash at Bank BDT',
      'Cash at Bank DBBL',
    ],
  },
  {
    id: 'acc-01-01-01-02-01-02',
    accountName: 'Cash at Bank MTB',
    accountsType: 'CD',
    accountsNumber: '200004455',
    bankName: 'Mutual Trust Bank Ltd.',
    parentPath: [
      'Assets',
      'Current Assets',
      'Cash & Cash Equivalent',
      'Cash at Bank',
      'Cash at Bank BDT',
      'Cash at Bank MTB',
    ],
  },
  {
    id: 'acc-01-01-01-02-02-01',
    accountName: 'Cash at Bank FC - USD EBL',
    accountsType: 'SB',
    accountsNumber: '300009988',
    bankName: 'Eastern Bank Ltd.',
    parentPath: [
      'Assets',
      'Current Assets',
      'Cash & Cash Equivalent',
      'Cash at Bank',
      'Cash at Bank FC',
    ],
  },
  {
    id: 'acc-01-01-01-02-02-02',
    accountName: 'Cash at Bank FC - EUR BRAC',
    accountsType: 'CD',
    accountsNumber: '400001177',
    bankName: 'BRAC Bank Ltd.',
    parentPath: [
      'Assets',
      'Current Assets',
      'Cash & Cash Equivalent',
      'Cash at Bank',
      'Cash at Bank FC',
    ],
  },
];
