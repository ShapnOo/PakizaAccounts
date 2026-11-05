import { delay } from '../lib/delay';
import type {
  ReportType,
  ISCustomization,
  ISCustomizationState,
  MasterListItem,
} from '../types/isCustomization';
import {
  DEFAULT_COMPREHENSIVE,
  DEFAULT_SUMMARY,
  MASTER_LIST,
} from '../mock/isCustomization';

const LS_KEY = 'is:customization';

function normalizeRow(r: any, idx: number): any {
  return {
    id: r.id || `row-${idx}`,
    kind: r.kind === 'parent' ? 'parent' : 'child',
    particulars: r.particulars || r.label || '',
    code: r.code || '',
    formula: r.formula,
    parentCode: r.parentCode,
    isCustom: r.isCustom,
    order: typeof r.order === 'number' ? r.order : idx,
  };
}

export async function getCustomizationState(): Promise<ISCustomizationState> {
  await delay(300);
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      return {
        comprehensive: DEFAULT_COMPREHENSIVE,
        summary: DEFAULT_SUMMARY,
      };
    }
    const parsed = JSON.parse(raw);
    const migrateCustom = (c: any, def: ISCustomization): ISCustomization => {
      if (!c || !Array.isArray(c.rows) || c.rows.length === 0) return def;
      return {
        reportType: c.reportType || def.reportType,
        reportTitle: c.reportTitle || def.reportTitle,
        rows: c.rows.map(normalizeRow),
        updatedAt: c.updatedAt || new Date().toISOString(),
      };
    };
    return {
      comprehensive: migrateCustom(parsed.comprehensive, DEFAULT_COMPREHENSIVE),
      summary: migrateCustom(parsed.summary, DEFAULT_SUMMARY),
    };
  } catch (err) {
    console.error('Failed to read IS customization from storage:', err);
    return {
      comprehensive: DEFAULT_COMPREHENSIVE,
      summary: DEFAULT_SUMMARY,
    };
  }
}

export async function saveCustomization(custom: ISCustomization): Promise<void> {
  await delay(400);
  try {
    const all = await getCustomizationState();
    all[custom.reportType === 'Comprehensive' ? 'comprehensive' : 'summary'] = {
      ...custom,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to persist IS customization:', err);
    throw err;
  }
}

export async function resetToDefault(reportType: ReportType): Promise<ISCustomization> {
  await delay(300);
  const fresh: ISCustomization = JSON.parse(
    JSON.stringify(
      reportType === 'Comprehensive' ? DEFAULT_COMPREHENSIVE : DEFAULT_SUMMARY
    )
  );
  fresh.updatedAt = new Date().toISOString();
  await saveCustomization(fresh);
  return fresh;
}

const LS_MASTER_KEY = 'is:master_list';

export async function listMasterList(): Promise<MasterListItem[]> {
  await delay(150);
  try {
    const raw = localStorage.getItem(LS_MASTER_KEY);
    if (!raw) {
      localStorage.setItem(LS_MASTER_KEY, JSON.stringify(MASTER_LIST));
      return MASTER_LIST;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LS_MASTER_KEY, JSON.stringify(MASTER_LIST));
      return MASTER_LIST;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read master list:', err);
    return MASTER_LIST;
  }
}

export async function saveMasterList(items: MasterListItem[]): Promise<void> {
  await delay(200);
  try {
    localStorage.setItem(LS_MASTER_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save master list:', err);
    throw err;
  }
}

export async function addMasterListItem(
  section: string,
  label: string
): Promise<MasterListItem> {
  await delay(200);
  const current = await listMasterList();
  const trimmedSec = section.trim() || 'General Accounts';
  const trimmedLbl = label.trim();

  // Check if section header exists; if not, create it
  let updated = [...current];
  const hasSection = updated.some(
    (item) => item.isSectionHeader && item.section.toLowerCase() === trimmedSec.toLowerCase()
  );

  if (!hasSection) {
    updated.push({
      id: `sec-${Date.now()}`,
      section: trimmedSec,
      label: trimmedSec,
      isSectionHeader: true,
    });
  }

  // Create leaf item
  const newItem: MasterListItem = {
    id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    section: trimmedSec,
    label: trimmedLbl,
    isSectionHeader: false,
  };

  updated.push(newItem);
  await saveMasterList(updated);
  return newItem;
}

export async function deleteMasterListItem(id: string): Promise<void> {
  await delay(200);
  const current = await listMasterList();
  const updated = current.filter((item) => item.id !== id);
  await saveMasterList(updated);
}
