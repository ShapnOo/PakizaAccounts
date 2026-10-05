import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomField, CustomFieldContext } from '../types/customField';
import {
  listCustomFields,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  reorderCustomFields,
} from '../services/customFieldService';
import { toast } from 'sonner';

export interface CustomFieldStoreState {
  fields: CustomField[];
  activeContext: CustomFieldContext;
  loading: boolean;
  searchQuery: string;
  typeFilter: string[];
  mandatoryFilter: 'All' | 'Yes' | 'No';
  activeFilter: 'All' | 'Active' | 'Inactive';
  density: 'comfortable' | 'compact';

  load: (context?: CustomFieldContext) => Promise<void>;
  setContext: (c: CustomFieldContext) => void;
  setSearchQuery: (q: string) => void;
  setTypeFilter: (types: string[]) => void;
  setMandatoryFilter: (val: 'All' | 'Yes' | 'No') => void;
  setActiveFilter: (val: 'All' | 'Active' | 'Inactive') => void;
  setDensity: (d: 'comfortable' | 'compact') => void;

  add: (
    payload: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ) => Promise<CustomField>;
  update: (id: string, patch: Partial<CustomField>) => Promise<CustomField>;
  remove: (id: string) => Promise<void>;
  duplicate: (id: string) => Promise<CustomField>;
  toggleActive: (id: string) => Promise<void>;
  toggleMandatory: (id: string) => Promise<void>;
  reorder: (orderedIds: string[]) => Promise<void>;
}

export const useCustomFieldStore = create<CustomFieldStoreState>()(
  persist(
    (set, get) => ({
      fields: [],
      activeContext: 'journal',
      loading: true,
      searchQuery: '',
      typeFilter: [],
      mandatoryFilter: 'All',
      activeFilter: 'All',
      density: 'comfortable',

      load: async (context?: CustomFieldContext) => {
        set({ loading: true });
        try {
          const loaded = await listCustomFields();
          set({
            fields: loaded,
            loading: false,
            ...(context ? { activeContext: context } : {}),
          });
        } catch (err) {
          console.error('Failed to load custom fields:', err);
          set({ loading: false });
        }
      },

      setContext: (c: CustomFieldContext) => {
        set({ activeContext: c });
      },

      setSearchQuery: (q: string) => set({ searchQuery: q }),
      setTypeFilter: (types: string[]) => set({ typeFilter: types }),
      setMandatoryFilter: (val: 'All' | 'Yes' | 'No') =>
        set({ mandatoryFilter: val }),
      setActiveFilter: (val: 'All' | 'Active' | 'Inactive') =>
        set({ activeFilter: val }),
      setDensity: (d: 'comfortable' | 'compact') => set({ density: d }),

      add: async (payload) => {
        try {
          const created = await createCustomField(payload);
          set((state) => ({
            fields: [...state.fields, created].sort((a, b) => a.order - b.order),
          }));
          toast.success(`Custom field "${created.label}" added successfully`);
          return created;
        } catch (err: any) {
          toast.error(err.message || 'Failed to add custom field');
          throw err;
        }
      },

      update: async (id, patch) => {
        // Optimistic update
        const prev = get().fields;
        set((state) => ({
          fields: state.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        }));

        try {
          const updated = await updateCustomField(id, patch);
          set((state) => ({
            fields: state.fields.map((f) => (f.id === id ? updated : f)),
          }));
          toast.success(`Custom field "${updated.label}" updated`);
          return updated;
        } catch (err: any) {
          set({ fields: prev });
          toast.error(err.message || 'Failed to update custom field');
          throw err;
        }
      },

      remove: async (id) => {
        const target = get().fields.find((f) => f.id === id);
        const prev = get().fields;
        set((state) => ({
          fields: state.fields.filter((f) => f.id !== id),
        }));

        try {
          await deleteCustomField(id);
          toast.success(
            target
              ? `Custom field "${target.label}" deleted`
              : 'Custom field deleted'
          );
        } catch (err: any) {
          set({ fields: prev });
          toast.error(err.message || 'Failed to delete custom field');
          throw err;
        }
      },

      duplicate: async (id) => {
        const target = get().fields.find((f) => f.id === id);
        if (!target) throw new Error('Field not found');

        const newPayload: Omit<
          CustomField,
          'id' | 'createdAt' | 'updatedAt' | 'order'
        > = {
          context: target.context,
          label: `${target.label} (Copy)`,
          dataType: target.dataType,
          mandatory: target.mandatory,
          activeStatus: target.activeStatus,
          options: target.options ? [...target.options] : undefined,
          defaultValue: target.defaultValue,
        };

        return get().add(newPayload);
      },

      toggleActive: async (id) => {
        const target = get().fields.find((f) => f.id === id);
        if (!target) return;
        const newStatus = target.activeStatus === 'Active' ? 'Inactive' : 'Active';

        // Optimistic update
        const prev = get().fields;
        set((state) => ({
          fields: state.fields.map((f) =>
            f.id === id ? { ...f, activeStatus: newStatus } : f
          ),
        }));

        try {
          await updateCustomField(id, { activeStatus: newStatus });
          toast.success(
            `"${target.label}" marked as ${newStatus}`
          );
        } catch (err: any) {
          set({ fields: prev });
          toast.error(err.message || 'Failed to toggle status');
        }
      },

      toggleMandatory: async (id) => {
        const target = get().fields.find((f) => f.id === id);
        if (!target) return;
        const nextVal = !target.mandatory;

        // Optimistic update
        const prev = get().fields;
        set((state) => ({
          fields: state.fields.map((f) =>
            f.id === id ? { ...f, mandatory: nextVal } : f
          ),
        }));

        try {
          await updateCustomField(id, { mandatory: nextVal });
          toast.success(
            `"${target.label}" set to ${nextVal ? 'Required (Yes)' : 'Optional (No)'}`
          );
        } catch (err: any) {
          set({ fields: prev });
          toast.error(err.message || 'Failed to update mandatory flag');
        }
      },

      reorder: async (orderedIds: string[]) => {
        const ctx = get().activeContext;
        const prev = get().fields;

        // Optimistic update
        const reordered = prev.map((f) => {
          if (f.context !== ctx) return f;
          const idx = orderedIds.indexOf(f.id);
          return idx === -1 ? f : { ...f, order: idx };
        });

        set({ fields: reordered });

        try {
          await reorderCustomFields(ctx, orderedIds);
          toast.success('Field order updated');
        } catch (err: any) {
          set({ fields: prev });
          toast.error(err.message || 'Failed to reorder fields');
        }
      },
    }),
    {
      name: 'cf:ui',
      partialize: (state) => ({
        activeContext: state.activeContext,
        density: state.density,
      }),
    }
  )
);
