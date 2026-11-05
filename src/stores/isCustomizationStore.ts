import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ReportType,
  ISCustomRow,
  ISCustomization,
  MasterListItem,
} from '../types/isCustomization';
import {
  DEFAULT_COMPREHENSIVE,
  DEFAULT_SUMMARY,
  DEFAULT_TITLES,
  MASTER_LIST,
} from '../mock/isCustomization';
import {
  nextChildCode,
  nextParentCode,
  appendChildToFormula,
  removeChildFromFormula,
  renameCodeInFormula,
} from '../lib/isCustomizationMath';
import {
  getCustomizationState,
  saveCustomization,
  resetToDefault as serviceResetToDefault,
  listMasterList,
  addMasterListItem,
  deleteMasterListItem,
} from '../services/isCustomizationService';

interface ISCustomizationStoreState {
  activeReportType: ReportType;
  comprehensive: ISCustomization;
  summary: ISCustomization;
  masterList: MasterListItem[];
  loading: boolean;
  saving: boolean;
  dirty: boolean;
  newlyAddedRowId: string | null;

  setReportType: (t: ReportType, replaceTitle?: boolean) => void;
  setReportTitle: (title: string) => void;

  updateRow: (id: string, patch: Partial<ISCustomRow>) => void;
  addHead: (insertAfterRowId?: string) => string;
  addSubHead: (parentCode?: string, insertAfterRowId?: string) => string;
  addTextLine: (targetParentCode?: string) => string;
  addListLines: (items: MasterListItem[], parentCode: string) => void;
  removeRow: (id: string) => void;
  reorderRows: (fromIndex: number, toIndex: number) => void;
  clearNewlyAddedRowId: () => void;

  loadMasterList: () => Promise<void>;
  createMasterItem: (section: string, label: string) => Promise<MasterListItem>;
  deleteMasterItem: (id: string) => Promise<void>;

  load: () => Promise<void>;
  save: () => Promise<void>;
  resetToDefault: () => Promise<void>;
}

