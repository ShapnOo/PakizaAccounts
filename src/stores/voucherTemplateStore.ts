import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  VoucherTemplate,
  VoucherType,
  DeepPartial,
} from '../types/voucherTemplate';
import {
  listTemplates,
  saveTemplate as apiSaveTemplate,
  createTemplate as apiCreateTemplate,
  deleteTemplate as apiDeleteTemplate,
  duplicateTemplate as apiDuplicateTemplate,
  setDefaultTemplate as apiSetDefaultTemplate,
  resetTemplate as apiResetTemplate,
  resetAllTemplates as apiResetAllTemplates,
  getCompanyHeader,
  getPreviewLines,
} from '../services/voucherTemplateService';
import { MOCK_TEMPLATES, MOCK_COMPANY, MOCK_PREVIEW_LINES } from '../mock/voucherTemplates';
import { deepMerge } from '../lib/deepMerge';
import { toast } from 'sonner';

export interface VoucherTemplateStoreState {
  templateList: VoucherTemplate[];
  activeTemplateId: string | null;
  activeType: VoucherType;
  templates: Record<string, VoucherTemplate>;
  company: typeof MOCK_COMPANY;
  previewLines: typeof MOCK_PREVIEW_LINES;
  loading: boolean;
  dirty: boolean;
  livePreviewEnabled: boolean;
  zoom: number; // scale percent e.g. 100

  // Selectors & Navigation
  setActiveTemplateId: (id: string) => void;
  setActiveType: (t: VoucherType) => void;
  getActiveTemplate: () => VoucherTemplate | undefined;

  // CRUD Actions
  createTemplate: (data: Partial<VoucherTemplate> & { name: string; voucherType: VoucherType }) => Promise<VoucherTemplate>;
  duplicateTemplate: (id: string) => Promise<VoucherTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  setDefaultTemplate: (id: string) => Promise<void>;
  resetAll: () => Promise<void>;

  // Designer editing actions
  updateActive: (patch: DeepPartial<VoucherTemplate>) => void;
  toggleColumnVisibility: (colKey: string) => void;
  updateColumnLabel: (colKey: string, label: string) => void;
  updateColumnAlign: (colKey: string, align: 'Left' | 'Center' | 'Right') => void;
  updateColumnWidth: (colKey: string, width: number) => void;
  reorderColumns: (newOrder: string[]) => void;
  setLivePreviewEnabled: (enabled: boolean) => void;
  setZoom: (zoom: number) => void;
  save: () => Promise<void>;
  reset: () => Promise<void>;
  load: () => Promise<void>;
}

const INITIAL_TEMPLATES_MAP = MOCK_TEMPLATES.reduce((acc, t) => {
  acc[t.id] = t;
  acc[t.voucherType] = t;
  return acc;
}, {} as Record<string, VoucherTemplate>);

