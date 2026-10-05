export interface Supplier {
  id: string;
  name: string;
  shortName?: string;
  phone?: string;
}

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'BD Com', shortName: 'BDC' },
  { id: 'sup-2', name: 'Partex Tissue Ltd.', shortName: 'PTL' },
  { id: 'sup-3', name: 'Aramit Cement Ltd.', shortName: 'ACL' },
  { id: 'sup-4', name: 'Next Sourc Ltd.', shortName: 'NST' },
];
