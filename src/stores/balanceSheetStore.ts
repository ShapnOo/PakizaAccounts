import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import {
  BSFilterState,
  BSTreeRow,
  CompareWith,
  ValueShowIn,
} from '../types/balanceSheet';
import { MOCK_BS_FILTERS, MOCK_BS_ROWS } from '../mock/balanceSheet';
import {
  getBalanceSheetData,
  exportToXlsx,
  exportToCsv,
  exportToPdf,
} from '../services/balanceSheetService';
import { createAdvanceFilterStore } from './advanceFilterStore';
import { computeRollups } from '../lib/balanceSheetMath';

export const useBsAdvanceFilterStore = createAdvanceFilterStore('advance-filter:balance-sheet');

export const DEFAULT_COLLAPSED_NODES: Record<string, boolean> = {
  'a-ca': true,
  'a-ca-cce': true,
  'a-ca-ar': true,
  'a-ca-inv': true,
  'a-nca': true,
  'a-nca-tan': true,
  'a-nca-intan': true,
  'le-liab': true,
  'le-liab-cl': true,
  'le-liab-cl-tp': true,
  'le-liab-cl-loan': true,
  'le-liab-ltl': true,
  'le-liab-ltl-loan': true,
  'le-eq': true,
};

export interface BSStore {
  filters: BSFilterState;
  rows: BSTreeRow[];
  years: string[];
  loading: boolean;
  exportMenuOpen: boolean;
  collapsedNodes: Record<string, boolean>;

  // Filter setters
  setAsOn: (d: string) => void;
  setCompareWith: (v: CompareWith) => void;
  setShowInPercent: (b: boolean) => void;
  setValueShowIn: (v: ValueShowIn) => void;
  setNumberOfYears: (n: number) => void;
  setCurrency: (c: string) => void;
  toggleSubLedger: () => void;
  toggleAdvanceFilter: () => void;
  toggleExpandAll: () => void;
  setExpandAll: (b: boolean) => void;
  toggleNodeCollapse: (id: string) => void;
  setCustomPeriod: (start: string, end: string) => void;
  setExportMenuOpen: (open: boolean) => void;
  resetFilters: () => void;

  // Data
  load: () => Promise<void>;
  exportReport: (format: 'xlsx' | 'csv' | 'pdf') => Promise<void>;
}