export const useVoucherTemplateStore = create<VoucherTemplateStoreState>()(
  persist(
    (set, get) => ({
      templateList: MOCK_TEMPLATES,
      activeTemplateId: MOCK_TEMPLATES[0]?.id || 'tpl-journal',
      activeType: 'Journal',
      templates: INITIAL_TEMPLATES_MAP,
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

          const map: Record<string, VoucherTemplate> = {};
          loadedList.forEach((t) => {
            map[t.id] = t;
            // Map default or first to voucherType key for backwards compat
            if (t.isDefault || !map[t.voucherType]) {
              map[t.voucherType] = t;
            }
          });

          // If activeTemplateId is null or not found, set to first
          const currentId = get().activeTemplateId;
          const matched = loadedList.find((t) => t.id === currentId);
          const nextActiveId = matched ? matched.id : loadedList[0]?.id || null;
          const nextActiveType = matched ? matched.voucherType : loadedList[0]?.voucherType || 'Journal';

          set({
            templateList: loadedList,
            templates: map,
            activeTemplateId: nextActiveId,
            activeType: nextActiveType,
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

      getActiveTemplate: () => {
        const { activeTemplateId, activeType, templateList, templates } = get();
        if (activeTemplateId) {
          const found = templateList.find((t) => t.id === activeTemplateId) || templates[activeTemplateId];
          if (found) return found;
        }
        return templateList.find((t) => t.voucherType === activeType && t.isDefault) ||
               templateList.find((t) => t.voucherType === activeType) ||
               templates[activeType] ||
               templateList[0];
      },

      setActiveTemplateId: (id: string) => {
        const { templateList } = get();
        const found = templateList.find((t) => t.id === id);
        if (found) {
          set({
            activeTemplateId: id,
            activeType: found.voucherType,
            dirty: false,
          });
        } else {
          set({ activeTemplateId: id, dirty: false });
        }
      },

      setActiveType: (t: VoucherType) => {
        const { templateList } = get();
        const defaultForType = templateList.find((tpl) => tpl.voucherType === t && tpl.isDefault) ||
                               templateList.find((tpl) => tpl.voucherType === t);
        set({
          activeType: t,
          activeTemplateId: defaultForType ? defaultForType.id : get().activeTemplateId,
          dirty: false,
        });
      },

      createTemplate: async (data) => {
        try {
          const created = await apiCreateTemplate(data);
          const list = await listTemplates();
          const map = { ...get().templates, [created.id]: created };
          if (created.isDefault) {
            map[created.voucherType] = created;
          }
          set({
            templateList: list,
            templates: map,
            activeTemplateId: created.id,
            activeType: created.voucherType,
            dirty: false,
          });
          toast.success(`Template "${created.name}" created successfully`);
          return created;
        } catch (err: any) {
          toast.error(err.message || 'Failed to create template');
          throw err;
        }
      },

      duplicateTemplate: async (id: string) => {
        try {
          const duplicated = await apiDuplicateTemplate(id);
          const list = await listTemplates();
          const map = { ...get().templates, [duplicated.id]: duplicated };
          set({
            templateList: list,
            templates: map,
          });
          toast.success(`Duplicated: "${duplicated.name}"`);
          return duplicated;
        } catch (err: any) {
          toast.error(err.message || 'Failed to duplicate template');
          throw err;
        }
      },

      deleteTemplate: async (id: string) => {
        try {
          const target = get().templateList.find((t) => t.id === id);
          await apiDeleteTemplate(id);
          const list = await listTemplates();
          
          const map: Record<string, VoucherTemplate> = {};
          list.forEach((t) => {
            map[t.id] = t;
            if (t.isDefault || !map[t.voucherType]) {
              map[t.voucherType] = t;
            }
          });

          const currentActive = get().activeTemplateId;
          const nextActiveId = currentActive === id ? (list[0]?.id || null) : currentActive;
          const nextActive = list.find((t) => t.id === nextActiveId);

          set({
            templateList: list,
            templates: map,
            activeTemplateId: nextActiveId,
            activeType: nextActive ? nextActive.voucherType : 'Journal',
            dirty: false,
          });
          toast.success(`Template "${target?.name || 'Voucher template'}" deleted`);
        } catch (err: any) {
          toast.error(err.message || 'Failed to delete template');
          throw err;
        }
      },

      setDefaultTemplate: async (id: string) => {
        try {
          const updated = await apiSetDefaultTemplate(id);
          const list = await listTemplates();
          const map = { ...get().templates, [updated.id]: updated, [updated.voucherType]: updated };
          set({
            templateList: list,
            templates: map,
          });
          toast.success(`"${updated.name}" is now the default for ${updated.voucherType} vouchers`);
        } catch (err: any) {
          toast.error(err.message || 'Failed to set default template');
          throw err;
        }
      },

      resetAll: async () => {
        try {
          const fresh = await apiResetAllTemplates();
          const map: Record<string, VoucherTemplate> = {};
          fresh.forEach((t) => {
            map[t.id] = t;
            if (t.isDefault) map[t.voucherType] = t;
          });
          set({
            templateList: fresh,
            templates: map,
            activeTemplateId: fresh[0].id,
            activeType: fresh[0].voucherType,
            dirty: false,
          });
          toast.success('All templates have been reset to factory defaults');
        } catch (err: any) {
          toast.error('Failed to reset templates');
        }
      },

      updateActive: (patch: DeepPartial<VoucherTemplate>) => {
        const active = get().getActiveTemplate();
        if (!active) return;

        const merged = deepMerge(active, patch) as VoucherTemplate;
        const currentList = get().templateList;
        const updatedList = currentList.map((t) => (t.id === active.id ? merged : t));

        set({
          templateList: updatedList,
          templates: {
            ...get().templates,
            [active.id]: merged,
            [active.voucherType]: merged.isDefault ? merged : (get().templates[active.voucherType] || merged),
          },
          dirty: true,
        });
      },

      toggleColumnVisibility: (colKey: string) => {
        const active = get().getActiveTemplate();
        if (!active) return;

        const col = active.table.columns[colKey];
        if (!col) return;

        const updatedCols = {
          ...active.table.columns,
          [colKey]: {
            ...col,
            visible: !col.visible,
          },
        };

        get().updateActive({
          table: {
            columns: updatedCols,
          },
        });
      },

      updateColumnLabel: (colKey: string, label: string) => {
        const active = get().getActiveTemplate();
        if (!active) return;

        const col = active.table.columns[colKey];
        if (!col) return;

        const updatedCols = {
          ...active.table.columns,
          [colKey]: {
            ...col,
            label,
          },
        };

        get().updateActive({
          table: {
            columns: updatedCols,
          },
        });
      },

      updateColumnAlign: (colKey: string, align: 'Left' | 'Center' | 'Right') => {
        const active = get().getActiveTemplate();
        if (!active) return;

        const col = active.table.columns[colKey];
        if (!col) return;

        const updatedCols = {
          ...active.table.columns,
          [colKey]: {
            ...col,
            align,
          },
        };

        get().updateActive({
          table: {
            columns: updatedCols,
          },
        });
      },

      updateColumnWidth: (colKey: string, width: number) => {
        const active = get().getActiveTemplate();
        if (!active) return;

        const col = active.table.columns[colKey];
        if (!col) return;

        const updatedCols = {
          ...active.table.columns,
          [colKey]: {
            ...col,
            width,
          },
        };

        get().updateActive({
          table: {
            columns: updatedCols,
          },
        });
      },

      reorderColumns: (newOrder: string[]) => {
        get().updateActive({
          table: {
            columnOrder: newOrder,
          },
        });
      },

      setLivePreviewEnabled: (enabled: boolean) => {
        set({ livePreviewEnabled: enabled });
      },

      setZoom: (zoom: number) => {
        set({ zoom });
      },

      save: async () => {
        const active = get().getActiveTemplate();
        if (!active) return;

        try {
          const saved = await apiSaveTemplate(active);
          const list = await listTemplates();
          const map = { ...get().templates, [saved.id]: saved };
          if (saved.isDefault) {
            map[saved.voucherType] = saved;
          }
          set({
            templateList: list,
            templates: map,
            dirty: false,
          });
          toast.success(`Template "${saved.name}" saved successfully`);
        } catch (err: any) {
          toast.error(err.message || 'Failed to save template');
        }
      },

      reset: async () => {
        const active = get().getActiveTemplate();
        if (!active) return;

        try {
          const fresh = await apiResetTemplate(active.id);
          const list = await listTemplates();
          const map = { ...get().templates, [fresh.id]: fresh };
          if (fresh.isDefault) {
            map[fresh.voucherType] = fresh;
          }
          set({
            templateList: list,
            templates: map,
            dirty: false,
          });
          toast.success(`Template "${fresh.name}" reset to factory default`);
        } catch (err: any) {
          toast.error('Failed to reset template');
        }
      },
    }),
    {
      name: 'voucher-templates:store',
      partialize: (state) => ({
        activeTemplateId: state.activeTemplateId,
        activeType: state.activeType,
        livePreviewEnabled: state.livePreviewEnabled,
        zoom: state.zoom,
      }),
    }
  )
);
