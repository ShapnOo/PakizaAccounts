import { SimpleMasterOption } from '../types/openingBalance';
import { MOCK_EMPLOYEES } from '../mock/employees';
import { delay } from '../lib/delay';

export async function listEmployees(): Promise<SimpleMasterOption[]> {
  await delay(200);
  return MOCK_EMPLOYEES;
}
