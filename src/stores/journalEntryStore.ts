import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  VoucherEntry,
  VoucherType,
  ViewType,
  FilterRange,
  Attachment,
} from '../types/journalEntry';
import {
  listEntries,
  createEntry,
  updateEntry,
  voidEntry,
  unvoidEntry,
  deleteEntry,
  addAttachment,
  removeAttachment,
} from '../services/journalEntryService';
import { isDateInRange } from '../lib/dateRangeFilter';

export interface AdvancedFilterState {
  types: VoucherType[];
  sources: string[];
  minAmount: string;
  maxAmount: string;
  hasAttachmentsOnly: boolean;
  voidFilter: 'all' | 'active' | 'voided';
}

interface JournalEntryState {
  entries: VoucherEntry[];
  loading: boolean;
  searchQuery: string;
  viewType: ViewType;
  filterRange: FilterRange;
  customFromDate?: string;
  customToDate?: string;
  advancedOpen: boolean;
  advancedFilters: AdvancedFilterState;

  // Selected voucher for modals/drawers
  selectedAttachmentVoucher: VoucherEntry | null;

  // Actions
  loadEntries: () => Promise<void>;
  setViewType: (v: ViewType) => void;
  setFilterRange: (r: FilterRange) => void;
  setCustomDateRange: (from?: string, to?: string) => void;
  setSearchQuery: (q: string) => void;
  toggleAdvanced: () => void;
  setAdvancedFilters: (filters: Partial<AdvancedFilterState>) => void;
  resetAdvancedFilters: () => void;
  setSelectedAttachmentVoucher: (v: VoucherEntry | null) => void;

  addEntry: (e: Omit<VoucherEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<VoucherEntry>;
  editEntry: (id: string, patch: Partial<VoucherEntry>) => Promise<VoucherEntry>;
  toggleVoid: (id: string) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  uploadAttachment: (entryId: string, file: Attachment) => Promise<void>;
  deleteAttachment: (entryId: string, attachmentId: string) => Promise<void>;
}

const DEFAULT_ADVANCED_FILTERS: AdvancedFilterState = {
  types: [],
  sources: [],
  minAmount: '',
  maxAmount: '',
  hasAttachmentsOnly: false,
  voidFilter: 'all',
};

export const useJournalEntryStore = create<JournalEntryState>()(
  persist(
    (set, get) => ({
      entries: [],
      loading: false,
      searchQuery: '',
      viewType: 'list',
      filterRange: 'all',
      customFromDate: '',
      customToDate: '',
      advancedOpen: false,
      advancedFilters: DEFAULT_ADVANCED_FILTERS,
      selectedAttachmentVoucher: null,

      loadEntries: async () => {
        set({ loading: true });
        try {
          const list = await listEntries();
          set({ entries: list, loading: false });
        } catch (e) {
          set({ loading: false });
        }
      },

      setViewType: (viewType) => set({ viewType }),

      setFilterRange: (filterRange) => set({ filterRange }),

      setCustomDateRange: (customFromDate, customToDate) =>
        set({ customFromDate, customToDate }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      toggleAdvanced: () => set((s) => ({ advancedOpen: !s.advancedOpen })),

      setAdvancedFilters: (filters) =>
        set((s) => ({
          advancedFilters: { ...s.advancedFilters, ...filters },
        })),

      resetAdvancedFilters: () =>
        set({ advancedFilters: DEFAULT_ADVANCED_FILTERS }),

      setSelectedAttachmentVoucher: (selectedAttachmentVoucher) =>
        set({ selectedAttachmentVoucher }),

      addEntry: async (payload) => {
        const created = await createEntry(payload);
        set((s) => ({ entries: [created, ...s.entries] }));
        return created;
      },

      editEntry: async (id, patch) => {
        const updated = await updateEntry(id, patch);
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? updated : e)),
        }));
        return updated;
      },

      toggleVoid: async (id) => {
        const entry = get().entries.find((e) => e.id === id);
        if (!entry) return;
        if (entry.voided) {
          await unvoidEntry(id);
          set((s) => ({
            entries: s.entries.map((e) =>
              e.id === id ? { ...e, voided: false } : e
            ),
          }));
        } else {
          await voidEntry(id);
          set((s) => ({
            entries: s.entries.map((e) =>
              e.id === id ? { ...e, voided: true } : e
            ),
          }));
        }
      },

      removeEntry: async (id) => {
        await deleteEntry(id);
        set((s) => ({
          entries: s.entries.filter((e) => e.id !== id),
        }));
      },

      uploadAttachment: async (entryId, file) => {
        const updated = await addAttachment(entryId, file);
        set((s) => ({
          entries: s.entries.map((e) => (e.id === entryId ? updated : e)),
          selectedAttachmentVoucher:
            s.selectedAttachmentVoucher?.id === entryId
              ? updated
              : s.selectedAttachmentVoucher,
        }));
      },

      deleteAttachment: async (entryId, attachmentId) => {
        const updated = await removeAttachment(entryId, attachmentId);
        set((s) => ({
          entries: s.entries.map((e) => (e.id === entryId ? updated : e)),
          selectedAttachmentVoucher:
            s.selectedAttachmentVoucher?.id === entryId
              ? updated
              : s.selectedAttachmentVoucher,
        }));
      },
    }),
    {
      name: 'journal:ui_state_v3',
      partialize: (state) => ({
        viewType: state.viewType,
        filterRange: state.filterRange,
        advancedOpen: state.advancedOpen,
      }),
    }
  )
);

// Selector function to get filtered entries
export function selectFilteredEntries(state: JournalEntryState): VoucherEntry[] {
  const {
    entries,
    searchQuery,
    filterRange,
    customFromDate,
    customToDate,
    advancedFilters,
  } = state;

  return entries.filter((item) => {
    // 1. Search Query (Voucher No, Narration, Source, Accounts)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNo = item.voucherNo.toLowerCase().includes(q);
      const matchNarration = (item.narration || '').toLowerCase().includes(q);
      const matchSource = item.source.toLowerCase().includes(q);
      const matchLines = item.lines.some((l) =>
        (l.accountHeadName || '').toLowerCase().includes(q) ||
        (l.description || '').toLowerCase().includes(q)
      );
      if (!matchNo && !matchNarration && !matchSource && !matchLines) {
        return false;
      }
    }

    // 2. Date Range Filter
    if (
      !isDateInRange(
        item.voucherDate,
        filterRange,
        customFromDate,
        customToDate
      )
    ) {
      return false;
    }

    // 3. Advanced Filters: Voucher Types
    if (
      advancedFilters.types.length > 0 &&
      !advancedFilters.types.includes(item.voucherType)
    ) {
      return false;
    }

    // 4. Advanced Filters: Sources
    if (
      advancedFilters.sources.length > 0 &&
      !advancedFilters.sources.includes(item.source)
    ) {
      return false;
    }

    // 5. Advanced Filters: Min/Max Amount
    if (advancedFilters.minAmount) {
      const min = parseFloat(advancedFilters.minAmount);
      if (!isNaN(min) && item.amount < min) return false;
    }
    if (advancedFilters.maxAmount) {
      const max = parseFloat(advancedFilters.maxAmount);
      if (!isNaN(max) && item.amount > max) return false;
    }

    // 6. Has Attachments
    if (
      advancedFilters.hasAttachmentsOnly &&
      (!item.attachments || item.attachments.length === 0)
    ) {
      return false;
    }

    // 7. Voided status
    if (advancedFilters.voidFilter === 'active' && item.voided) return false;
    if (advancedFilters.voidFilter === 'voided' && !item.voided) return false;

    return true;
  });
}
