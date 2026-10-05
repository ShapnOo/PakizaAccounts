import { create } from 'zustand';
import { PreparedCheque } from '../types/cheque';
import {
  listPreparedCheques,
  createPreparedCheque,
  voidPreparedCheque,
} from '../services/preparedChequeService';

interface PreparedChequeState {
  prepared: PreparedCheque[];
  loading: boolean;
  loadPrepared: () => Promise<void>;
  addPrepared: (payload: Omit<PreparedCheque, 'id' | 'createdAt'>) => Promise<PreparedCheque>;
  voidCheque: (id: string) => Promise<void>;
}

export const usePreparedChequeStore = create<PreparedChequeState>((set) => ({
  prepared: [],
  loading: false,

  loadPrepared: async () => {
    set({ loading: true });
    try {
      const data = await listPreparedCheques();
      set({ prepared: data });
    } finally {
      set({ loading: false });
    }
  },

  addPrepared: async (payload) => {
    const created = await createPreparedCheque(payload);
    set((state) => ({ prepared: [created, ...state.prepared] }));
    return created;
  },

  voidCheque: async (id) => {
    await voidPreparedCheque(id);
    set((state) => ({
      prepared: state.prepared.filter((p) => p.id !== id),
    }));
  },
}));
