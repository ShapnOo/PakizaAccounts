export type SubledgerType =
  | 'cost-center'
  | 'reference-center'
  | 'vehicle';

export interface SubledgerEntry {
  id: string;
  type: SubledgerType;
  name: string;
  effectiveCompanyIds: string[]; // "PSL" | "PKCL" | ...
  activeStatus: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  shortCode?: string;
}

export interface SubledgerConfig {
  label: string; // tab label e.g. "Cost Center"
  singular: string; // "Cost Center"
  nameColumnLabel: string; // "Cost Center Name"
  routeSlug: SubledgerType; // "cost-center"
  description: string;
}

export const SUBLEDGER_CONFIG: Record<SubledgerType, SubledgerConfig> = {
  'cost-center': {
    label: 'Cost Center',
    singular: 'Cost Center',
    nameColumnLabel: 'Cost Center Name',
    routeSlug: 'cost-center',
    description: 'Manage departmental, operational, and mill cost distribution centers.',
  },
  'reference-center': {
    label: 'Reference Center',
    singular: 'Reference Center',
    nameColumnLabel: 'Reference Center',
    routeSlug: 'reference-center',
    description: 'Manage tracking reference codes, project IDs, and audit centers.',
  },
  'vehicle': {
    label: 'Vehicles',
    singular: 'Vehicle',
    nameColumnLabel: 'Vehicles',
    routeSlug: 'vehicle',
    description: 'Manage company transport fleet, commercial trucks, and staff vans.',
  },
};

export const SUBLEDGER_TABS: SubledgerType[] = [
  'cost-center',
  'reference-center',
  'vehicle',
];
