import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrencySetup, ExchangeRate } from '../types/currency';
import {
  listCurrencySetups,
  createCurrencySetup,
  updateCurrencySetup,
  deleteCurrencySetup,
  listExchangeRates,
  upsertRate as apiUpsertRate,
  setBaseCurrency as apiSetBaseCurrency,
} from '../services/currencyService';
import { toast } from 'sonner';

export interface CurrencyStoreState {
  setups: CurrencySetup[];
  rates: ExchangeRate[];
  loading: boolean;
  saving: boolean;
  dirty: boolean;

  load: () => Promise<void>;
  addSetup: (s: Omit<CurrencySetup, 'id'>, initialRate?: number) => Promise<CurrencySetup>;
  updateSetup: (id: string, patch: Partial<CurrencySetup>) => Promise<CurrencySetup>;
  deleteSetup: (id: string) => Promise<void>;
  upsertRate: (currencyId: string, rate: number, date: string) => Promise<void>;
  setBase: (currencyId: string) => Promise<void>;
}

export const useCurrencyStore = create<CurrencyStoreState>()(
  persist(
    (set, get) => ({
      setups: [],
      rates: [],
      loading: true,
      saving: false,
      dirty: false,

      load: async () => {
        set({ loading: true });
        try {
          const [loadedSetups, loadedRates] = await Promise.all([
            listCurrencySetups(),
            listExchangeRates(),
          ]);

          set({
            setups: loadedSetups,
            rates: loadedRates,
            loading: false,
          });
        } catch (err) {
          console.error('Failed to load currency data', err);
          set({ loading: false });
        }
      },

      addSetup: async (data: Omit<CurrencySetup, 'id'>, initialRate: number = 1) => {
        set({ saving: true });
        try {
          const created = await createCurrencySetup(data, initialRate);
          const updatedRates = await listExchangeRates();
          set((state) => ({
            setups: [...state.setups, created],
            rates: updatedRates,
            saving: false,
          }));
          toast.success(`Currency ${created.code} configured successfully`);
          return created;
        } catch (err: any) {
          set({ saving: false });
          toast.error(err.message || 'Failed to create currency setup');
          throw err;
        }
      },

      updateSetup: async (id: string, patch: Partial<CurrencySetup>) => {
        set({ saving: true });
        try {
          const updated = await updateCurrencySetup(id, patch);
          set((state) => ({
            setups: state.setups.map((s) => (s.id === id ? updated : s)),
            saving: false,
          }));
          toast.success(`Currency ${updated.code} updated`);
          return updated;
        } catch (err: any) {
          set({ saving: false });
          toast.error(err.message || 'Failed to update currency setup');
          throw err;
        }
      },

      deleteSetup: async (id: string) => {
        try {
          await deleteCurrencySetup(id);
          set((state) => ({
            setups: state.setups.filter((s) => s.id !== id),
            rates: state.rates.filter((r) => r.currencyId !== id),
          }));
          toast.success('Currency configuration removed');
        } catch (err: any) {
          toast.error(err.message || 'Failed to delete currency');
          throw err;
        }
      },

      upsertRate: async (currencyId: string, rate: number, date: string) => {
        try {
          const updated = await apiUpsertRate(currencyId, rate, date);
          set((state) => ({
            rates: state.rates.map((r) => (r.currencyId === currencyId ? updated : r)),
          }));
          toast.success('Exchange rate updated');
        } catch (err: any) {
          toast.error(err.message || 'Failed to update rate');
        }
      },

      setBase: async (currencyId: string) => {
        try {
          const updatedRates = await apiSetBaseCurrency(currencyId);
          set({ rates: updatedRates });
          const setup = get().setups.find((s) => s.id === currencyId);
          toast.success(`${setup?.code || 'Currency'} set as base currency (Rate = 1.00)`);
        } catch (err: any) {
          toast.error(err.message || 'Failed to set base currency');
        }
      },
    }),
    {
      name: 'currency:store',
      partialize: (state) => ({
        setups: state.setups,
        rates: state.rates,
      }),
    }
  )
);

// Derived selectors
export const selectBaseCurrencyId = (state: CurrencyStoreState): string | null => {
  const baseRate = state.rates.find((r) => r.isBase);
  return baseRate ? baseRate.currencyId : null;
};

export const selectRateFor = (
  state: CurrencyStoreState,
  currencyId: string
): ExchangeRate | undefined => {
  return state.rates.find((r) => r.currencyId === currencyId);
};

export const selectSetupFor = (
  state: CurrencyStoreState,
  currencyId: string
): CurrencySetup | undefined => {
  return state.setups.find((s) => s.id === currencyId);
};
