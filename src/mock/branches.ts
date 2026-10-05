import { Branch } from '../types/bank';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'br-1',
    bankId: 'bank-dbbl',
    bankName: 'Dutch Bangla Bank Lt.',
    bankAlias: 'DBBL',
    branchName: 'Shatmoshjid Road',
    address: 'Dhanmondi, Dhaka',
    routingNo: '090271891',
    swiftCode: 'DBBLBDDH',
    accounts: [
      {
        id: 'acc-ref-1',
        coaAccountId: 'acc-01-01-01-02-01-01',
        accountsType: 'CD',
        accountsNumber: '100001122',
        accountsName: 'DBBL-100001122',
      },
    ],
    createdAt: '2026-09-05T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
  },
  {
    id: 'br-2',
    bankId: 'bank-mtb',
    bankName: 'Mutual Trust Bank Ltd.',
    bankAlias: 'MTB',
    branchName: 'Principal Branch',
    address: 'Dilkusha C/A, Motijheel, Dhaka',
    routingNo: '145260193',
    swiftCode: 'MTBLBDDH',
    accounts: [
      {
        id: 'acc-ref-2',
        coaAccountId: 'acc-01-01-01-02-01-02',
        accountsType: 'CD',
        accountsNumber: '200004455',
        accountsName: 'Cash at Bank MTB',
      },
    ],
    createdAt: '2026-09-08T00:00:00Z',
    updatedAt: '2026-09-08T00:00:00Z',
  },
  {
    id: 'br-3',
    bankId: 'bank-brac',
    bankName: 'BRAC Bank Ltd.',
    bankAlias: 'BRAC',
    branchName: 'Gulshan 1 Branch',
    address: 'Gulshan Avenue, Dhaka',
    routingNo: '060261120',
    swiftCode: 'BRAKBDDH',
    accounts: [],
    createdAt: '2026-09-12T00:00:00Z',
    updatedAt: '2026-09-12T00:00:00Z',
  },
];
