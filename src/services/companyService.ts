import { Company } from '../types/subledger';
import { MOCK_COMPANIES } from '../mock/companies';
import { delay } from '../lib/delay';

export async function listCompanies(): Promise<Company[]> {
  await delay(200);
  return MOCK_COMPANIES;
}
