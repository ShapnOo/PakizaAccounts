import { CustomerGroup } from '../types/customer';
import { MOCK_CUSTOMER_GROUPS } from '../mock/customerGroups';

const LS_GROUPS_KEY = 'customer-groups';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listCustomerGroups(): Promise<CustomerGroup[]> {
  await delay(200);
  const raw = localStorage.getItem(LS_GROUPS_KEY);
  if (!raw) {
    localStorage.setItem(LS_GROUPS_KEY, JSON.stringify(MOCK_CUSTOMER_GROUPS));
    return MOCK_CUSTOMER_GROUPS;
  }
  return JSON.parse(raw);
}

export async function createCustomerGroup(name: string): Promise<CustomerGroup> {
  await delay(300);
  const all = await listCustomerGroups();
  const trimmed = name.trim().toUpperCase();

  // If already exists, return existing
  const existing = all.find((g) => g.name.toUpperCase() === trimmed);
  if (existing) return existing;

  const next: CustomerGroup = {
    id: `grp-${Date.now().toString(36)}`,
    name: trimmed,
  };
  const updated = [...all, next];
  localStorage.setItem(LS_GROUPS_KEY, JSON.stringify(updated));
  return next;
}
