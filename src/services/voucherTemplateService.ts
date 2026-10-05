import { VoucherTemplate, VoucherType } from '../types/voucherTemplate';
import { MOCK_TEMPLATES, MOCK_COMPANY, MOCK_PREVIEW_LINES } from '../mock/voucherTemplates';
import { delay } from '../lib/delay';

const LS_KEY = 'voucher-templates';

function getStoredTemplates(): VoucherTemplate[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse voucher templates from localStorage:', err);
  }
  localStorage.setItem(LS_KEY, JSON.stringify(MOCK_TEMPLATES));
  return MOCK_TEMPLATES;
}

function saveStoredTemplates(templates: VoucherTemplate[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(templates));
  } catch (err) {
    console.error('Failed to save voucher templates to localStorage:', err);
  }
}

export async function listTemplates(): Promise<VoucherTemplate[]> {
  await delay(250);
  return getStoredTemplates();
}

export async function getTemplate(
  type: VoucherType
): Promise<VoucherTemplate | undefined> {
  await delay(200);
  const all = getStoredTemplates();
  return all.find((t) => t.voucherType === type);
}

export async function saveTemplate(
  tpl: VoucherTemplate
): Promise<VoucherTemplate> {
  await delay(300);
  const all = getStoredTemplates();
  const exists = all.some((t) => t.voucherType === tpl.voucherType);
  const next = exists
    ? all.map((t) => (t.voucherType === tpl.voucherType ? tpl : t))
    : [...all, tpl];
  saveStoredTemplates(next);
  return tpl;
}

export async function resetTemplate(
  type: VoucherType
): Promise<VoucherTemplate> {
  await delay(250);
  const fresh = MOCK_TEMPLATES.find((t) => t.voucherType === type)!;
  return saveTemplate(fresh);
}

export async function getCompanyHeader() {
  await delay(150);
  return MOCK_COMPANY;
}

export async function getPreviewLines() {
  await delay(150);
  return MOCK_PREVIEW_LINES;
}
