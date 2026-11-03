import { create } from 'zustand';
import type {
  VoucherType,
  TemplateId,
  TemplateCustomization,
  TemplateSetup,
} from '../types/voucherTemplate';
import { VOUCHER_TYPES } from '../types/voucherTemplate';
import {
  DEFAULT_SETUPS,
} from '../mock/voucherPreviewData';
import {
  listSetups,
  saveSetup,
  saveAllSetups,
  resetAllSetups,
} from '../services/voucherTemplateService';

export interface VoucherSetupStore {
  setups: Record<VoucherType, TemplateSetup>;
  loading: boolean;
  dirtyVoucherType: VoucherType | null;

  load: () => Promise<void>;
  setTemplateId: (vt: VoucherType, tid: TemplateId) => void;
  updateCustomization: (
    vt: VoucherType,
    patch: Partial<TemplateCustomization>
  ) => void;
  resetCustomization: (vt: VoucherType) => void;
  resetAllToDefaults: () => Promise<void>;
  save: (vt: VoucherType) => Promise<void>;
  applyToAll: (sourceVt: VoucherType) => Promise<void>;
}

export const useVoucherSetupStore = create<VoucherSetupStore>((set, get) => ({
  setups: DEFAULT_SETUPS,
  loading: false,
  dirtyVoucherType: null,

  load: async () => {
    set({ loading: true });
    try {
      const data = await listSetups();
      set({ setups: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setTemplateId: (vt: VoucherType, tid: TemplateId) => {
    const current = get().setups[vt] || DEFAULT_SETUPS[vt];
    const prevCustom = current.customization;

    let patch: Partial<TemplateCustomization> = {};
    if (tid === 'standard') {
      patch = {
        showDifferenceRow: true,
        showCurrencySummary: false,
        showBalanceIndicator: false,
        showLineDescription: false,
        showAuxRow: false,
        zebraStripes: false,
      };
    } else {
      patch = {
        showDifferenceRow: false,
        showCurrencySummary: true,
        showBalanceIndicator: true,
        showLineDescription: true,
        showAuxRow: true,
        zebraStripes: tid === 'framedLedger',
      };
    }

    const updated: TemplateSetup = {
      voucherType: vt,
      templateId: tid,
      customization: {
        ...prevCustom,
        ...patch,
      },
    };

    set({
      setups: {
        ...get().setups,
        [vt]: updated,
      },
      dirtyVoucherType: vt,
    });
  },

  updateCustomization: (
    vt: VoucherType,
    patch: Partial<TemplateCustomization>
  ) => {
    const current = get().setups[vt] || DEFAULT_SETUPS[vt];
    const updated: TemplateSetup = {
      ...current,
      customization: {
        ...current.customization,
        ...patch,
      },
    };

    set({
      setups: {
        ...get().setups,
        [vt]: updated,
      },
      dirtyVoucherType: vt,
    });
  },

  resetCustomization: (vt: VoucherType) => {
    const defaultSetup = DEFAULT_SETUPS[vt];
    set({
      setups: {
        ...get().setups,
        [vt]: {
          voucherType: vt,
          templateId: defaultSetup.templateId,
          customization: { ...defaultSetup.customization },
        },
      },
      dirtyVoucherType: vt,
    });
  },

  resetAllToDefaults: async () => {
    set({ loading: true });
    const defaults = await resetAllSetups();
    set({
      setups: defaults,
      loading: false,
      dirtyVoucherType: null,
    });
  },

  save: async (vt: VoucherType) => {
    const current = get().setups[vt] || DEFAULT_SETUPS[vt];
    set({ loading: true });
    await saveSetup(current);
    set({
      loading: false,
      dirtyVoucherType: null,
    });
  },

  applyToAll: async (sourceVt: VoucherType) => {
    const source = get().setups[sourceVt] || DEFAULT_SETUPS[sourceVt];
    const newSetups: Record<VoucherType, TemplateSetup> = { ...get().setups };

    VOUCHER_TYPES.forEach((vt) => {
      newSetups[vt] = {
        voucherType: vt,
        templateId: source.templateId,
        customization: {
          ...source.customization,
        },
      };
    });

    set({ loading: true });
    await saveAllSetups(newSetups);
    set({
      setups: newSetups,
      loading: false,
      dirtyVoucherType: null,
    });
  },
}));

