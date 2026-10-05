import { create } from 'zustand';
import { Bank } from '../types/bank';
import { listBanks, createBank } from '../services/bankService';

interface BankStore {
  banks: Bank[];
  loading: boolean;
  loadBanks: () => Promise<void>;
  addBank: (p: { name: string; alias: string }) => Promise<Bank>;
}

export const useBankStore = create<BankStore>((set, get) => ({
  banks: [],
  loading: false,

  loadBanks: async () => {
    set({ loading: true });
    try {
      const data = await listBanks();
      set({ banks: data, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  addBank: async (p: { name: string; alias: string }) => {
    const created = await createBank(p);
    const current = get().banks;
    set({ banks: [...current, created] });
    return created;
  },
}));
