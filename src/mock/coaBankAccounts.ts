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
    accountName: 'DBBL-100001122 (Principal CD)',
    accountsType: 'CD',
    accountsNumber: '100001122',
    bankName: 'Dutch Bangla Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'DBBL'],
  },
  {
    id: 'acc-01-01-01-02-01-02',
    accountName: 'Cash at Bank MTB (200004455)',
    accountsType: 'CD',
    accountsNumber: '200004455',
    bankName: 'Mutual Trust Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'MTB'],
  },
  {
    id: 'acc-01-01-01-02-01-03',
    accountName: 'SCB USD Export Quota (01889920101)',
    accountsType: 'FC',
    accountsNumber: '01889920101',
    bankName: 'Standard Chartered Bank',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank FC', 'SCB'],
  },
  {
    id: 'acc-01-01-01-02-01-04',
    accountName: 'BRAC Corporate Current (15012099384)',
    accountsType: 'CD',
    accountsNumber: '15012099384',
    bankName: 'BRAC Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'BRAC'],
  },
  {
    id: 'acc-01-01-01-02-01-05',
    accountName: 'EBL Factory Operations (10110488291)',
    accountsType: 'CD',
    accountsNumber: '10110488291',
    bankName: 'Eastern Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'EBL'],
  },
  {
    id: 'acc-01-01-01-02-01-06',
    accountName: 'City Bank Tax & Utility (11029384710)',
    accountsType: 'CD',
    accountsNumber: '11029384710',
    bankName: 'The City Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'City Bank'],
  },
  {
    id: 'acc-01-01-01-02-01-07',
    accountName: 'Prime Bank Import Margin (21192837401)',
    accountsType: 'CD',
    accountsNumber: '21192837401',
    bankName: 'Prime Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'Prime Bank'],
  },
  {
    id: 'acc-01-01-01-02-01-08',
    accountName: 'UCB Corporate Operational (09511010002)',
    accountsType: 'CD',
    accountsNumber: '09511010002',
    bankName: 'United Commercial Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'UCB'],
  },
  {
    id: 'acc-01-01-01-02-01-09',
    accountName: 'Bank Asia Trade Clearing (03311002938)',
    accountsType: 'CD',
    accountsNumber: '03311002938',
    bankName: 'Bank Asia Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'Bank Asia'],
  },
  {
    id: 'acc-01-01-01-02-01-10',
    accountName: 'Trust Bank Logistics (00210210091)',
    accountsType: 'CD',
    accountsNumber: '00210210091',
    bankName: 'Trust Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'Trust Bank'],
  },
  {
    id: 'acc-01-01-01-02-01-11',
    accountName: 'HSBC Global Cash USD (00192837409)',
    accountsType: 'FC',
    accountsNumber: '00192837409',
    bankName: 'HSBC Bangladesh',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank FC', 'HSBC'],
  },
  {
    id: 'acc-01-01-01-02-01-12',
    accountName: 'Dhaka Bank Capex & Project (20110029384)',
    accountsType: 'CD',
    accountsNumber: '20110029384',
    bankName: 'Dhaka Bank Ltd.',
    parentPath: ['Assets', 'Current Assets', 'Cash & Cash Equivalent', 'Cash at Bank', 'Dhaka Bank'],
  },
];
