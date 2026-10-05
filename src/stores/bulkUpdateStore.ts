import { create } from 'zustand';
import { FilterCriteria, UpdateField, UpdateHistoryRow, VoucherRow, UPDATE_FIELDS } from '../types/bulk';
import {
  listUpdateHistory,
  filterVouchers,
  bulkUpdateVouchers,
  recordUpdate,
  getVouchersByNos,
} from '../services/bulkUpdateService';

interface BulkUpdateState {
  history: UpdateHistoryRow[];
  loading: boolean;
  filtering: boolean;
  updating: boolean;

  // Wizard state: 0 = closed, 1 = Filter Modal, 2 = Selection Modal, 3 = Update Modal
  step: 0 | 1 | 2 | 3;
  criteria: FilterCriteria;
  filteredVouchers: VoucherRow[];
  selectedIds: string[];
  updateField: UpdateField;
  newValue: string;

  // Details Drilldown Modal
  detailsModalOpen: boolean;
  selectedHistoryRow: UpdateHistoryRow | null;
  detailsVouchers: VoucherRow[];
  loadingDetails: boolean;

  // Actions
  loadHistory: () => Promise<void>;
  openFilterModal: () => void;
  closeWizard: () => void;
  goToStep: (step: 0 | 1 | 2 | 3) => void;
  setCriteria: (criteria: Partial<FilterCriteria>) => void;
  resetCriteria: () => void;
  runFilter: () => Promise<boolean>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  setUpdateField: (field: UpdateField) => void;
  setNewValue: (val: string) => void;
  commitUpdate: (userName?: string) => Promise<UpdateHistoryRow | null>;
  openDetailsModal: (row: UpdateHistoryRow) => Promise<void>;
  closeDetailsModal: () => void;
  getDerivedExistingValue: () => { value: string; isMultiple: boolean };
}

const DEFAULT_CRITERIA: FilterCriteria = {
  dateFrom: '2026-01-03',
  dateTo: '2026-10-03',
  accountsName: '',
  amountMin: undefined,
  amountMax: undefined,
  costCenter: '',
  subsidy: '',
  employee: '',
  vehicle: '',
};

export const useBulkUpdateStore = create<BulkUpdateState>((set, get) => ({
  history: [],
  loading: false,
  filtering: false,
  updating: false,

  step: 0,
  criteria: { ...DEFAULT_CRITERIA },
  filteredVouchers: [],
  selectedIds: [],
  updateField: 'accountsHead',
  newValue: '',

  detailsModalOpen: false,
  selectedHistoryRow: null,
  detailsVouchers: [],
  loadingDetails: false,

  loadHistory: async () => {
    set({ loading: true });
    try {
      const data = await listUpdateHistory();
      set({ history: data, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  openFilterModal: () => {
    set({
      step: 1,
      newValue: '',
    });
  },

  closeWizard: () => {
    set({
      step: 0,
      selectedIds: [],
      newValue: '',
    });
  },

  goToStep: (step: 0 | 1 | 2 | 3) => {
    set({ step });
  },

  setCriteria: (newCriteria: Partial<FilterCriteria>) => {
    set((state) => ({
      criteria: {
        ...state.criteria,
        ...newCriteria,
      },
    }));
  },

  resetCriteria: () => {
    set({ criteria: { ...DEFAULT_CRITERIA } });
  },

  runFilter: async () => {
    const { criteria } = get();
    set({ filtering: true });
    try {
      const results = await filterVouchers(criteria);
      set({
        filteredVouchers: results,
        selectedIds: results.map((v) => v.id), // default all checked
        filtering: false,
        step: 2, // Proceed to Step 1 (Selection)
      });
      return true;
    } catch (e) {
      set({ filtering: false });
      return false;
    }
  },

  toggleSelect: (id: string) => {
    set((state) => {
      const exists = state.selectedIds.includes(id);
      const updated = exists
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id];
      return { selectedIds: updated };
    });
  },

  toggleSelectAll: () => {
    set((state) => {
      const allSelected = state.selectedIds.length === state.filteredVouchers.length;
      return {
        selectedIds: allSelected ? [] : state.filteredVouchers.map((v) => v.id),
      };
    });
  },

  setUpdateField: (field: UpdateField) => {
    set({ updateField: field, newValue: '' });
  },

  setNewValue: (val: string) => {
    set({ newValue: val });
  },

  getDerivedExistingValue: () => {
    const { filteredVouchers, selectedIds, updateField } = get();
    const selectedVouchers = filteredVouchers.filter((v) => selectedIds.includes(v.id));
    if (selectedVouchers.length === 0) {
      return { value: '(none selected)', isMultiple: false };
    }

    const values = selectedVouchers.map((v) => {
      const val = (v as any)[updateField];
      return val ? String(val).trim() : '(blank)';
    });

    const uniqueValues = Array.from(new Set(values));
    if (uniqueValues.length === 1) {
      return { value: uniqueValues[0], isMultiple: false };
    }
    return { value: '(multiple values)', isMultiple: true };
  },

  commitUpdate: async (userName = 'Riazul Islam') => {
    const { selectedIds, updateField, newValue, filteredVouchers } = get();
    if (selectedIds.length === 0 || !newValue.trim()) return null;

    set({ updating: true });
    try {
      const fieldDef = UPDATE_FIELDS.find((f) => f.value === updateField);
      const fieldLabel = fieldDef ? fieldDef.label : updateField;

      const derived = get().getDerivedExistingValue();
      const existingDisplay = derived.value;

      const selectedVouchers = filteredVouchers.filter((v) => selectedIds.includes(v.id));
      const affectedVoucherNos = selectedVouchers.map((v) => v.voucherNo);

      await bulkUpdateVouchers(selectedIds, updateField, newValue.trim());

      const description = `${fieldLabel} Update: ${existingDisplay} to ${newValue.trim()}`;

      const newRecord = await recordUpdate({
        description,
        noOfData: selectedIds.length,
        userName,
        status: 'Complete',
        affectedVoucherNos,
      });

      const updatedHistory = await listUpdateHistory();
      set({
        history: updatedHistory,
        step: 0,
        selectedIds: [],
        newValue: '',
        updating: false,
      });

      return newRecord;
    } catch (e) {
      set({ updating: false });
      return null;
    }
  },

  openDetailsModal: async (row: UpdateHistoryRow) => {
    set({
      detailsModalOpen: true,
      selectedHistoryRow: row,
      loadingDetails: true,
      detailsVouchers: [],
    });
    try {
      const vouchers = await getVouchersByNos(row.affectedVoucherNos || []);
      set({ detailsVouchers: vouchers, loadingDetails: false });
    } catch (e) {
      set({ loadingDetails: false });
    }
  },

  closeDetailsModal: () => {
    set({
      detailsModalOpen: false,
      selectedHistoryRow: null,
      detailsVouchers: [],
    });
  },
}));
