import { create } from 'zustand';
import type {
  VoucherPreviewData,
  VoucherType,
} from '../types/voucherTemplate';
import { MOCK_PREVIEW_DATA } from '../mock/voucherPreviewData';
import { getPreviewData, savePreviewData } from '../services/voucherTemplateService';
import { deriveSignatureLabels } from '../lib/voucherPreviewMath';

export interface VoucherPreviewStore {
  previewData: VoucherPreviewData;
  loading: boolean;

  load: () => Promise<void>;
  setPreviewVoucherType: (vt: VoucherType) => void;
  updatePreviewData: (patch: Partial<VoucherPreviewData>) => void;
}

export const useVoucherPreviewStore = create<VoucherPreviewStore>((set, get) => ({
  previewData: MOCK_PREVIEW_DATA,
  loading: false,

  load: async () => {
    set({ loading: true });
    try {
      const data = await getPreviewData();
      set({ previewData: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setPreviewVoucherType: (vt: VoucherType) => {
    const current = get().previewData;
    const labels = deriveSignatureLabels(vt);
    const updatedSlots = current.signatureSlots.map((slot, i) => ({
      ...slot,
      label: labels[i] || '',
    }));

    const updated: VoucherPreviewData = {
      ...current,
      voucherType: vt,
      signatureSlots: updatedSlots,
    };

    set({ previewData: updated });
    savePreviewData(updated);
  },

  updatePreviewData: (patch: Partial<VoucherPreviewData>) => {
    const updated: VoucherPreviewData = {
      ...get().previewData,
      ...patch,
    };
    set({ previewData: updated });
    savePreviewData(updated);
  },
}));

