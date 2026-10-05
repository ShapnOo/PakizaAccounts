import { SimpleMasterOption } from '../types/openingBalance';
import { MOCK_COST_CENTERS } from '../mock/costCenters';
import { delay } from '../lib/delay';

export async function listCostCenters(): Promise<SimpleMasterOption[]> {
  await delay(200);
  return MOCK_COST_CENTERS;
}
