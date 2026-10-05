import { FormPreset, VoucherType } from '../types/journalEntry';
import { MOCK_PRESETS } from '../mock/presets';
import { delay } from '../lib/delay';

const LS_PRESETS = 'form-presets';

export async function listPresets(type?: VoucherType): Promise<FormPreset[]> {
  await delay(150);
  const raw = localStorage.getItem(LS_PRESETS);
  let all: FormPreset[] = MOCK_PRESETS;
  if (raw) {
    try {
      all = JSON.parse(raw);
    } catch (e) {
      all = MOCK_PRESETS;
    }
  } else {
    localStorage.setItem(LS_PRESETS, JSON.stringify(MOCK_PRESETS));
  }
  return type ? all.filter((p) => p.voucherType === type) : all;
}

export async function savePreset(
  preset: Omit<FormPreset, 'id' | 'createdAt'>
): Promise<FormPreset> {
  await delay(250);
  const all = await listPresets();
  const next: FormPreset = {
    ...preset,
    id: `preset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [next, ...all];
  localStorage.setItem(LS_PRESETS, JSON.stringify(updated));
  return next;
}

export async function deletePreset(id: string): Promise<void> {
  await delay(200);
  const all = await listPresets();
  const remaining = all.filter((p) => p.id !== id);
  localStorage.setItem(LS_PRESETS, JSON.stringify(remaining));
}