export const useBalanceSheetStore = create<BSStore>()(
  persist(
    (set, get) => ({
      filters: MOCK_BS_FILTERS,
      rows: MOCK_BS_ROWS,
      years: ['2026-10-17', '2025-10-17', '2024-10-17', '2023-10-17'],
      loading: false,
      exportMenuOpen: false,
      collapsedNodes: DEFAULT_COLLAPSED_NODES,

      setAsOn: (asOn) => {
        set((s) => ({ filters: { ...s.filters, asOn } }));
        get().load();
      },

      setCompareWith: (compareWith) => {
        set((s) => ({ filters: { ...s.filters, compareWith } }));
        get().load();
      },

      setShowInPercent: (showInPercent) => {
        set((s) => ({ filters: { ...s.filters, showInPercent } }));
      },

      setValueShowIn: (valueShowIn) => {
        set((s) => ({ filters: { ...s.filters, valueShowIn } }));
      },

      setNumberOfYears: (numberOfYears) => {
        const clamped = Math.max(0, Math.min(numberOfYears, 10));
        if (clamped > 5) {
          toast.warning('Large time spans may slow rendering');
        }
        set((s) => ({ filters: { ...s.filters, numberOfYears: clamped } }));
        get().load();
      },

      setCurrency: (currency) => {
        set((s) => ({ filters: { ...s.filters, currency } }));
      },

      toggleSubLedger: () => {
        set((s) => ({
          filters: { ...s.filters, subLedger: !s.filters.subLedger },
        }));
      },

      toggleAdvanceFilter: () => {
        set((s) => ({
          filters: {
            ...s.filters,
            advancedFilterCollapsed: !s.filters.advancedFilterCollapsed,
          },
        }));
      },

      toggleExpandAll: () => {
        const current = get().filters.expandAll;
        const next = !current;
        const newCollapsed: Record<string, boolean> = {};
        if (!next) {
          // Collapse everything below level 1
          get().rows.forEach((r) => {
            if (r.isParent && r.level > 1) {
              newCollapsed[r.id] = true;
            }
          });
        }
        set((s) => ({
          filters: { ...s.filters, expandAll: next },
          collapsedNodes: newCollapsed,
        }));
      },

      setExpandAll: (expandAll) => {
        const newCollapsed: Record<string, boolean> = {};
        if (!expandAll) {
          get().rows.forEach((r) => {
            if (r.isParent && r.level > 1) {
              newCollapsed[r.id] = true;
            }
          });
        }
        set((s) => ({
          filters: { ...s.filters, expandAll },
          collapsedNodes: newCollapsed,
        }));
      },

      toggleNodeCollapse: (id) => {
        set((s) => ({
          collapsedNodes: {
            ...s.collapsedNodes,
            [id]: !s.collapsedNodes[id],
          },
        }));
      },

      setCustomPeriod: (customStartDate, customEndDate) => {
        set((s) => ({
          filters: { ...s.filters, customStartDate, customEndDate },
        }));
        get().load();
      },

      setExportMenuOpen: (exportMenuOpen) => {
        set({ exportMenuOpen });
      },

      resetFilters: () => {
        set({
          filters: { ...MOCK_BS_FILTERS, expandAll: false },
          collapsedNodes: DEFAULT_COLLAPSED_NODES,
        });
        get().load();
        toast.info('Balance Sheet filters have been reset to default.');
      },

      load: async () => {
        set({ loading: true });
        try {
          const { years, rows } = await getBalanceSheetData(get().filters);
          set({ years, rows, loading: false });
        } catch (e) {
          console.error(e);
          set({ loading: false });
          toast.error('Failed to load Balance Sheet data');
        }
      },

      exportReport: async (format: 'xlsx' | 'csv' | 'pdf') => {
        const { rows, years, filters } = get();
        const filename = `Balance_Sheet_${filters.asOn}.${format}`;

        if (format === 'pdf') {
          await exportToPdf(years, rows, filters);
          return;
        }

        // Build flat array for Excel/CSV export
        const flatData = rows.map((r) => {
          const indent = '  '.repeat(r.level - 1);
          const obj: Record<string, any> = {
            Particulars: `${indent}${r.label}`,
            Level: `L${r.level}`,
          };
          if (filters.subLedger) {
            obj['Sub-Ledger'] =
              r.subLedger && r.subLedger.name !== 'Undefined'
                ? `${r.subLedger.name} (${r.subLedger.tag})`
                : '—';
          }
          years.forEach((yr, idx) => {
            const rawVal = r.values[idx] || 0;
            obj[yr] = rawVal;
          });
          return obj;
        });

        if (format === 'xlsx') {
          await exportToXlsx(flatData, years, filename);
        } else if (format === 'csv') {
          await exportToCsv(flatData, years, filename);
        }
      },
    }),
    {
      name: 'bs:filter-state',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

// Helpers to compute filtered & visible rows
export function getComputedTreeWithFilter(
  allRows: BSTreeRow[],
  colCount: number,
  predicate?: (row: any) => boolean
): BSTreeRow[] {
  if (!predicate) {
    return computeRollups(allRows, colCount);
  }

  // Filter leaf rows
  const matchingLeaves = new Set<string>();
  allRows.forEach((r) => {
    if (!r.isParent && !r.isTotal) {
      if (predicate(r)) {
        matchingLeaves.add(r.id);
      }
    }
  });

  // Zero out non-matching leaves
  const adjustedRows = allRows.map((r) => {
    if (!r.isParent && !r.isTotal) {
      if (!matchingLeaves.has(r.id)) {
        return { ...r, values: Array(colCount).fill(0) };
      }
    }
    return r;
  });

  return computeRollups(adjustedRows, colCount);
}

