import { create } from 'zustand';
import { CustomerGroup } from '../types/customer';
import { listCustomerGroups, createCustomerGroup } from '../services/customerGroupService';

interface CustomerStore {
  groups: CustomerGroup[];
  loading: boolean;
  saving: boolean;
  dirty: boolean;

  setDirty: (val: boolean) => void;
  loadGroups: () => Promise<void>;
  addGroup: (name: string) => Promise<CustomerGroup>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  groups: [],
  loading: false,
  saving: false,
  dirty: false,

  setDirty: (val: boolean) => set({ dirty: val }),

  loadGroups: async () => {
    set({ loading: true });
    try {
      const groups = await listCustomerGroups();
      set({ groups, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  addGroup: async (name: string) => {
    set({ saving: true });
    try {
      const newGroup = await createCustomerGroup(name);
      const current = get().groups;
      if (!current.some((g) => g.id === newGroup.id)) {
        set({ groups: [...current, newGroup], saving: false });
      } else {
        set({ saving: false });
      }
      return newGroup;
    } catch (e) {
      set({ saving: false });
      throw e;
    }
  },
}));
