import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubledgerEntry, SubledgerType, SUBLEDGER_CONFIG } from '../types/subledger';
import {
  listSubledger,
  createSubledger,
  updateSubledger,
  deleteSubledger,
  checkSubledgerUsage,
} from '../services/subledgerService';
import { toast } from 'sonner';

export interface SubledgerStoreState {
  entries: SubledgerEntry[];
  loading: boolean;
  activeTab: SubledgerType;
  searchQuery: string;
  statusFilter: 'All' | 'Active' | 'Inactive';
  companyFilter: string[];
  density: 'comfortable' | 'compact';

  load: () => Promise<void>;
  add: (payload: Omit<SubledgerEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SubledgerEntry>;
  update: (id: string, patch: Partial<SubledgerEntry>) => Promise<SubledgerEntry>;
  remove: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  setActiveTab: (tab: SubledgerType) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (status: 'All' | 'Active' | 'Inactive') => void;
  setCompanyFilter: (companies: string[]) => void;
  setDensity: (density: 'comfortable' | 'compact') => void;
}

export const useSubledgerStore = create<SubledgerStoreState>()(
  persist(
    (set, get) => ({
      entries: [],
      loading: true,
      activeTab: 'cost-center',
      searchQuery: '',
      statusFilter: 'All',
      companyFilter: [],
      density: 'comfortable',

      load: async () => {
        set({ loading: true });
        try {
          const loaded = await listSubledger();
          set({ entries: loaded, loading: false });
        } catch (err) {
          console.error('Failed to load subledger records', err);
          set({ loading: false });
        }
      },

      add: async (payload) => {
        try {
          const created = await createSubledger(payload);
          set((state) => ({
            entries: [created, ...state.entries],
          }));
          const singular = SUBLEDGER_CONFIG[payload.type]?.singular || 'Record';
          toast.success(`${singular} "${created.name}" created successfully`);
          return created;
        } catch (err: any) {
          toast.error(err.message || 'Failed to create subledger record');
          throw err;
        }
      },

      update: async (id, patch) => {
        try {
          const updated = await updateSubledger(id, patch);
          set((state) => ({
            entries: state.entries.map((e) => (e.id === id ? updated : e)),
          }));
          const singular = SUBLEDGER_CONFIG[updated.type]?.singular || 'Record';
          toast.success(`${singular} "${updated.name}" updated successfully`);
          return updated;
        } catch (err: any) {
          toast.error(err.message || 'Failed to update subledger record');
          throw err;
        }
      },

      remove: async (id) => {
        const item = get().entries.find((e) => e.id === id);
        const singular = item ? SUBLEDGER_CONFIG[item.type]?.singular : 'Subledger';
        
        // Safety check if referenced
        const usageCount = await checkSubledgerUsage(id);
        if (usageCount > 0) {
          toast.error(`Cannot delete ${singular}: It is actively used in ${usageCount} transaction line(s).`);
          throw new Error(`Referenced record cannot be deleted`);
        }

        try {
          await deleteSubledger(id);
          set((state) => ({
            entries: state.entries.filter((e) => e.id !== id),
          }));
          toast.success(`${singular} deleted successfully`);
        } catch (err: any) {
          toast.error(err.message || 'Failed to delete record');
          throw err;
        }
      },

      toggleActive: async (id) => {
        const item = get().entries.find((e) => e.id === id);
        if (!item) return;

        const nextStatus: 'Active' | 'Inactive' = item.activeStatus === 'Active' ? 'Inactive' : 'Active';
        const singular = SUBLEDGER_CONFIG[item.type]?.singular || 'Record';

        // Optimistic update
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, activeStatus: nextStatus } : e
          ),
        }));

        try {
          await updateSubledger(id, { activeStatus: nextStatus });
          toast.success(
            `${singular} status set to ${nextStatus}`,
            { duration: 2000 }
          );
        } catch (err: any) {
          // Rollback on error
          set((state) => ({
            entries: state.entries.map((e) =>
              e.id === id ? { ...e, activeStatus: item.activeStatus } : e
            ),
          }));
          toast.error('Failed to change status. Reverting change.');
        }
      },

      setActiveTab: (activeTab) => set({ activeTab }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setCompanyFilter: (companyFilter) => set({ companyFilter }),
      setDensity: (density) => set({ density }),
    }),
    {
      name: 'subledger:store',
      partialize: (state) => ({
        density: state.density,
      }),
    }
  )
);

// Derived Selectors
export const selectByType = (entries: SubledgerEntry[], type: SubledgerType): SubledgerEntry[] => {
  return entries.filter((e) => e.type === type);
};

export const selectActiveCount = (entries: SubledgerEntry[], type: SubledgerType): number => {
  return entries.filter((e) => e.type === type && e.activeStatus === 'Active').length;
};

export const selectTotalCount = (entries: SubledgerEntry[], type: SubledgerType): number => {
  return entries.filter((e) => e.type === type).length;
};
