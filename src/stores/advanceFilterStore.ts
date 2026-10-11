import { create, UseBoundStore, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { AdvanceFilterState, FilterCondition, FilterOperator, VALUELESS_OPERATORS } from '../types/advanceFilter';
import { DEFAULT_ADVANCE_FILTER } from '../mock/advanceFilter';
import { compileAdvanceFilter } from '../lib/advanceFilterPredicate';

export interface AdvanceFilterStore {
  state: AdvanceFilterState;
  setCombinator: (combinator: 'AND' | 'OR') => void;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  addCondition: () => void;
  removeCondition: (id: string) => void;
  updateCondition: (id: string, patch: Partial<FilterCondition>) => void;
  reset: () => void;
  getPredicate: () => (row: any) => boolean;
}

export function createAdvanceFilterStore(storageKey: string): UseBoundStore<StoreApi<AdvanceFilterStore>> {
  return create<AdvanceFilterStore>()(
    persist(
      (set, get) => ({
        state: DEFAULT_ADVANCE_FILTER,

        setCombinator: (combinator) =>
          set((s) => ({
            state: { ...s.state, combinator },
          })),

        toggleCollapsed: () =>
          set((s) => ({
            state: { ...s.state, collapsed: !s.state.collapsed },
          })),

        setCollapsed: (collapsed) =>
          set((s) => ({
            state: { ...s.state, collapsed },
          })),

        addCondition: () =>
          set((s) => {
            if (s.state.conditions.length >= 10) {
              toast.error('Maximum 10 filter conditions allowed');
              return s;
            }
            const newCondition: FilterCondition = {
              id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              fieldKey: 'accountsHead',
              operator: 'is',
              value: null,
            };
            return {
              state: {
                ...s.state,
                conditions: [...s.state.conditions, newCondition],
              },
            };
          }),

        removeCondition: (id) =>
          set((s) => ({
            state: {
              ...s.state,
              conditions: s.state.conditions.filter((c) => c.id !== id),
            },
          })),

        updateCondition: (id, patch) =>
          set((s) => {
            const updatedConditions = s.state.conditions.map((condition) => {
              if (condition.id !== id) return condition;

              // If field changed, reset operator and value
              if (patch.fieldKey && patch.fieldKey !== condition.fieldKey) {
                return {
                  ...condition,
                  fieldKey: patch.fieldKey,
                  operator: 'is' as FilterOperator,
                  value: null,
                };
              }

              // If operator changed to valueless, clear value
              if (patch.operator && patch.operator !== condition.operator) {
                const isValueless = VALUELESS_OPERATORS.includes(patch.operator);
                const isBetween = patch.operator === 'between';
                let newVal = condition.value;
                if (isValueless) {
                  newVal = null;
                } else if (isBetween && (!Array.isArray(newVal) || (newVal as any).length !== 2)) {
                  newVal = [null, null] as any;
                } else if (!isBetween && Array.isArray(newVal)) {
                  newVal = null;
                }
                return {
                  ...condition,
                  operator: patch.operator,
                  value: newVal,
                };
              }

              return {
                ...condition,
                ...patch,
              };
            });

            return {
              state: {
                ...s.state,
                conditions: updatedConditions,
              },
            };
          }),

        reset: () => {
          set({
            state: {
              combinator: 'AND',
              conditions: [],
              collapsed: true,
            },
          });
          toast.info('All filters reset. Showing all records without filters.');
        },

        getPredicate: () => {
          return compileAdvanceFilter(get().state);
        },
      }),
      {
        name: storageKey,
      }
    )
  );
}

export const useAdvanceFilterStore = createAdvanceFilterStore('advance-filter:gl-v2');
export const useJournalAdvanceFilterStore = createAdvanceFilterStore('advance-filter:journal-v2');

