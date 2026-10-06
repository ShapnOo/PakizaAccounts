import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  VoucherTemplate,
  VoucherType,
  DeepPartial,
} from '../types/voucherTemplate';
import {
  listTemplates,
  saveTemplate,
  resetTemplate,
  getCompanyHeader,
  getPreviewLines,
} from '../services/voucherTemplateService';
import { MOCK_TEMPLATES, MOCK_COMPANY, MOCK_PREVIEW_LINES } from '../mock/voucherTemplates';
import { deepMerge } from '../lib/deepMerge';
import { toast } from 'sonner';

export interface VoucherTemplateStoreState {
  activeType: VoucherType;
  templates: Record<VoucherType, VoucherTemplate>;
  company: typeof MOCK_COMPANY;
  previewLines: typeof MOCK_PREVIEW_LINES;
  loading: boolean;
  dirty: boolean;
  livePreviewEnabled: boolean;
  zoom: number; // scale percent e.g. 100

  setActiveType: (t: VoucherType) => void;
  updateActive: (patch: DeepPartial<VoucherTemplate>) => void;
  toggleColumnVisibility: (colKey: string) => void;
  updateColumnLabel: (colKey: string, label: string) => void;
  updateColumnAlign: (colKey: string, align: 'Left' | 'Center' | 'Right') => void;
  reorderColumns: (newOrder: string[]) => void;
  setLivePreviewEnabled: (enabled: boolean) => void;
  setZoom: (zoom: number) => void;
  save: () => Promise<void>;
  reset: () => Promise<void>;
  load: () => Promise<void>;
}

const INITIAL_TEMPLATES = MOCK_TEMPLATES.reduce((acc, t) => {
  acc[t.voucherType] = t;
  return acc;
}, {} as Record<VoucherType, VoucherTemplate>);

export const useVoucherTemplateStore = create<VoucherTemplateStoreState>()(
  persist(
    (set, get) => ({
      activeType: 'Journal',
      templates: INITIAL_TEMPLATES,
      company: MOCK_COMPANY,
      previewLines: MOCK_PREVIEW_LINES,
      loading: true,
      dirty: false,
      livePreviewEnabled: true,
      zoom: 65,

      load: async () => {
        set({ loading: true });
        try {
          const [loadedList, companyInfo, sampleLines] = await Promise.all([
            listTemplates(),
            getCompanyHeader(),
            getPreviewLines(),
          ]);

          const map = loadedList.reduce((acc, t) => {
            acc[t.voucherType] = t;
            return acc;
          }, {} as Record<VoucherType, VoucherTemplate>);

          set({
            templates: map,
            company: companyInfo,
            previewLines: sampleLines,
            loading: false,
            dirty: false,
          });
        } catch (err) {
          console.error('Failed to load voucher templates:', err);
          set({ loading: false });
        }
      },

      setActiveType: (t: VoucherType) => {
        set({ activeType: t, dirty: false });
      },

      updateActive: (patch: DeepPartial<VoucherTemplate>) => {
        const { activeType, templates } = get();
        const current = templates[activeType];
        if (!current) return;

        const merged = deepMerge(current, patch);

        set({
          templates: {
            ...templates,
            [activeType]: merged,
          },
          dirty: true,
        });
      },

      toggleColumnVisibility: (colKey: string) => {
        const { activeType, templates } = get();
        const current = templates[activeType];
        if (!current) return;

        const col = current.table.columns[colKey];
        if (!col) return;

        const updatedCols = {
          ...current.table.columns,
          [colKey]: {
            ...col,
            visible: !col.visible,
          },
        };

        set({
          templates: {
            ...templates,
            [activeType]: {
              ...current,
              table: {
                ...current.table,
                columns: updatedCols,
              },
            },
          },
          dirty: true,
        });
      },

      updateColumnLabel: (colKey: string, label: string) => {
        const { activeType, templates } = get();
        const current = templates[activeType];
        if (!current) return;

        const col = current.table.columns[colKey];
        if (!col) return;

        const updatedCols = {
          ...current.table.columns,
          [colKey]: {
            ...col,
            label,
          },
        };

        set({
          templates: {
            ...templates,
            [activeType]: {
              ...current,
              table: {
                ...current.table,
                columns: updatedCols,
              },
            },
          },
          dirty: true,
        });
      },

      updateColumnAlign: (colKey: string, align: 'Left' | 'Center' | 'Right') => {
        const { activeType, templates } = get();
        const current = templates[activeType];
        if (!current) return;

        const col = current.table.columns[colKey];
        if (!col) return;

        const updatedCols = {
          ...current.table.columns,
          [colKey]: {
            ...col,
            align,
          },
        };

        set({
          templates: {
            ...templates,
            [activeType]: {
              ...current,
              table: {
                ...current.table,
                columns: updatedCols,
              },
            },
          },
          dirty: true,
        });
      },

      reorderColumns: (newOrder: string[]) => {
        const { activeType, templates } = get();
        const current = templates[activeType];
        if (!current) return;

        set({
          templates: {
            ...templates,
            [activeType]: {
              ...current,
              table: {
                ...current.table,
                columnOrder: newOrder,
              },
            },
          },
          dirty: true,
        });
      },

      setLivePreviewEnabled: (enabled: boolean) => {
        set({ livePreviewEnabled: enabled });
      },

      setZoom: (zoom: number) => {
        set({ zoom });
      },

      save: async () => {
        const { activeType, templates } = get();
        const current = templates[activeType];
        if (!current) return;

        try {
          await saveTemplate(current);
          set({ dirty: false });
          toast.success(`${activeType} print template saved successfully`);
        } catch (err: any) {
          toast.error(err.message || 'Failed to save template');
        }
      },

      reset: async () => {
        const { activeType } = get();
        try {
          const fresh = await resetTemplate(activeType);
          set((state) => ({
            templates: {
              ...state.templates,
              [activeType]: fresh,
            },
            dirty: false,
          }));
          toast.success(`${activeType} template reset to default`);
        } catch (err: any) {
          toast.error('Failed to reset template');
        }
      },
    }),
    {
      name: 'voucher-templates:store',
      partialize: (state) => ({
        activeType: state.activeType,
        livePreviewEnabled: state.livePreviewEnabled,
        zoom: state.zoom,
      }),
    }
  )
);
