import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecurringProfile, VoucherType, Cadence } from '../types/recurringJournal';
import {
  listProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  toggleActiveProfile,
  duplicateProfile,
  runProfileNow,
} from '../services/recurringJournalService';

interface RecurringJournalState {
  profiles: RecurringProfile[];
  loading: boolean;
  searchQuery: string;
  typeFilter: VoucherType | 'all';
  cadenceFilter: Cadence | 'all';
  statusFilter: 'all' | 'active' | 'inactive';

  // Actions
  loadProfiles: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  setTypeFilter: (t: VoucherType | 'all') => void;
  setCadenceFilter: (c: Cadence | 'all') => void;
  setStatusFilter: (s: 'all' | 'active' | 'inactive') => void;

  addProfile: (payload: Omit<RecurringProfile, 'id' | 'createdAt' | 'updatedAt' | 'totalRunsCount'>) => Promise<RecurringProfile>;
  editProfile: (id: string, patch: Partial<RecurringProfile>) => Promise<RecurringProfile>;
  removeProfile: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  cloneProfile: (id: string) => Promise<RecurringProfile>;
  executeNow: (id: string) => Promise<{ profile: RecurringProfile; voucherNo: string }>;
}

export const useRecurringJournalStore = create<RecurringJournalState>()(
  persist(
    (set, get) => ({
      profiles: [],
      loading: false,
      searchQuery: '',
      typeFilter: 'all',
      cadenceFilter: 'all',
      statusFilter: 'all',

      loadProfiles: async () => {
        set({ loading: true });
        try {
          const list = await listProfiles();
          set({ profiles: list, loading: false });
        } catch (e) {
          set({ loading: false });
        }
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setTypeFilter: (typeFilter) => set({ typeFilter }),
      setCadenceFilter: (cadenceFilter) => set({ cadenceFilter }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),

      addProfile: async (payload) => {
        const created = await createProfile(payload);
        set((s) => ({ profiles: [created, ...s.profiles] }));
        return created;
      },

      editProfile: async (id, patch) => {
        const updated = await updateProfile(id, patch);
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? updated : p)),
        }));
        return updated;
      },

      removeProfile: async (id) => {
        await deleteProfile(id);
        set((s) => ({
          profiles: s.profiles.filter((p) => p.id !== id),
        }));
      },

      toggleActive: async (id) => {
        const updated = await toggleActiveProfile(id);
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? updated : p)),
        }));
      },

      cloneProfile: async (id) => {
        const cloned = await duplicateProfile(id);
        set((s) => ({ profiles: [cloned, ...s.profiles] }));
        return cloned;
      },

      executeNow: async (id) => {
        const res = await runProfileNow(id);
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? res.profile : p)),
        }));
        return res;
      },
    }),
    {
      name: 'recurring-journal:ui_state_v1',
      partialize: (state) => ({
        typeFilter: state.typeFilter,
        cadenceFilter: state.cadenceFilter,
        statusFilter: state.statusFilter,
      }),
    }
  )
);

// Filter Selector
export function selectFilteredProfiles(state: RecurringJournalState): RecurringProfile[] {
  const { profiles, searchQuery, typeFilter, cadenceFilter, statusFilter } = state;

  return profiles.filter((item) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.profileName.toLowerCase().includes(q);
      const matchNarration = (item.narration || '').toLowerCase().includes(q);
      const matchLines = item.lines.some(
        (l) =>
          (l.accountHeadName || '').toLowerCase().includes(q) ||
          (l.description || '').toLowerCase().includes(q)
      );
      if (!matchName && !matchNarration && !matchLines) return false;
    }

    // 2. Voucher Type Filter
    if (typeFilter !== 'all' && item.voucherType !== typeFilter) return false;

    // 3. Cadence Filter
    if (cadenceFilter !== 'all' && item.repeatEvery !== cadenceFilter) return false;

    // 4. Status Filter
    if (statusFilter === 'active' && !item.active) return false;
    if (statusFilter === 'inactive' && item.active) return false;

    return true;
  });
}
