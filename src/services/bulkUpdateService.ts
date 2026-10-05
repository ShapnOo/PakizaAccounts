import { FilterCriteria, UpdateField, UpdateHistoryRow, VoucherRow } from '../types/bulk';
import { MOCK_UPDATE_HISTORY } from '../mock/updateHistory';
import { MOCK_BULK_VOUCHERS } from '../mock/bulkVouchers';
import { delay } from '../lib/delay';

const LS_UPDATE_KEY = 'bulk-update-history-v2';
const LS_VOUCHERS_KEY = 'bulk-vouchers-data-v2';

export async function listBulkDataVouchers(): Promise<VoucherRow[]> {
  const raw = localStorage.getItem(LS_VOUCHERS_KEY);
  if (!raw) {
    localStorage.setItem(LS_VOUCHERS_KEY, JSON.stringify(MOCK_BULK_VOUCHERS));
    return MOCK_BULK_VOUCHERS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : MOCK_BULK_VOUCHERS;
  } catch (e) {
    return MOCK_BULK_VOUCHERS;
  }
}

export async function listUpdateHistory(): Promise<UpdateHistoryRow[]> {
  await delay(250);
  const raw = localStorage.getItem(LS_UPDATE_KEY);
  if (!raw) {
    localStorage.setItem(LS_UPDATE_KEY, JSON.stringify(MOCK_UPDATE_HISTORY));
    return MOCK_UPDATE_HISTORY;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : MOCK_UPDATE_HISTORY;
  } catch (e) {
    return MOCK_UPDATE_HISTORY;
  }
}

export async function filterVouchers(criteria: FilterCriteria): Promise<VoucherRow[]> {
  await delay(350);
  const all = await listBulkDataVouchers();

  return all.filter((v) => {
    if (criteria.dateFrom && v.voucherDate < criteria.dateFrom) return false;
    if (criteria.dateTo && v.voucherDate > criteria.dateTo) return false;
    if (criteria.accountsName && criteria.accountsName.trim()) {
      if (
        !v.accountsHead.toLowerCase().includes(criteria.accountsName.toLowerCase()) &&
        v.accountsHead !== criteria.accountsName
      ) {
        return false;
      }
    }
    if (criteria.amountMin != null && !isNaN(criteria.amountMin) && v.amount < criteria.amountMin) {
      return false;
    }
    if (criteria.amountMax != null && !isNaN(criteria.amountMax) && v.amount > criteria.amountMax) {
      return false;
    }
    if (criteria.costCenter && criteria.costCenter.trim()) {
      if (!v.costCenter || !v.costCenter.toLowerCase().includes(criteria.costCenter.toLowerCase())) {
        return false;
      }
    }
    if (criteria.subsidy && criteria.subsidy.trim()) {
      if (!v.subsidy || !v.subsidy.toLowerCase().includes(criteria.subsidy.toLowerCase())) {
        return false;
      }
    }
    if (criteria.employee && criteria.employee.trim()) {
      if (!v.employee || !v.employee.toLowerCase().includes(criteria.employee.toLowerCase())) {
        return false;
      }
    }
    if (criteria.vehicle && criteria.vehicle.trim()) {
      if (!v.vehicle || !v.vehicle.toLowerCase().includes(criteria.vehicle.toLowerCase())) {
        return false;
      }
    }
    return true;
  });
}

export async function bulkUpdateVouchers(
  ids: string[],
  field: UpdateField,
  newValue: string
): Promise<{ updated: number }> {
  await delay(450);
  const all = await listBulkDataVouchers();
  const idSet = new Set(ids);

  const updatedVouchers = all.map((v) => {
    if (idSet.has(v.id)) {
      return {
        ...v,
        [field]: newValue,
      };
    }
    return v;
  });

  localStorage.setItem(LS_VOUCHERS_KEY, JSON.stringify(updatedVouchers));
  return { updated: ids.length };
}

export async function recordUpdate(
  payload: Omit<UpdateHistoryRow, 'id' | 'updateDate'>
): Promise<UpdateHistoryRow> {
  await delay(300);
  const all = await listUpdateHistory();
  const next: UpdateHistoryRow = {
    ...payload,
    id: `uh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    updateDate: new Date().toISOString(),
  };
  const updated = [next, ...all];
  localStorage.setItem(LS_UPDATE_KEY, JSON.stringify(updated));
  return next;
}

export async function getVouchersByNos(voucherNos: string[]): Promise<VoucherRow[]> {
  await delay(200);
  const all = await listBulkDataVouchers();
  const noSet = new Set(voucherNos);
  return all.filter((v) => noSet.has(v.voucherNo));
}
