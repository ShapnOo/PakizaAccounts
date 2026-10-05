import { SimpleMasterOption } from '../types/openingBalance';
import { MOCK_VEHICLES } from '../mock/vehicles';
import { delay } from '../lib/delay';

export async function listVehicles(): Promise<SimpleMasterOption[]> {
  await delay(200);
  return MOCK_VEHICLES;
}
