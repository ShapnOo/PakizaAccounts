import { VoucherTemplate, VoucherType } from '../types/voucherTemplate';
import { MOCK_TEMPLATES, MOCK_COMPANY, MOCK_PREVIEW_LINES } from '../mock/voucherTemplates';
import { delay } from '../lib/delay';

const LS_KEY = 'voucher-templates';

function getStoredTemplates(): VoucherTemplate[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed: VoucherTemplate[] = JSON.parse(raw);
      let migrated = false;
      const updated = parsed.map((t) => {
        let modified = false;
        const copy = { ...t };

        // Ensure name exists
        if (!copy.name) {
          copy.name = `${copy.voucherType} Template (${copy.variant || 'Standard'})`;
          modified = true;
        }

        // Ensure isDefault exists
        if (copy.isDefault === undefined) {
          copy.isDefault = true;
          modified = true;
        }

        if (copy.margin && (copy.margin.left === 0.04 || copy.margin.right === 0.04)) {
          copy.margin = {
            ...copy.margin,
            left: copy.margin.left === 0.04 ? 0.2 : copy.margin.left,
            right: copy.margin.right === 0.04 ? 0.2 : copy.margin.right,
          };
          modified = true;
        }

        if (modified) migrated = true;
        return copy;
      });

      // If user had older mock with only 4 templates and no new templates, merge any missing presets
      if (updated.length < MOCK_TEMPLATES.length) {
        MOCK_TEMPLATES.forEach((mock) => {
          if (!updated.some((u) => u.id === mock.id)) {
            updated.push(mock);
            migrated = true;
          }
        });
      }

      if (migrated) {
        saveStoredTemplates(updated);
      }
      return updated;
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
  await delay(200);
  return getStoredTemplates();
}

export async function getTemplateById(id: string): Promise<VoucherTemplate | undefined> {
  await delay(150);
  const all = getStoredTemplates();
  return all.find((t) => t.id === id);
}

export async function getTemplate(
  type: VoucherType
): Promise<VoucherTemplate | undefined> {
  await delay(150);
  const all = getStoredTemplates();
  // Return default template for this type if present, else first matching type
  return all.find((t) => t.voucherType === type && t.isDefault) || all.find((t) => t.voucherType === type);
}

export async function saveTemplate(
  tpl: VoucherTemplate
): Promise<VoucherTemplate> {
  await delay(250);
  const all = getStoredTemplates();
  const now = new Date().toISOString().split('T')[0];
  const templateToSave: VoucherTemplate = {
    ...tpl,
    updatedAt: now,
  };

  const exists = all.some((t) => t.id === tpl.id);
  const next = exists
    ? all.map((t) => (t.id === tpl.id ? templateToSave : t))
    : [...all, templateToSave];

  saveStoredTemplates(next);
  return templateToSave;
}

export async function createTemplate(
  tpl: Partial<VoucherTemplate> & { name: string; voucherType: VoucherType }
): Promise<VoucherTemplate> {
  await delay(250);
  const all = getStoredTemplates();
  const baseTpl = MOCK_TEMPLATES.find((m) => m.voucherType === tpl.voucherType) || MOCK_TEMPLATES[0];

  const now = new Date().toISOString().split('T')[0];
  const newTemplate: VoucherTemplate = {
    ...baseTpl,
    ...tpl,
    id: `tpl-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    isDefault: tpl.isDefault ?? false,
    paper: {
      ...baseTpl.paper,
      ...(tpl.paper || {}),
    },
    margin: {
      ...baseTpl.margin,
      ...(tpl.margin || {}),
    },
    font: {
      ...baseTpl.font,
      ...(tpl.font || {}),
    },
    header: {
      ...baseTpl.header,
      ...(tpl.header || {}),
    },
    footer: {
      ...baseTpl.footer,
      ...(tpl.footer || {}),
    },
    table: {
      ...baseTpl.table,
      ...(tpl.table || {}),
    },
  };

  let next = [...all];
  if (newTemplate.isDefault) {
    // unset other defaults of same voucherType
    next = next.map((t) => (t.voucherType === newTemplate.voucherType ? { ...t, isDefault: false } : t));
  }
  next.push(newTemplate);
  saveStoredTemplates(next);
  return newTemplate;
}

export async function duplicateTemplate(id: string): Promise<VoucherTemplate> {
  await delay(200);
  const all = getStoredTemplates();
  const source = all.find((t) => t.id === id);
  if (!source) throw new Error('Template not found');

  const now = new Date().toISOString().split('T')[0];
  const duplicated: VoucherTemplate = {
    ...JSON.parse(JSON.stringify(source)),
    id: `tpl-${Date.now()}`,
    name: `${source.name} (Copy)`,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  };

  const next = [...all, duplicated];
  saveStoredTemplates(next);
  return duplicated;
}

export async function setDefaultTemplate(id: string): Promise<VoucherTemplate> {
  await delay(200);
  const all = getStoredTemplates();
  const target = all.find((t) => t.id === id);
  if (!target) throw new Error('Template not found');

  const next = all.map((t) => {
    if (t.id === id) {
      return { ...t, isDefault: true };
    }
    if (t.voucherType === target.voucherType) {
      return { ...t, isDefault: false };
    }
    return t;
  });

  saveStoredTemplates(next);
  return { ...target, isDefault: true };
}

export async function deleteTemplate(id: string): Promise<void> {
  await delay(200);
  const all = getStoredTemplates();
  const target = all.find((t) => t.id === id);
  if (!target) return;

  const next = all.filter((t) => t.id !== id);

  // If we deleted a default template and there are others of same type, make first one default
  if (target.isDefault) {
    const fallback = next.find((t) => t.voucherType === target.voucherType);
    if (fallback) {
      fallback.isDefault = true;
    }
  }

  saveStoredTemplates(next);
}

export async function resetAllTemplates(): Promise<VoucherTemplate[]> {
  await delay(250);
  saveStoredTemplates(MOCK_TEMPLATES);
  return MOCK_TEMPLATES;
}

export async function resetTemplate(
  idOrType: string
): Promise<VoucherTemplate> {
  await delay(250);
  const all = getStoredTemplates();
  const current = all.find((t) => t.id === idOrType || t.voucherType === idOrType);
  const voucherType = current ? current.voucherType : (idOrType as VoucherType);

  const fresh = MOCK_TEMPLATES.find((t) => t.voucherType === voucherType) || MOCK_TEMPLATES[0];
  const resetTpl: VoucherTemplate = {
    ...JSON.parse(JSON.stringify(fresh)),
    id: current?.id || fresh.id,
    name: current?.name || fresh.name,
    isDefault: current?.isDefault ?? fresh.isDefault,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  return saveTemplate(resetTpl);
}

export async function getCompanyHeader() {
  await delay(150);
  return MOCK_COMPANY;
}

export async function getPreviewLines() {
  await delay(150);
  return MOCK_PREVIEW_LINES;
}
