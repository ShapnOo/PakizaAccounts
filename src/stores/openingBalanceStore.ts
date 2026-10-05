import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  OpeningBalanceLine,
  OpeningBalance,
  DEFAULT_CURRENCY,
  DEFAULT_RATE,
  FISCAL_YEAR_STARTS,
} from '../types/openingBalance';
import {
  getOpeningBalance,
  saveOpeningBalance,
} from '../services/openingBalanceService';
import { getActiveFiscalYear } from '../services/configService';
import {
  calculateOpeningBalanceTotals,
  handleLineCurrencyChange,
  round2,
} from '../lib/math/openingBalance';
import { openingBalanceSchema } from '../lib/validation/openingBalance';
import { toast } from 'sonner';

export interface OBStore {
  openingDate: string;
  lines: OpeningBalanceLine[];
  note: string;
  loading: boolean;
  saving: boolean;
  dirty: boolean;
  activeFiscalYear: string;
  fieldErrors: Record<string, string>;

  load: () => Promise<void>;
  setOpeningDate: (d: string) => void;
  addLine: () => void;
  duplicateLine: (id: string) => void;
  updateLine: (id: string, patch: Partial<OpeningBalanceLine>) => void;
  removeLine: (id: string) => void;
  setNote: (n: string) => void;
  save: () => Promise<boolean>;
  reset: () => Promise<void>;
  replaceLines: (rows: OpeningBalanceLine[]) => void;
  appendLines: (rows: OpeningBalanceLine[]) => void;
}

