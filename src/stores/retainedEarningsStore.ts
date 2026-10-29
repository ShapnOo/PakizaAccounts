import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DateRange,
  RetainedEarningsReport,
} from '../types/retainedEarnings';
import { MOCK_RE_FILTERS } from '../mock/retainedEarnings';
import {
  getFilterState,
  saveFilterState,
  getRetainedEarningsReport,
  exportToXlsx,
  exportToCsv,
  exportToPdf,
} from '../services/retainedEarningsService';

export interface REStore {
  dateRange: DateRange;
  customFrom: string;
  customTo: string;
  report: RetainedEarningsReport | null;
  loading: boolean;
  hoveredLinkedKey: string | null;
  showEquityTotal: boolean;

  setDateRange: (r: DateRange) => void;
  setCustomDateRange: (from: string, to: string) => void;
  setHoveredLinkedKey: (k: string | null) => void;
  setShowEquityTotal: (s: boolean) => void;
  load: () => Promise<void>;
  export: (fmt: 'xlsx' | 'csv' | 'pdf') => Promise<void>;
  reset: () => void;
}

export const useRetainedEarningsStore = create<REStore>()(
  persist(
    (set, get) => ({
      dateRange: MOCK_RE_FILTERS.dateRange,
      customFrom: MOCK_RE_FILTERS.customFrom,
      customTo: MOCK_RE_FILTERS.customTo,
      report: null,
      loading: false,
      hoveredLinkedKey: null,
      showEquityTotal: true,

      setDateRange: (dateRange: DateRange) => {
        set({ dateRange });
        saveFilterState({
          dateRange,
          customFrom: get().customFrom,
          customTo: get().customTo,
        });
        get().load();
      },

      setCustomDateRange: (customFrom: string, customTo: string) => {
        set({ dateRange: 'Custom', customFrom, customTo });
        saveFilterState({
          dateRange: 'Custom',
          customFrom,
          customTo,
        });
        get().load();
      },

      setHoveredLinkedKey: (hoveredLinkedKey: string | null) => {
        set({ hoveredLinkedKey });
      },

      setShowEquityTotal: (showEquityTotal: boolean) => {
        set({ showEquityTotal });
      },

      load: async () => {
        set({ loading: true });
        try {
          const { dateRange, customFrom, customTo } = get();
          const report = await getRetainedEarningsReport(
            dateRange,
            customFrom,
            customTo
          );
          set({ report, loading: false });
        } catch (err) {
          console.error('Failed to load Retained Earnings Report:', err);
          set({ loading: false });
        }
      },

      export: async (fmt: 'xlsx' | 'csv' | 'pdf') => {
        const { report } = get();
        if (!report) return;

        if (fmt === 'xlsx') {
          await exportToXlsx(report);
        } else if (fmt === 'csv') {
          await exportToCsv(report);
        } else if (fmt === 'pdf') {
          await exportToPdf(report);
        }
      },

      reset: () => {
        set({
          dateRange: MOCK_RE_FILTERS.dateRange,
          customFrom: MOCK_RE_FILTERS.customFrom,
          customTo: MOCK_RE_FILTERS.customTo,
        });
        saveFilterState(MOCK_RE_FILTERS);
        get().load();
      },
    }),
    {
      name: 're:ui',
      partialize: (state) => ({
        dateRange: state.dateRange,
        customFrom: state.customFrom,
        customTo: state.customTo,
        showEquityTotal: state.showEquityTotal,
      }),
    }
  )
);

