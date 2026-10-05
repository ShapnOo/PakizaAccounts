import { Customer } from '../types/customer';
import { MOCK_CUSTOMERS } from '../mock/customers';
import { createSupplierFromCustomer } from './supplierService';

const LS_CUSTOMERS_KEY = 'customers';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listCustomers(): Promise<Customer[]> {
  await delay(300);
  const raw = localStorage.getItem(LS_CUSTOMERS_KEY);
  if (!raw) {
    localStorage.setItem(LS_CUSTOMERS_KEY, JSON.stringify(MOCK_CUSTOMERS));
    return MOCK_CUSTOMERS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return MOCK_CUSTOMERS;
  }
}

export async function getCustomer(id: string): Promise<Customer | null> {
  await delay(250);
  const all = await listCustomers();
  return all.find((c) => c.id === id) ?? null;
}

export async function isShortNameUnique(
  shortName: string,
  effectiveCompanyId: string,
  excludeId?: string
): Promise<boolean> {
  const all = await listCustomers();
  const normalized = shortName.trim().toUpperCase();
  return !all.some(
    (c) =>
      c.effectiveCompanyId === effectiveCompanyId &&
      c.shortName.toUpperCase() === normalized &&
      c.id !== excludeId
  );
}

export async function createCustomer(
  payload: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Customer> {
  await delay(450);
  const all = await listCustomers();
  const now = new Date().toISOString();

  const newCustomer: Customer = {
    ...payload,
    id: `cust-${Date.now().toString(36)}`,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newCustomer, ...all];
  localStorage.setItem(LS_CUSTOMERS_KEY, JSON.stringify(updated));

  // If "Make this Supplier also" is true, mirror into supplier master
  if (newCustomer.makeSupplierAlso) {
    try {
      await createSupplierFromCustomer(newCustomer);
    } catch (e) {
      console.warn('Failed to mirror supplier record', e);
    }
  }

  return newCustomer;
}

export async function updateCustomer(
  id: string,
  patch: Partial<Customer>
): Promise<Customer> {
  await delay(400);
  const all = await listCustomers();
  const existing = all.find((c) => c.id === id);
  if (!existing) throw new Error('Customer not found');

  const updatedCustomer: Customer = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  const updated = all.map((c) => (c.id === id ? updatedCustomer : c));
  localStorage.setItem(LS_CUSTOMERS_KEY, JSON.stringify(updated));

  if (updatedCustomer.makeSupplierAlso) {
    try {
      await createSupplierFromCustomer(updatedCustomer);
    } catch (e) {
      console.warn('Failed to mirror supplier record', e);
    }
  }

  return updatedCustomer;
}

export async function deleteCustomer(id: string): Promise<void> {
  await delay(300);
  const all = await listCustomers();
  const filtered = all.filter((c) => c.id !== id);
  localStorage.setItem(LS_CUSTOMERS_KEY, JSON.stringify(filtered));
}

export async function toggleCustomerActive(id: string): Promise<Customer> {
  const all = await listCustomers();
  const target = all.find((c) => c.id === id);
  if (!target) throw new Error('Customer not found');
  const nextStatus = target.activeStatus === 'Active' ? 'Inactive' : 'Active';
  return updateCustomer(id, { activeStatus: nextStatus });
}
