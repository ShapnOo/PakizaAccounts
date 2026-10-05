import { Customer } from '../types/customer';

const LS_SUPPLIERS_KEY = 'suppliers';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface Supplier {
  id: string;
  supplierName: string;
  shortName: string;
  country: string;
  sourceCustomerId?: string;
  activeStatus: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export async function listSuppliers(): Promise<Supplier[]> {
  await delay(150);
  const raw = localStorage.getItem(LS_SUPPLIERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function createSupplierFromCustomer(cust: Customer): Promise<Supplier> {
  await delay(200);
  const all = await listSuppliers();
  const existing = all.find((s) => s.sourceCustomerId === cust.id || s.supplierName.toLowerCase() === cust.customerName.toLowerCase());

  if (existing) {
    const updated = all.map((s) =>
      s.id === existing.id
        ? {
            ...s,
            supplierName: cust.customerName,
            shortName: cust.shortName,
            country: cust.country,
            updatedAt: new Date().toISOString(),
          }
        : s
    );
    localStorage.setItem(LS_SUPPLIERS_KEY, JSON.stringify(updated));
    return existing;
  }

  const newSupplier: Supplier = {
    id: `sup-${Date.now().toString(36)}`,
    supplierName: cust.customerName,
    shortName: cust.shortName,
    country: cust.country,
    sourceCustomerId: cust.id,
    activeStatus: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [...all, newSupplier];
  localStorage.setItem(LS_SUPPLIERS_KEY, JSON.stringify(updated));
  return newSupplier;
}