export const useOpeningBalanceStore = create<OBStore>()(
  persist(
    (set, get) => ({
      openingDate: '2026-07-01',
      lines: [],
      note: '',
      loading: true,
      saving: false,
      dirty: false,
      activeFiscalYear: '2026-2027',
      fieldErrors: {},

      load: async () => {
        set({ loading: true });
        try {
          const fy = await getActiveFiscalYear();
          const defaultDate = FISCAL_YEAR_STARTS[fy] || new Date().toISOString().split('T')[0];
          const data = await getOpeningBalance();

          set((state) => {
            // If user already has draft in localStorage and lines are present, preserve them unless empty
            const hasDraftLines = state.lines && state.lines.length > 0;
            return {
              activeFiscalYear: fy,
              openingDate: state.openingDate || data.openingDate || defaultDate,
              lines: hasDraftLines ? state.lines : data.lines,
              note: state.note !== undefined && state.note !== '' ? state.note : data.note || '',
              loading: false,
              dirty: hasDraftLines,
            };
          });
        } catch (err) {
          console.error('Failed to load opening balance', err);
          set({ loading: false });
        }
      },

      setOpeningDate: (d: string) => {
        set({ openingDate: d, dirty: true });
      },

      addLine: () => {
        const newLine: OpeningBalanceLine = {
          id: crypto.randomUUID(),
          accountHeadId: '',
          costCenterId: '',
          subsidiaryId: '',
          employeeId: '',
          vehicleId: '',
          reference: '',
          description: '',
          currency: DEFAULT_CURRENCY,
          exchangeRate: DEFAULT_RATE,
          debit: undefined,
          credit: undefined,
          debitBDT: undefined,
          creditBDT: undefined,
        };
        set((state) => ({
          lines: [newLine, ...state.lines],
          dirty: true,
        }));
      },

      duplicateLine: (id: string) => {
        set((state) => {
          const index = state.lines.findIndex((l) => l.id === id);
          if (index === -1) return state;
          const target = state.lines[index];
          const cloned: OpeningBalanceLine = {
            ...target,
            id: crypto.randomUUID(),
            reference: target.reference ? `${target.reference} (Copy)` : '',
          };
          const nextLines = [...state.lines];
          nextLines.splice(index + 1, 0, cloned);
          toast.info('Row duplicated');
          return { lines: nextLines, dirty: true };
        });
      },

      updateLine: (id: string, patch: Partial<OpeningBalanceLine>) => {
        set((state) => {
          const nextLines = state.lines.map((line) => {
            if (line.id !== id) return line;

            let updated: OpeningBalanceLine = { ...line, ...patch };

            // Currency switch handling
            if (patch.currency && patch.currency !== line.currency) {
              updated = handleLineCurrencyChange(updated, patch.currency);
            }

            // Exchange rate handling
            if (patch.exchangeRate !== undefined) {
              const rate = patch.exchangeRate > 0 ? patch.exchangeRate : 1;
              updated.exchangeRate = rate;
              if (updated.currency !== 'BDT') {
                if (updated.debit !== undefined && updated.debit > 0) {
                  updated.debitBDT = round2(updated.debit * rate);
                }
                if (updated.credit !== undefined && updated.credit > 0) {
                  updated.creditBDT = round2(updated.credit * rate);
                }
              }
            }

            // Mutual exclusion & BDT auto-conversion
            // Case A: Currency is BDT
            if (updated.currency === 'BDT') {
              updated.exchangeRate = 1;
              updated.debit = undefined;
              updated.credit = undefined;

              if (patch.debitBDT !== undefined) {
                updated.debitBDT = patch.debitBDT > 0 ? patch.debitBDT : undefined;
                if (patch.debitBDT > 0) {
                  updated.creditBDT = undefined;
                }
              }
              if (patch.creditBDT !== undefined) {
                updated.creditBDT = patch.creditBDT > 0 ? patch.creditBDT : undefined;
                if (patch.creditBDT > 0) {
                  updated.debitBDT = undefined;
                }
              }
            } else {
              // Case B: Foreign currency
              const rate = updated.exchangeRate > 0 ? updated.exchangeRate : 1;

              if (patch.debit !== undefined) {
                updated.debit = patch.debit > 0 ? patch.debit : undefined;
                if (patch.debit > 0) {
                  updated.debitBDT = round2(patch.debit * rate);
                  updated.credit = undefined;
                  updated.creditBDT = undefined;
                } else {
                  updated.debitBDT = undefined;
                }
              }
              if (patch.credit !== undefined) {
                updated.credit = patch.credit > 0 ? patch.credit : undefined;
                if (patch.credit > 0) {
                  updated.creditBDT = round2(patch.credit * rate);
                  updated.debit = undefined;
                  updated.debitBDT = undefined;
                } else {
                  updated.creditBDT = undefined;
                }
              }
            }

            return updated;
          });

          return { lines: nextLines, dirty: true };
        });
      },

      removeLine: (id: string) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.id !== id),
          dirty: true,
        }));
      },

      setNote: (n: string) => {
        set({ note: n, dirty: true });
      },

      save: async () => {
        const state = get();
        const { openingDate, lines, note } = state;

        // Check if there are lines
        if (lines.length === 0) {
          toast.error('Add at least two lines for double-entry opening balance');
          return false;
        }

        // Validate via zod
        const result = openingBalanceSchema.safeParse({ openingDate, lines, note });

        if (!result.success) {
          const errs: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            const key = issue.path.join('.');
            errs[key] = issue.message;
          });
          set({ fieldErrors: errs });

          // Surface specific message
          const balanceIssue = result.error.issues.find((i) =>
            i.message.includes('must equal')
          );
          if (balanceIssue) {
            toast.error('Opening balance difference must be 0.00 BDT to save');
          } else {
            toast.error(result.error.issues[0]?.message || 'Please fix validation errors');
          }
          return false;
        }

        set({ saving: true, fieldErrors: {} });

        try {
          const payload: OpeningBalance = {
            id: 'ob-saved',
            openingDate,
            lines,
            note,
            updatedAt: new Date().toISOString(),
          };

          await saveOpeningBalance(payload);
          set({ saving: false, dirty: false });
          toast.success('Opening balance successfully saved and committed!');
          return true;
        } catch (err) {
          console.error('Failed to save opening balance', err);
          set({ saving: false });
          toast.error('Failed to save opening balance');
          return false;
        }
      },

      reset: async () => {
        set({ loading: true, fieldErrors: {} });
        try {
          const data = await getOpeningBalance();
          set({
            openingDate: data.openingDate,
            lines: data.lines,
            note: data.note || '',
            loading: false,
            dirty: false,
          });
          toast.info('Restored saved opening balances');
        } catch (err) {
          console.error('Failed to reset', err);
          set({ loading: false });
        }
      },

      replaceLines: (rows: OpeningBalanceLine[]) => {
        set({ lines: rows, dirty: true, fieldErrors: {} });
        toast.success(`Loaded ${rows.length} lines into Opening Balance`);
      },

      appendLines: (rows: OpeningBalanceLine[]) => {
        set((state) => ({
          lines: [...state.lines, ...rows],
          dirty: true,
          fieldErrors: {},
        }));
        toast.success(`Appended ${rows.length} lines`);
      },
    }),
    {
      name: 'ob:draft',
      partialize: (state) => ({
        openingDate: state.openingDate,
        lines: state.lines,
        note: state.note,
      }),
    }
  )
);

// Selector for totals
export function selectTotals(state: OBStore) {
  return calculateOpeningBalanceTotals(state.lines);
}
