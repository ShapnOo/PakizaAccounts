export interface Employee {
  id: string;
  name: string;
  designation?: string;
  department?: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Riazul Islam', designation: 'Senior Accountant', department: 'Finance & Accounts' },
  { id: 'emp-2', name: 'Ayesha Khatun', designation: 'Admin Officer', department: 'Human Resources' },
  { id: 'emp-3', name: 'Tahmid Afsar', designation: 'Head of Accounts', department: 'Finance & Accounts' },
  { id: 'emp-4', name: 'Kamrul Hasan', designation: 'Procurement Specialist', department: 'Supply Chain' },
];
