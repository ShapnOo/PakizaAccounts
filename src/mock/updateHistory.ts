import { UpdateHistoryRow } from '../types/bulk';

export const MOCK_UPDATE_HISTORY: UpdateHistoryRow[] = [
  {
    id: 'uh-1',
    updateDate: '2026-10-03T10:00:00Z',
    description: 'Accounts Update: Advance to Employee to Advance Supplier',
    noOfData: 5,
    userName: 'Riazul Islam',
    status: 'Complete',
    affectedVoucherNos: ['JV2600001', 'JV2600002', 'JV2600003', 'JV2600004', 'JV2600005'],
  },
  {
    id: 'uh-2',
    updateDate: '2026-09-30T14:40:00Z',
    description: 'Cost Center Update: Head Office to Spinning Mill Unit-1',
    noOfData: 8,
    userName: 'Ayesha Khatun',
    status: 'Complete',
    affectedVoucherNos: ['JV2600006', 'JV2600007', 'PV2600012', 'PV2600013'],
  },
  {
    id: 'uh-3',
    updateDate: '2026-09-25T11:15:00Z',
    description: 'Subsidiary Update: General Vendor to Square Yarns Ltd',
    noOfData: 12,
    userName: 'Tanvir Ahmed',
    status: 'Complete',
    affectedVoucherNos: ['PV2600018', 'PV2600019', 'PV2600020'],
  },
];
