import { create } from 'zustand';
import {
  TBFilterState,
  TBReport,
  Currency,
  ValueShowIn,
  TBVisibleColumns,
} from '../types/trialBalance';
import { MOCK_TB_FILTERS } from '../mock/trialBalance';
import {
  getFilterState,
  saveFilterState,
  getTrialBalance,
  exportToXlsx,
  exportToCsv,
  exportToPdf,
} from '../services/trialBalanceService';
import { createAdvanceFilterStore } from './advanceFilterStore';

export const useTbAdvanceFilterStore = createAdvanceFilterStore(
  'advance-filter:trial-balance'
);

export interface TBStore {
  filters: TBFilterState;
  report: TBReport | null;
  loading: boolean;
  expandedNodeIds: string[]; // Controlled array for serialization

  setCurrency: (currency: Currency) => void;
  setDateRange: (dateRange: string) => void;
  setCustomDateRange: (from: string, to: string) => void;
  setValueShowIn: (valueShowIn: ValueShowIn) => void;
  toggleGlOnly: () => void;
  toggleSubLedger: () => void;
  toggleColumn: (key: keyof TBVisibleColumns) => void;
  toggleAdvancedFilter: () => void;
  toggleNode: (id: string) => void;
  setExpandAll: (expand: boolean) => void;
  load: () => Promise<void>;
  export: (format: 'xlsx' | 'csv' | 'pdf') => Promise<void>;
  reset: () => void;
}

export const useTrialBalanceStore = create<TBStore>((set, get) => ({
  filters: MOCK_TB_FILTERS,
  report: null,
  loading: false,
  expandedNodeIds: [], // Default collapsed per user requirement!

  setCurrency: (currency: Currency) => {
    const updated = { ...get().filters, currency };
    saveFilterState(updated);
    set({ filters: updated });
  },

  setDateRange: (dateRange: string) => {
    const updated = { ...get().filters, dateRange };
    saveFilterState(updated);
    set({ filters: updated });
    get().load();
  },

  setCustomDateRange: (customFrom: string, customTo: string) => {
    const updated = {
      ...get().filters,
      dateRange: 'Custom',
      customFrom,
      customTo,
    };
    saveFilterState(updated);
    set({ filters: updated });
    get().load();
  },

  setValueShowIn: (valueShowIn: ValueShowIn) => {
    const updated = { ...get().filters, valueShowIn };
    saveFilterState(updated);
    set({ filters: updated });
  },

  toggleGlOnly: () => {
    const updated = { ...get().filters, glOnly: !get().filters.glOnly };
    saveFilterState(updated);
    set({ filters: updated });
    get().load();
  },

  toggleSubLedger: () => {
    const updated = { ...get().filters, subLedger: !get().filters.subLedger };
    saveFilterState(updated);
    set({ filters: updated });
  },

  toggleColumn: (key: keyof TBVisibleColumns) => {
    const current = get().filters.visibleColumns;
    const activeCount = Object.values(current).filter(Boolean).length;
    // Keep at least 2 columns visible
    if (current[key] && activeCount <= 2) {
      return;
    }
    const updatedColumns = { ...current, [key]: !current[key] };
    const updated = { ...get().filters, visibleColumns: updatedColumns };
    saveFilterState(updated);
    set({ filters: updated });
  },

  toggleAdvancedFilter: () => {
    const updated = {
      ...get().filters,
      advancedFilterCollapsed: !get().filters.advancedFilterCollapsed,
    };
    saveFilterState(updated);
    set({ filters: updated });
  },

  toggleNode: (id: string) => {
    const current = get().expandedNodeIds;
    if (current.includes(id)) {
      set({ expandedNodeIds: current.filter((i) => i !== id) });
    } else {
      set({ expandedNodeIds: [...current, id] });
    }
  },

  setExpandAll: (expand: boolean) => {
    if (expand) {
      const allParentIds = (get().report?.rows || [])
        .filter((r) => r.isParent)
        .map((r) => r.id);
      set({ expandedNodeIds: allParentIds });
    } else {
      set({ expandedNodeIds: [] });
    }
  },

  load: async () => {
    set({ loading: true });
    try {
      const report = await getTrialBalance(get().filters);
      set({ report, loading: false });
    } catch (err) {
      console.error('Failed to load Trial Balance report:', err);
      set({ loading: false });
    }
  },

  export: async (format: 'xlsx' | 'csv' | 'pdf') => {
    const { report } = get();
    if (!report) return;

    if (format === 'xlsx') {
      await exportToXlsx(report);
    } else if (format === 'csv') {
      await exportToCsv(report);
    } else if (format === 'pdf') {
      await exportToPdf(report);
    }
  },

  reset: () => {
    set({
      filters: MOCK_TB_FILTERS,
      expandedNodeIds: [],
    });
    saveFilterState(MOCK_TB_FILTERS);
    get().load();
  },
}));
