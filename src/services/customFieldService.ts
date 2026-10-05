import { CustomField, CustomFieldContext } from '../types/customField';
import { MOCK_CUSTOM_FIELDS } from '../mock/customFields';
import { delay } from '../lib/delay';

const LS_KEY = 'custom-fields';

function getStored(): CustomField[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length < MOCK_CUSTOM_FIELDS.length) {
        localStorage.setItem(LS_KEY, JSON.stringify(MOCK_CUSTOM_FIELDS));
        return MOCK_CUSTOM_FIELDS;
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse stored custom fields:', err);
  }
  localStorage.setItem(LS_KEY, JSON.stringify(MOCK_CUSTOM_FIELDS));
  return MOCK_CUSTOM_FIELDS;
}

function saveStored(fields: CustomField[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(fields));
  } catch (err) {
    console.error('Failed to save custom fields to localStorage:', err);
  }
}

export async function listCustomFields(
  context?: CustomFieldContext
): Promise<CustomField[]> {
  await delay(250);
  const all = getStored();
  const filtered = context ? all.filter((f) => f.context === context) : all;
  return [...filtered].sort((a, b) => a.order - b.order);
}

export async function createCustomField(
  payload: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt' | 'order'>
): Promise<CustomField> {
  await delay(300);
  const all = getStored();
  const existingInContext = all.filter((f) => f.context === payload.context);
  const now = new Date().toISOString();

  const next: CustomField = {
    ...payload,
    id: `cf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    order: existingInContext.length,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [...all, next];
  saveStored(updated);
  return next;
}

export async function updateCustomField(
  id: string,
  patch: Partial<CustomField>
): Promise<CustomField> {
  await delay(250);
  const all = getStored();
  let updatedField: CustomField | undefined;

  const next = all.map((f) => {
    if (f.id === id) {
      updatedField = {
        ...f,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      return updatedField;
    }
    return f;
  });

  if (!updatedField) {
    throw new Error(`Custom field with id ${id} not found`);
  }

  saveStored(next);
  return updatedField;
}

export async function deleteCustomField(id: string): Promise<void> {
  await delay(250);
  const all = getStored();
  const next = all.filter((f) => f.id !== id);
  saveStored(next);
}

export async function reorderCustomFields(
  context: CustomFieldContext,
  orderedIds: string[]
): Promise<CustomField[]> {
  await delay(200);
  const all = getStored();
  const next = all.map((f) => {
    if (f.context !== context) return f;
    const idx = orderedIds.indexOf(f.id);
    return idx === -1 ? f : { ...f, order: idx };
  });

  saveStored(next);
  return next
    .filter((f) => f.context === context)
    .sort((a, b) => a.order - b.order);
}

export async function resetCustomFields(): Promise<CustomField[]> {
  await delay(250);
  saveStored(MOCK_CUSTOM_FIELDS);
  return MOCK_CUSTOM_FIELDS;
}
