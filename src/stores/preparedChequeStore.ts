import { create } from 'zustand';
import { ChequePrepare } from '../types/chequePrepare';
import {
  listPreparedCheques,
  createPreparedCheque,
  voidPreparedCheque,
  getPreparedCheque,
} from '../services/preparedChequeService';

interface PreparedChequeState {
  prepared: ChequePrepare[];
  loading: boolean;
  saving: boolean;
  load: () => Promise<void>;
  loadPrepared: () => Promise<void>;
  add: (payload: Omit<ChequePrepare, 'id' | 'createdAt'>) => Promise<ChequePrepare>;
  addPrepared: (payload: Omit<ChequePrepare, 'id' | 'createdAt'>) => Promise<ChequePrepare>;
  getById: (id: string) => Promise<ChequePrepare | null>;
  voidCheque: (id: string) => Promise<void>;
  update: (id: string, updates: Partial<ChequePrepare>) => Promise<ChequePrepare>;
}

export const usePreparedChequeStore = create<PreparedChequeState>((set, get) => ({
  prepared: [],
  loading: false,
  saving: false,

  load: async () => {
    set({ loading: true });
    try {
      const data = await listPreparedCheques();
      set({ prepared: data });
    } finally {
      set({ loading: false });
    }
  },

  loadPrepared: async () => {
    return get().load();
  },

  add: async (payload) => {
    set({ saving: true });
    try {
      const created = await createPreparedCheque(payload);
      set((state) => ({ prepared: [created, ...state.prepared] }));
      return created;
    } finally {
      set({ saving: false });
    }
  },

  addPrepared: async (payload) => {
    return get().add(payload);
  },

  getById: async (id: string) => {
    const existing = get().prepared.find((p) => p.id === id);
    if (existing) return existing;
    return getPreparedCheque(id);
  },

  voidCheque: async (id) => {
    await voidPreparedCheque(id);
    set((state) => ({
      prepared: state.prepared.filter((p) => p.id !== id),
    }));
  },

  update: async (id, updates) => {
    const { updatePreparedCheque } = await import('../services/preparedChequeService');
    const updated = await updatePreparedCheque(id, updates);
    set((state) => ({
      prepared: state.prepared.map((p) => (p.id === id ? updated : p)),
    }));
    return updated;
  },
}));

export const useChequePrepareStore = usePreparedChequeStore;
