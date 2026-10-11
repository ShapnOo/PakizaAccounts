import { AdvanceFilterState } from '../types/advanceFilter';

export const DEFAULT_ADVANCE_FILTER: AdvanceFilterState = {
  combinator: 'AND',
  conditions: [
    {
      id: 'c1',
      fieldKey: 'accountsHead',
      operator: 'is',
      value: 'Accounts Payable',
    },
    {
      id: 'c2',
      fieldKey: 'subsidiary',
      operator: 'is',
      value: 'Partex Tissue Ltd.',
    },
  ],
  collapsed: false,
};
