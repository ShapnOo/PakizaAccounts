import { create } from 'zustand';
import {
  RPFilterState,
  RPStatementData,
  ReportType,
  AccountsType,
  ApprovalStatus,
  Currency,
  DateRangePreset,
  AccountsDetailType,
  ValueShowIn,
} from '../types/receiptPayment';
import {
  MOCK_RP_FILTERS,
} from '../mock/receiptPayment';
import {
  getStoredRPFilters,
  saveStoredRPFilters,
  fetchReceiptPaymentData,
  exportRPToXlsx,
  exportRPToCsv,
  exportRPToPdf,
} from '../services/receiptPaymentService';
import { createAdvanceFilterStore } from './advanceFilterStore';

export const useRpAdvanceFilterStore = createAdvanceFilterStore(
  'advance-filter:receipt-payment'
);

export interface RPStore {
  filters: RPFilterState;
  statement: RPStatementData | null;
  loading: boolean;

  setReportType: (t: ReportType) => void;
  setAccountsType: (a: AccountsType) => void;
  setApprovalStatus: (s: ApprovalStatus) => void;
  setCurrency: (c: Currency) => void;
  setDateRangePreset: (p: DateRangePreset) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setAccountsDetailsTypes: (types: AccountsDetailType[]) => void;
  setValueShowIn: (v: ValueShowIn) => void;
  setAccountsHead: (head: string) => void;
  toggleAdvancedFilter: () => void;
  resetFilters: () => void;
  fetchData: () => Promise<void>;
  exportReport: (format: 'xlsx' | 'csv' | 'pdf') => Promise<void>;
}

export const useReceiptPaymentStore = create<RPStore>((set, get) => ({
  filters: getStoredRPFilters(),
  statement: null,
  loading: false,

  setReportType: (reportType: ReportType) => {
    const updated = { ...get().filters, reportType };
    saveStoredRPFilters(updated);
    set({ filters: updated });
    get().fetchData();
  },

  setAccountsType: (accountsType: AccountsType) => {
    const updated = { ...get().filters, accountsType };
    saveStoredRPFilters(updated);
    set({ filters: updated });
    get().fetchData();
  },

  setApprovalStatus: (approvalStatus: ApprovalStatus) => {
    const updated = { ...get().filters, approvalStatus };
    saveStoredRPFilters(updated);
    set({ filters: updated });
    get().fetchData();
  },

  setCurrency: (currency: Currency) => {
    const updated = { ...get().filters, currency };
    saveStoredRPFilters(updated);
    set({ filters: updated });
  },

  setDateRangePreset: (dateRangePreset: DateRangePreset) => {
    let startDate = get().filters.startDate;
    let endDate = get().filters.endDate;

    if (dateRangePreset === 'This Month') {
      startDate = '2026-10-01';
      endDate = '2026-10-20';
    } else if (dateRangePreset === 'Last Month') {
      startDate = '2026-09-01';
      endDate = '2026-09-30';
    } else if (dateRangePreset === 'This Quarter') {
      startDate = '2026-10-01';
      endDate = '2026-12-31';
    } else if (dateRangePreset === 'This Year') {
      startDate = '2026-01-01';
      endDate = '2026-12-31';
    }

    const updated = { ...get().filters, dateRangePreset, startDate, endDate };
    saveStoredRPFilters(updated);
    set({ filters: updated });
    get().fetchData();
  },

  setDateRange: (startDate: string, endDate: string) => {
    const updated = {
      ...get().filters,
      dateRangePreset: 'Custom Range' as DateRangePreset,
      startDate,
      endDate,
    };
    saveStoredRPFilters(updated);
    set({ filters: updated });
    get().fetchData();
  },

  setAccountsDetailsTypes: (accountsDetailsTypes: AccountsDetailType[]) => {
    const updated = { ...get().filters, accountsDetailsTypes };
    saveStoredRPFilters(updated);
    set({ filters: updated });
    get().fetchData();
  },

  setValueShowIn: (valueShowIn: ValueShowIn) => {
    const updated = { ...get().filters, valueShowIn };
    saveStoredRPFilters(updated);
    set({ filters: updated });
  },

  setAccountsHead: (accountsHead: string) => {
    const updated = { ...get().filters, accountsHead };
    saveStoredRPFilters(updated);
    set({ filters: updated });
    get().fetchData();
  },

  toggleAdvancedFilter: () => {
    const current = get().filters.advancedFilterCollapsed;
    const updated = { ...get().filters, advancedFilterCollapsed: !current };
    saveStoredRPFilters(updated);
    set({ filters: updated });
  },

  resetFilters: () => {
    saveStoredRPFilters(MOCK_RP_FILTERS);
    set({ filters: { ...MOCK_RP_FILTERS } });
    get().fetchData();
  },

  fetchData: async () => {
    set({ loading: true });
    try {
      const data = await fetchReceiptPaymentData(get().filters);
      set({ statement: data, loading: false });
    } catch (e) {
      console.error('Error fetching Receipt and Payment statement data:', e);
      set({ loading: false });
    }
  },

  exportReport: async (format: 'xlsx' | 'csv' | 'pdf') => {
    const { statement, filters } = get();
    if (!statement) return;

    if (format === 'xlsx') {
      await exportRPToXlsx(statement, filters);
    } else if (format === 'csv') {
      await exportRPToCsv(statement, filters);
    } else if (format === 'pdf') {
      await exportRPToPdf(statement, filters);
    }
  },
}));