export const useISCustomizationStore = create<ISCustomizationStoreState>()(
  persist(
    (set, get) => ({
      activeReportType: 'Comprehensive',
      comprehensive: DEFAULT_COMPREHENSIVE,
      summary: DEFAULT_SUMMARY,
      masterList: MASTER_LIST,
      loading: false,
      saving: false,
      dirty: false,
      newlyAddedRowId: null,

      setReportType: (type: ReportType, replaceTitle = true) => {
        const { activeReportType } = get();
        if (type === activeReportType) return;

        const targetKey = type === 'Comprehensive' ? 'comprehensive' : 'summary';
        const targetCustom = get()[targetKey];

        const updatedTarget = replaceTitle
          ? { ...targetCustom, reportTitle: DEFAULT_TITLES[type] }
          : targetCustom;

        set({
          activeReportType: type,
          [targetKey]: updatedTarget,
        });
      },

      setReportTitle: (title: string) => {
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];
        set({
          [key]: {
            ...current,
            reportTitle: title,
          },
          dirty: true,
        });
      },

      updateRow: (id: string, patch: Partial<ISCustomRow>) => {
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];

        const oldRow = current.rows.find((r) => r.id === id);
        if (!oldRow) return;

        let updatedRows = [...current.rows];

        // 1. If code was changed
        if (patch.code && patch.code !== oldRow.code) {
          const oldCode = oldRow.code;
          const newCode = patch.code;

          // If parent code changed, update parentCode on its children
          if (oldRow.kind === 'parent') {
            updatedRows = updatedRows.map((r) => {
              if (r.parentCode === oldCode) {
                return { ...r, parentCode: newCode };
              }
              return r;
            });
          }

          // Update formulas referencing old code
          updatedRows = updatedRows.map((r) => {
            if (r.kind === 'parent' && r.formula) {
              const updatedFormula = renameCodeInFormula(r.formula, oldCode, newCode);
              return { ...r, formula: updatedFormula };
            }
            return r;
          });
        }

        // 2. If parent assignment changed for a child
        if (patch.parentCode && patch.parentCode !== oldRow.parentCode) {
          const oldParent = oldRow.parentCode;
          const newParent = patch.parentCode;

          // Remove code from old parent formula
          if (oldParent) {
            updatedRows = updatedRows.map((r) => {
              if (r.kind === 'parent' && r.code.toUpperCase() === oldParent.toUpperCase() && r.formula) {
                return {
                  ...r,
                  formula: removeChildFromFormula(r.formula, oldRow.code),
                };
              }
              return r;
            });
          }

          // Append code to new parent formula
          updatedRows = updatedRows.map((r) => {
            if (r.kind === 'parent' && r.code.toUpperCase() === newParent.toUpperCase()) {
              return {
                ...r,
                formula: appendChildToFormula(r.formula, oldRow.code),
              };
            }
            return r;
          });
        }

        // Apply direct patch
        updatedRows = updatedRows.map((r) => {
          if (r.id === id) {
            return { ...r, ...patch };
          }
          return r;
        });

        set({
          [key]: {
            ...current,
            rows: updatedRows,
          },
          dirty: true,
        });
      },

      addHead: (insertAfterRowId?: string) => {
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];

        const newLetter = nextParentCode(current.rows);
        const newId = `row-head-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

        let insertIndex = current.rows.length;
        if (insertAfterRowId) {
          const idx = current.rows.findIndex((r) => r.id === insertAfterRowId);
          if (idx >= 0) {
            insertIndex = idx + 1;
          }
        }

        const newRow: ISCustomRow = {
          id: newId,
          kind: 'parent',
          particulars: '',
          code: newLetter,
          formula: '',
          isCustom: true,
          order: insertIndex,
        };

        const updatedRows = [...current.rows];
        updatedRows.splice(insertIndex, 0, newRow);

        const reindexed = updatedRows.map((r, idx) => ({ ...r, order: idx }));

        set({
          [key]: {
            ...current,
            rows: reindexed,
          },
          dirty: true,
          newlyAddedRowId: newId,
        });

        return newId;
      },

      addSubHead: (parentCode?: string, insertAfterRowId?: string) => {
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];

        // Determine parent
        const parents = current.rows.filter((r) => r.kind === 'parent');
        let parentRow: ISCustomRow | undefined;

        if (parentCode) {
          parentRow = parents.find((p) => p.code.toUpperCase() === parentCode.toUpperCase());
        } else if (insertAfterRowId) {
          const refRow = current.rows.find((r) => r.id === insertAfterRowId);
          if (refRow?.kind === 'parent') {
            parentRow = refRow;
          } else if (refRow?.parentCode) {
            parentRow = parents.find((p) => p.code.toUpperCase() === refRow.parentCode?.toUpperCase());
          }
        }

        if (!parentRow && parents.length > 0) {
          parentRow = parents[parents.length - 1];
        }

        const chosenParentCode = parentRow ? parentRow.code : 'A';
        const newCode = nextChildCode(current.rows);
        const newId = `row-subhead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

        // Determine insertion index
        let insertIndex = current.rows.length;
        if (insertAfterRowId) {
          const refIdx = current.rows.findIndex((r) => r.id === insertAfterRowId);
          if (refIdx >= 0) insertIndex = refIdx + 1;
        } else if (parentRow) {
          const parentIdx = current.rows.findIndex((r) => r.id === parentRow.id);
          insertIndex = parentIdx + 1;
          for (let i = parentIdx + 1; i < current.rows.length; i++) {
            if (current.rows[i].parentCode?.toUpperCase() === chosenParentCode.toUpperCase()) {
              insertIndex = i + 1;
            } else if (current.rows[i].kind === 'parent') {
              break;
            }
          }
        }

        const newRow: ISCustomRow = {
          id: newId,
          kind: 'child',
          particulars: '',
          code: newCode,
          parentCode: chosenParentCode,
          isCustom: true,
          order: insertIndex,
        };

        const updatedRows = [...current.rows];
        updatedRows.splice(insertIndex, 0, newRow);

        // Auto-append child code to parent formula
        const syncedRows = updatedRows.map((r, idx) => {
          const base = { ...r, order: idx };
          if (base.kind === 'parent' && base.code.toUpperCase() === chosenParentCode.toUpperCase()) {
            return {
              ...base,
              formula: appendChildToFormula(base.formula, newCode),
            };
          }
          return base;
        });

        set({
          [key]: {
            ...current,
            rows: syncedRows,
          },
          dirty: true,
          newlyAddedRowId: newId,
        });

        return newId;
      },

      addTextLine: (targetParentCode?: string) => {
        return get().addSubHead(targetParentCode);
      },

      addListLines: (items: MasterListItem[], parentCode: string) => {
        if (!items || items.length === 0) return;
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];

        const parents = current.rows.filter((r) => r.kind === 'parent');
        const parentRow = parents.find((p) => p.code.toUpperCase() === parentCode.toUpperCase());
        const chosenParentCode = parentRow ? parentRow.code : 'A';

        let insertIndex = current.rows.length;
        if (parentRow) {
          const parentIdx = current.rows.findIndex((r) => r.id === parentRow.id);
          insertIndex = parentIdx + 1;
          for (let i = parentIdx + 1; i < current.rows.length; i++) {
            if (current.rows[i].parentCode?.toUpperCase() === chosenParentCode.toUpperCase()) {
              insertIndex = i + 1;
            } else if (current.rows[i].kind === 'parent') {
              break;
            }
          }
        }

        const updatedRows = [...current.rows];
        const addedCodes: string[] = [];

        items.forEach((item, offset) => {
          const newCode = nextChildCode([...updatedRows]);
          addedCodes.push(newCode);
          const newRow: ISCustomRow = {
            id: `row-list-${Date.now()}-${offset}-${Math.random().toString(36).substring(2, 6)}`,
            kind: 'child',
            particulars: item.label,
            code: newCode,
            parentCode: chosenParentCode,
            isCustom: true,
            order: insertIndex + offset,
          };
          updatedRows.splice(insertIndex + offset, 0, newRow);
        });

        // Auto-append all new codes to parent's formula
        const syncedRows = updatedRows.map((r, idx) => {
          const base = { ...r, order: idx };
          if (base.kind === 'parent' && base.code.toUpperCase() === chosenParentCode.toUpperCase()) {
            let formula = base.formula;
            for (const code of addedCodes) {
              formula = appendChildToFormula(formula, code);
            }
            return { ...base, formula };
          }
          return base;
        });

        set({
          [key]: {
            ...current,
            rows: syncedRows,
          },
          dirty: true,
          newlyAddedRowId: addedCodes[0] ?? null,
        });
      },

      removeRow: (id: string) => {
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];

        const target = current.rows.find((r) => r.id === id);
        if (!target) return;

        let remainingRows = current.rows.filter((r) => r.id !== id);

        if (target.kind === 'parent') {
          // Cascade delete: remove all children belonging to this parent
          const parentCode = target.code;
          remainingRows = remainingRows.filter((r) => r.parentCode?.toUpperCase() !== parentCode.toUpperCase());

          // Clean references to this parent letter from all other formulas
          remainingRows = remainingRows.map((r) => {
            if (r.kind === 'parent' && r.formula) {
              return {
                ...r,
                formula: removeChildFromFormula(r.formula, parentCode),
              };
            }
            return r;
          });
        } else {
          // Child deleted: remove its code from parent's formula
          const childCode = target.code;
          const parentCode = target.parentCode;
          remainingRows = remainingRows.map((r) => {
            if (
              r.kind === 'parent' &&
              r.formula &&
              (!parentCode || r.code.toUpperCase() === parentCode.toUpperCase())
            ) {
              return {
                ...r,
                formula: removeChildFromFormula(r.formula, childCode),
              };
            }
            return r;
          });
        }

        const reindexed = remainingRows.map((r, idx) => ({ ...r, order: idx }));

        set({
          [key]: {
            ...current,
            rows: reindexed,
          },
          dirty: true,
        });
      },

      reorderRows: (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];

        const updated = [...current.rows];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);

        const reindexed = updated.map((r, idx) => ({ ...r, order: idx }));

        set({
          [key]: {
            ...current,
            rows: reindexed,
          },
          dirty: true,
        });
      },

      clearNewlyAddedRowId: () => {
        set({ newlyAddedRowId: null });
      },

      loadMasterList: async () => {
        try {
          const list = await listMasterList();
          set({ masterList: list });
        } catch (err) {
          console.error('Failed to load master list:', err);
        }
      },

      createMasterItem: async (section: string, label: string) => {
        const item = await addMasterListItem(section, label);
        const list = await listMasterList();
        set({ masterList: list });
        return item;
      },

      deleteMasterItem: async (id: string) => {
        await deleteMasterListItem(id);
        const list = await listMasterList();
        set({ masterList: list });
      },

      load: async () => {
        set({ loading: true });
        try {
          const [state, mList] = await Promise.all([
            getCustomizationState(),
            listMasterList(),
          ]);
          set({
            comprehensive: state.comprehensive,
            summary: state.summary,
            masterList: mList,
            loading: false,
            dirty: false,
          });
        } catch (err) {
          console.error('Failed to load IS customization:', err);
          set({ loading: false });
        }
      },

      save: async () => {
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        const current = get()[key];

        set({ saving: true });
        try {
          await saveCustomization(current);
          set({ saving: false, dirty: false });
        } catch (err) {
          console.error('Failed to save IS customization:', err);
          set({ saving: false });
          throw err;
        }
      },

      resetToDefault: async () => {
        const { activeReportType } = get();
        const key = activeReportType === 'Comprehensive' ? 'comprehensive' : 'summary';
        set({ loading: true });
        try {
          const fresh = await serviceResetToDefault(activeReportType);
          set({
            [key]: fresh,
            loading: false,
            dirty: false,
          });
        } catch (err) {
          console.error('Failed to reset IS customization:', err);
          set({ loading: false });
        }
      },
    }),
    {
      name: 'is-custom:ui-state',
      partialize: (state) => ({
        activeReportType: state.activeReportType,
      }),
    }
  )
);

// Selectors
export const selectActive = (state: ISCustomizationStoreState): ISCustomization =>
  state.activeReportType === 'Comprehensive'
    ? state.comprehensive
    : state.summary;

export const selectRows = (state: ISCustomizationStoreState): ISCustomRow[] =>
  state.activeReportType === 'Comprehensive'
    ? state.comprehensive.rows
    : state.summary.rows;
