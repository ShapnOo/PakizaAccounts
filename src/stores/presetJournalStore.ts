import { create } from 'zustand';
import { JournalPreset, VoucherType } from '../types/presetJournal';
import {
  listPresets,
  createPreset,
  updatePreset,
  deletePreset,
  duplicatePreset,
  incrementUsage as incrementUsageService,
} from '../services/presetJournalService';

interface PresetJournalState {
  presets: JournalPreset[];
  loading: boolean;
  selectedTypeTab: 'All' | VoucherType;
  searchQuery: string;
  sortBy: 'recent' | 'most-used' | 'alphabetical';
  selectedPresetForPreview: JournalPreset | null;

  setSelectedTypeTab: (tab: 'All' | VoucherType) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (sort: 'recent' | 'most-used' | 'alphabetical') => void;
  setSelectedPresetForPreview: (preset: JournalPreset | null) => void;

  load: () => Promise<void>;
  add: (
    payload: Omit<JournalPreset, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>
  ) => Promise<JournalPreset>;
  update: (id: string, patch: Partial<JournalPreset>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  duplicate: (id: string) => Promise<JournalPreset>;
  incrementUsage: (id: string) => Promise<void>;
}

export const usePresetJournalStore = create<PresetJournalState>((set, get) => ({
  presets: [],
  loading: false,
  selectedTypeTab: 'All',
  searchQuery: '',
  sortBy: 'recent',
  selectedPresetForPreview: null,

  setSelectedTypeTab: (selectedTypeTab) => set({ selectedTypeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSelectedPresetForPreview: (selectedPresetForPreview) =>
    set({ selectedPresetForPreview }),

  load: async () => {
    set({ loading: true });
    try {
      const all = await listPresets();
      set({ presets: all, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  add: async (payload) => {
    set({ loading: true });
    try {
      const created = await createPreset(payload);
      const all = await listPresets();
      set({ presets: all, loading: false });
      return created;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  update: async (id, patch) => {
    set({ loading: true });
    try {
      await updatePreset(id, patch);
      const all = await listPresets();
      set({ presets: all, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  remove: async (id) => {
    set({ loading: true });
    try {
      await deletePreset(id);
      const all = await listPresets();
      set((state) => ({
        presets: all,
        loading: false,
        selectedPresetForPreview:
          state.selectedPresetForPreview?.id === id
            ? null
            : state.selectedPresetForPreview,
      }));
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  duplicate: async (id) => {
    set({ loading: true });
    try {
      const dup = await duplicatePreset(id);
      const all = await listPresets();
      set({ presets: all, loading: false });
      return dup;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  incrementUsage: async (id) => {
    try {
      await incrementUsageService(id);
      const all = await listPresets();
      set({ presets: all });
    } catch (e) {
      // ignore
    }
  },
}));
