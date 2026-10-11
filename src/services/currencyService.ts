import {
  CurrencySetup,
  ExchangeRate,
  RateHistoryEntry,
} from '../types/currency';
import { MOCK_CURRENCY_SETUPS } from '../mock/currencySetup';
import { MOCK_RATES } from '../mock/exchangeRates';
import { MOCK_RATE_HISTORY } from '../mock/rateHistory';
import { delay } from '../lib/delay';

const LS_SETUPS = 'currency:setups';
const LS_RATES = 'currency:rates';
const LS_HISTORY = 'currency:history';

export async function listCurrencySetups(): Promise<CurrencySetup[]> {
  await delay(250);
  try {
    const raw = localStorage.getItem(LS_SETUPS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse setups', err);
  }
  return MOCK_CURRENCY_SETUPS;
}

export async function createCurrencySetup(
  payload: Omit<CurrencySetup, 'id'>,
  initialRate?: number,
  effectiveDate?: string
): Promise<CurrencySetup> {
  await delay(350);
  const setups = await listCurrencySetups();
  const newId = `c-${Date.now()}`;
  const next: CurrencySetup = { ...payload, id: newId };
  const updatedSetups = [...setups, next];
  localStorage.setItem(LS_SETUPS, JSON.stringify(updatedSetups));

  // Also create an initial rate entry
  const rates = await listExchangeRates();
  const rateVal = initialRate && initialRate > 0 ? initialRate : 1;
  const today = new Date().toISOString().split('T')[0];
  const rateDate = effectiveDate && effectiveDate >= today ? effectiveDate : today;
  const newRate: ExchangeRate = {
    id: `r-${Date.now()}`,
    currencyId: newId,
    rate: rateVal,
    effectiveDate: rateDate,
    isBase: false,
  };
  localStorage.setItem(LS_RATES, JSON.stringify([...rates, newRate]));

  // Add to history
  await addRateHistoryEntry(newId, rateVal, newRate.effectiveDate);

  return next;
}

export async function updateCurrencySetup(
  id: string,
  patch: Partial<CurrencySetup>
): Promise<CurrencySetup> {
  await delay(250);
  const setups = await listCurrencySetups();
  const updated = setups.map((s) => (s.id === id ? { ...s, ...patch } : s));
  localStorage.setItem(LS_SETUPS, JSON.stringify(updated));
  const found = updated.find((s) => s.id === id);
  if (!found) throw new Error(`Currency setup not found: ${id}`);
  return found;
}

export async function deleteCurrencySetup(id: string): Promise<void> {
  await delay(250);
  const rates = await listExchangeRates();
  const targetRate = rates.find((r) => r.currencyId === id);
  if (targetRate?.isBase) {
    throw new Error('Base currency cannot be deleted');
  }

  const setups = await listCurrencySetups();
  const updatedSetups = setups.filter((s) => s.id !== id);
  localStorage.setItem(LS_SETUPS, JSON.stringify(updatedSetups));

  const updatedRates = rates.filter((r) => r.currencyId !== id);
  localStorage.setItem(LS_RATES, JSON.stringify(updatedRates));
}

function computeRatesWithHistory(rates: ExchangeRate[]): ExchangeRate[] {
  const today = new Date().toISOString().split('T')[0];
  let allHistory: RateHistoryEntry[] = [];
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    allHistory = raw ? JSON.parse(raw) : MOCK_RATE_HISTORY;
  } catch {
    allHistory = MOCK_RATE_HISTORY;
  }

  return rates.map((r) => {
    if (r.isBase) {
      return { ...r, rate: 1, scheduledRate: undefined };
    }

    const curHistory = allHistory.filter((h) => h.currencyId === r.currencyId);
    if (curHistory.length === 0) {
      return r;
    }

    // Active entries where effectiveDate <= today
    const activeEntries = curHistory
      .filter((h) => h.effectiveDate <= today)
      .sort((a, b) => {
        if (b.effectiveDate !== a.effectiveDate) {
          return b.effectiveDate.localeCompare(a.effectiveDate);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    // Scheduled upcoming entries where effectiveDate > today
    const upcomingEntries = curHistory
      .filter((h) => h.effectiveDate > today)
      .sort((a, b) => {
        if (a.effectiveDate !== b.effectiveDate) {
          return a.effectiveDate.localeCompare(b.effectiveDate);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    const active = activeEntries[0];
    const upcoming = upcomingEntries[0];

    return {
      ...r,
      rate: active ? active.rate : r.rate,
      effectiveDate: active ? active.effectiveDate : r.effectiveDate,
      scheduledRate: upcoming
        ? { rate: upcoming.rate, effectiveDate: upcoming.effectiveDate }
        : undefined,
    };
  });
}

export async function listExchangeRates(): Promise<ExchangeRate[]> {
  await delay(250);
  let baseRates: ExchangeRate[] = MOCK_RATES;
  try {
    const raw = localStorage.getItem(LS_RATES);
    if (raw) baseRates = JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse rates', err);
  }
  return computeRatesWithHistory(baseRates);
}

export async function upsertRate(
  currencyId: string,
  rate: number,
  effectiveDate: string
): Promise<ExchangeRate> {
  await delay(300);
  const rawRates = await listExchangeRates();
  const existing = rawRates.find((r) => r.currencyId === currencyId);

  // If this is the base currency, rate must be 1 (Rule C9)
  const finalRate = existing?.isBase ? 1 : rate;

  // 1. Add historical/scheduled entry into history
  await addRateHistoryEntry(currencyId, finalRate, effectiveDate);

  // 2. Recompute rates against complete history
  const today = new Date().toISOString().split('T')[0];
  let nextRates: ExchangeRate[];

  if (existing) {
    nextRates = rawRates.map((r) => {
      if (r.currencyId !== currencyId) return r;
      if (effectiveDate > today) {
        // Keep current active rate intact, attach scheduled rate
        return {
          ...r,
          scheduledRate: { rate: finalRate, effectiveDate },
        };
      }
      return {
        ...r,
        rate: finalRate,
        effectiveDate,
      };
    });
  } else {
    const isFuture = effectiveDate > today;
    const newRate: ExchangeRate = {
      id: `r-${Date.now()}`,
      currencyId,
      rate: isFuture ? 1 : finalRate,
      effectiveDate: isFuture ? today : effectiveDate,
      isBase: false,
      scheduledRate: isFuture ? { rate: finalRate, effectiveDate } : undefined,
    };
    nextRates = [...rawRates, newRate];
  }

  const calculatedRates = computeRatesWithHistory(nextRates);
  localStorage.setItem(LS_RATES, JSON.stringify(calculatedRates));

  const updatedRate = calculatedRates.find((r) => r.currencyId === currencyId);
  return (
    updatedRate || {
      id: `r-${Date.now()}`,
      currencyId,
      rate: finalRate,
      effectiveDate,
      isBase: false,
    }
  );
}

export async function bulkUpsertRates(
  updates: { currencyId: string; rate: number; effectiveDate: string }[]
): Promise<ExchangeRate[]> {
  for (const item of updates) {
    await upsertRate(item.currencyId, item.rate, item.effectiveDate);
  }
  return listExchangeRates();
}

export async function setBaseCurrency(currencyId: string): Promise<ExchangeRate[]> {
  await delay(300);
  const rates = await listExchangeRates();

  // ENFORCE RULE C1: only ONE base currency
  // ENFORCE RULE C9: base currency rate is locked to 1
  const nextRates = rates.map((r) => {
    if (r.currencyId === currencyId) {
      return { ...r, isBase: true, rate: 1 };
    }
    return { ...r, isBase: false };
  });

  localStorage.setItem(LS_RATES, JSON.stringify(nextRates));
  return nextRates;
}

export async function getRateHistory(currencyId: string): Promise<RateHistoryEntry[]> {
  await delay(200);
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    const allHistory: RateHistoryEntry[] = raw ? JSON.parse(raw) : MOCK_RATE_HISTORY;
    return allHistory
      .filter((h) => h.currencyId === currencyId)
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  } catch (err) {
    return MOCK_RATE_HISTORY.filter((h) => h.currencyId === currencyId);
  }
}

async function addRateHistoryEntry(
  currencyId: string,
  rate: number,
  effectiveDate: string
): Promise<void> {
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    const allHistory: RateHistoryEntry[] = raw ? JSON.parse(raw) : MOCK_RATE_HISTORY;
    const newEntry: RateHistoryEntry = {
      id: `h-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      currencyId,
      rate,
      effectiveDate,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LS_HISTORY, JSON.stringify([newEntry, ...allHistory]));
  } catch (err) {
    console.warn('Failed to add rate history', err);
  }
}
