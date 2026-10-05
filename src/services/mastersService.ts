import { delay } from '../lib/delay';
import { MOCK_COA_BANK_ACCOUNTS, CoaBankAccount } from '../mock/coaBankAccounts';
import { INITIAL_ACCOUNTS } from '../mock/accounts';
import { Account } from '../types/coa';
import { MOCK_SUPPLIERS, Supplier } from '../mock/suppliers';
import { MOCK_EMPLOYEES, Employee } from '../mock/employees';
import { MOCK_CUSTOMERS, Customer } from '../mock/customers';
import { MOCK_BILLS, Bill } from '../mock/bills';
import { MOCK_IOUS, IouRequisition } from '../mock/ious';
import { MOCK_CHEQUE_COMPANY } from '../mock/companyHeader';

export async function listCoaBankAccounts(): Promise<CoaBankAccount[]> {
  await delay(150);
  return MOCK_COA_BANK_ACCOUNTS;
}

export async function listCoaAccounts(): Promise<Account[]> {
  await delay(150);
  return INITIAL_ACCOUNTS;
}

export async function listSuppliers(): Promise<Supplier[]> {
  await delay(150);
  return MOCK_SUPPLIERS;
}

export async function listEmployees(): Promise<Employee[]> {
  await delay(150);
  return MOCK_EMPLOYEES;
}

export async function listCustomers(): Promise<Customer[]> {
  await delay(150);
  return MOCK_CUSTOMERS;
}

export async function listBillsBySupplier(sid: string): Promise<Bill[]> {
  await delay(180);
  if (!sid) return [];
  return MOCK_BILLS.filter((b) => b.supplierId === sid);
}

export async function listIousByEmployee(eid: string): Promise<IouRequisition[]> {
  await delay(180);
  if (!eid) return [];
  return MOCK_IOUS.filter((i) => i.employeeId === eid);
}

export async function getCompanyHeader(): Promise<typeof MOCK_CHEQUE_COMPANY> {
  await delay(100);
  return MOCK_CHEQUE_COMPANY;
}
