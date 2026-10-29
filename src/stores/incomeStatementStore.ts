import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import {
  ISFilterState,
  ISRow,
  ISColumnGroup,
  ReportType,
  CompareMode,
  DisplayedBy,
  ValueShowIn,
  Currency,
} from '../types/incomeStatement';
import { MOCK_IS_FILTERS } from '../mock/incomeStatement';
import {
  getIncomeStatementData,
  exportToXlsx,
  exportToCsv,
  exportToPdf,
} from '../services/incomeStatementService';
import { createAdvanceFilterStore } from './advanceFilterStore';

export const useIsAdvanceFilterStore = createAdvanceFilterStore('advance-filter:income-statement');

export interface ISStore {
  filters: ISFilterState;
  columnGroups: ISColumnGroup[];
  dataColumns: { key: string; label: string; subLabel?: string }[];
  rows: ISRow[];
  loading: boolean;
  fyExpanded: boolean;

  setReportType: (t: ReportType) => void;
  setCompareTo: (m: CompareMode) => void;
  setDateRange: (r: string) => void;
  setNoOfPeriod: (n: number) => void;
  setDisplayedBy: (d: DisplayedBy) => void;
  setShowInPercent: (b: boolean) => void;
  setValueShowIn: (v: ValueShowIn) => void;
  setCurrency: (c: Currency) => void;
  setSelectedCompanies: (companies: string[]) => void;
  setSelectedCostCenters: (centers: string[]) => void;
  toggleAdvancedFilter: () => void;
  setFyExpanded: (expanded: boolean) => void;
  toggleFyExpanded: () => void;
  resetFilters: () => void;

  load: () => Promise<void>;
  exportReport: (format: 'xlsx' | 'csv' | 'pdf') => Promise<void>;
}

export const useIncomeStatementStore = create<ISStore>()(
  persist(
    (set, get) => ({
      filters: MOCK_IS_FILTERS,
      columnGroups: [],
      dataColumns: [],
      rows: [],
      loading: false,
      fyExpanded: false,

      setReportType: (reportType) => {
        set((s) => ({ filters: { ...s.filters, reportType } }));
        get().load();
      },

      setCompareTo: (compareTo) => {
        set((s) => ({ filters: { ...s.filters, compareTo } }));
        get().load();
      },

      setDateRange: (dateRange) => {
        set((s) => ({ filters: { ...s.filters, dateRange } }));
        get().load();
      },

      setNoOfPeriod: (noOfPeriod) => {
        const clamped = Math.max(1, Math.min(noOfPeriod, 10));
        set((s) => ({ filters: { ...s.filters, noOfPeriod: clamped } }));
        get().load();
      },

      setDisplayedBy: (displayedBy) => {
        set((s) => ({ filters: { ...s.filters, displayedBy } }));
        get().load();
      },

      setShowInPercent: (showInPercent) => {
        set((s) => ({ filters: { ...s.filters, showInPercent } }));
      },

      setValueShowIn: (valueShowIn) => {
        set((s) => ({ filters: { ...s.filters, valueShowIn } }));
      },

      setCurrency: (currency) => {
        set((s) => ({ filters: { ...s.filters, currency } }));
      },

      setSelectedCompanies: (selectedCompanies) => {
        set((s) => ({ filters: { ...s.filters, selectedCompanies } }));
        get().load();
      },

      setSelectedCostCenters: (selectedCostCenters) => {
        set((s) => ({ filters: { ...s.filters, selectedCostCenters } }));
        get().load();
      },

      toggleAdvancedFilter: () => {
        set((s) => ({
          filters: {
            ...s.filters,
            advancedFilterCollapsed: !s.filters.advancedFilterCollapsed,
          },
        }));
      },

      setFyExpanded: (fyExpanded) => {
        set({ fyExpanded });
      },

      toggleFyExpanded: () => {
        set((s) => ({ fyExpanded: !s.fyExpanded }));
      },

      resetFilters: () => {
        set({
          filters: MOCK_IS_FILTERS,
          fyExpanded: false,
        });
        get().load();
        toast.info('Income Statement parameters reset to defaults.');
      },

      load: async () => {
        set({ loading: true });
        try {
          const { columnGroups, dataColumns, rows } =
            await getIncomeStatementData(get().filters);
          set({ columnGroups, dataColumns, rows, loading: false });
        } catch (e) {
          console.error('Failed to load income statement:', e);
          set({ loading: false });
          toast.error('Failed to load Income Statement data');
        }
      },

      exportReport: async (format: 'xlsx' | 'csv' | 'pdf') => {
        const { rows, dataColumns, columnGroups, filters, fyExpanded } = get();
        const filename = `Income_Statement_${filters.reportType}_${filters.compareTo.replace(
          /\s+/g,
          '_'
        )}.${format}`;

        const isPeriodMode = filters.compareTo === 'Previous Period';

        // Use collapsed columns & rows if FY is collapsed
        let activeCols = dataColumns;
        let activeRows = rows;

        if (isPeriodMode && !fyExpanded) {
          activeCols = columnGroups.map((g) => ({
            key: g.label,
            label: `FY ${g.label}`,
            subLabel: 'Full Year',
          }));

          let cursor = 0;
          const slices = columnGroups.map((g) => {
            const len = g.subColumns?.length || 1;
            const start = cursor;
            const end = cursor + len;
            cursor += len;
            return { start, end };
          });

          activeRows = rows.map((r) => {
            const vals = slices.map(({ start, end }) => {
              let sum = 0;
              for (let i = start; i < end; i++) {
                sum += r.values[i] || 0;
              }
              return sum;
            });
            return { ...r, values: vals };
          });
        }

        if (format === 'pdf') {
          await exportToPdf(activeCols, activeRows, filters);
          return;
        }

        const flatData = activeRows.map((r) => {
          const totalVal = r.values.reduce((acc, curr) => acc + curr, 0);
          const obj: Record<string, any> = {
            Particulars: `${r.letterCode ? `[${r.letterCode}] ` : ''}${
              r.level === 1 ? '  ' : ''
            }${r.label}`,
          };

          if (isPeriodMode) {
            obj['Total'] = r.isSectionHeader ? '—' : totalVal;
          }

          activeCols.forEach((col, idx) => {
            const rawVal = r.values[idx] || 0;
            const colTitle = col.subLabel
              ? `${col.label} ${col.subLabel}`
              : col.label;
            obj[colTitle] = r.isSectionHeader ? '—' : rawVal;
          });

          if (!isPeriodMode) {
            obj['Total'] = r.isSectionHeader ? '—' : totalVal;
          }

          return obj;
        });

        if (format === 'xlsx') {
          await exportToXlsx(flatData, filename);
        } else if (format === 'csv') {
          await exportToCsv(flatData, filename);
        }
      },
    }),
    {
      name: 'is:filter-state',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

