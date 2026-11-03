import type {
  VoucherType,
  TemplateSetup,
  VoucherPreviewData,
} from '../types/voucherTemplate';
import {
  DEFAULT_SETUPS,
  MOCK_PREVIEW_DATA,
} from '../mock/voucherPreviewData';
import { delay } from '../lib/delay';

const LS_SETUPS = 'voucher-template-setups';
const LS_PREVIEW = 'voucher-preview-data';

export async function listSetups(): Promise<Record<VoucherType, TemplateSetup>> {
  await delay(300);
  const raw = localStorage.getItem(LS_SETUPS);
  if (!raw) return DEFAULT_SETUPS;
  try {
    return { ...DEFAULT_SETUPS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETUPS;
  }
}

export async function getSetup(voucherType: VoucherType): Promise<TemplateSetup> {
  await delay(200);
  const all = await listSetups();
  return all[voucherType] || DEFAULT_SETUPS[voucherType];
}

export async function saveSetup(setup: TemplateSetup): Promise<void> {
  await delay(400);
  const all = await listSetups();
  all[setup.voucherType] = setup;
  localStorage.setItem(LS_SETUPS, JSON.stringify(all));
}

export async function resetAllSetups(): Promise<Record<VoucherType, TemplateSetup>> {
  await delay(300);
  localStorage.removeItem(LS_SETUPS);
  return DEFAULT_SETUPS;
}

export async function getPreviewData(): Promise<VoucherPreviewData> {
  await delay(300);
  const raw = localStorage.getItem(LS_PREVIEW);
  if (!raw) return MOCK_PREVIEW_DATA;
  try {
    return JSON.parse(raw);
  } catch {
    return MOCK_PREVIEW_DATA;
  }
}

export async function savePreviewData(
  data: VoucherPreviewData
): Promise<void> {
  await delay(300);
  localStorage.setItem(LS_PREVIEW, JSON.stringify(data));
}
