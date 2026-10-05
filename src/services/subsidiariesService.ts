import { SubsidiaryOption } from '../types/openingBalance';
import { MOCK_SUBSIDIARIES } from '../mock/subsidiaries';
import { delay } from '../lib/delay';

export async function listSubsidiaries(): Promise<SubsidiaryOption[]> {
  await delay(200);
  return MOCK_SUBSIDIARIES;
}
