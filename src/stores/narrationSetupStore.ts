import { create } from 'zustand';
import { NarrationTemplate } from '../types/narrationSetup';
import {
  getNarrationTemplates,
  saveNarrationTemplates,
  resetNarrationTemplatesToDefault,
} from '../services/narrationSetupService';

interface NarrationSetupState {
  templates: NarrationTemplate[];
  loading: boolean;
  loadTemplates: () => Promise<void>;
  addTemplate: (item: Omit<NarrationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<void>;
  updateTemplate: (id: string, patch: Partial<NarrationTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  toggleTemplateActive: (id: string) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

export const useNarrationSetupStore = create<NarrationSetupState>((set, get) => ({
  templates: [],
  loading: false,

  loadTemplates: async () => {
    set({ loading: true });
    try {
      const data = await getNarrationTemplates();
      set({ templates: data });
    } finally {
      set({ loading: false });
    }
  },

  addTemplate: async (item) => {
    const newTemplate: NarrationTemplate = {
      ...item,
      id: `narr-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTemplate, ...get().templates];
    set({ templates: updated });
    await saveNarrationTemplates(updated);
  },

  updateTemplate: async (id, patch) => {
    const updated = get().templates.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    );
    set({ templates: updated });
    await saveNarrationTemplates(updated);
  },

  deleteTemplate: async (id) => {
    const updated = get().templates.filter((t) => t.id !== id);
    set({ templates: updated });
    await saveNarrationTemplates(updated);
  },

  toggleTemplateActive: async (id) => {
    const updated = get().templates.map((t) =>
      t.id === id ? { ...t, isActive: !t.isActive, updatedAt: new Date().toISOString() } : t
    );
    set({ templates: updated });
    await saveNarrationTemplates(updated);
  },

  resetToDefault: async () => {
    set({ loading: true });
    try {
      const defaults = await resetNarrationTemplatesToDefault();
      set({ templates: defaults });
    } finally {
      set({ loading: false });
    }
  },
}));

