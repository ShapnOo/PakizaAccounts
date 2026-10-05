import { MOCK_SUPPLIERS, Supplier } from '../mock/suppliers';
import { MOCK_EMPLOYEES, Employee } from '../mock/employees';
import { MOCK_BILLS, Bill } from '../mock/bills';
import { MOCK_IOUS, IouRequisition } from '../mock/ious';
import { delay } from '../lib/delay';

export async function listSuppliers(): Promise<Supplier[]> {
  await delay(150);
  return MOCK_SUPPLIERS;
}

export async function listEmployees(): Promise<Employee[]> {
  await delay(150);
  return MOCK_EMPLOYEES;
}

export async function listBillsBySupplier(supplierId: string): Promise<Bill[]> {
  await delay(200);
  return MOCK_BILLS.filter((b) => b.supplierId === supplierId);
}

export async function listIousByEmployee(employeeId: string): Promise<IouRequisition[]> {
  await delay(200);
  return MOCK_IOUS.filter((i) => i.employeeId === employeeId);
}
