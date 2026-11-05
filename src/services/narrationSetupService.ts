import { NarrationTemplate } from '../types/narrationSetup';
import { MOCK_NARRATION_TEMPLATES } from '../mock/narrationSetup';

const LS_KEY = 'accounts:narration_templates';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getNarrationTemplates(): Promise<NarrationTemplate[]> {
  await delay(200);
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(MOCK_NARRATION_TEMPLATES));
      return MOCK_NARRATION_TEMPLATES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_NARRATION_TEMPLATES;
  }
}

export async function saveNarrationTemplates(templates: NarrationTemplate[]): Promise<void> {
  await delay(200);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save narration templates:', e);
  }
}

export async function resetNarrationTemplatesToDefault(): Promise<NarrationTemplate[]> {
  await delay(250);
  localStorage.setItem(LS_KEY, JSON.stringify(MOCK_NARRATION_TEMPLATES));
  return MOCK_NARRATION_TEMPLATES;
}

