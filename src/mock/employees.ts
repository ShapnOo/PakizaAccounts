export interface Employee {
  id: string;
  code?: string;
  name: string;
  designation?: string;
  department?: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-1', code: 'EMP-001', name: 'Riazul Islam', designation: 'Senior Accountant', department: 'Finance & Accounts' },
  { id: 'emp-2', code: 'EMP-002', name: 'Ayesha Khatun', designation: 'Admin Officer', department: 'Human Resources' },
  { id: 'emp-3', code: 'EMP-003', name: 'Tahmid Afsar', designation: 'Head of Accounts', department: 'Finance & Accounts' },
  { id: 'emp-4', code: 'EMP-004', name: 'Kamrul Hasan', designation: 'Procurement Specialist', department: 'Supply Chain' },
  { id: 'emp-5', code: 'EMP-005', name: 'Mahbubur Rahman', designation: 'Factory General Manager', department: 'Operations' },
  { id: 'emp-6', code: 'EMP-006', name: 'Nusrat Jahan', designation: 'Internal Auditor', department: 'Audit & Compliance' },
  { id: 'emp-7', code: 'EMP-007', name: 'Tanvir Hossain', designation: 'Commercial Executive', department: 'Commercial & Export' },
  { id: 'emp-8', code: 'EMP-008', name: 'Farzana Akter', designation: 'Treasury Analyst', department: 'Finance & Accounts' },
  { id: 'emp-9', code: 'EMP-009', name: 'Zubair Ahmed', designation: 'Maintenance Lead Engineer', department: 'Engineering' },
  { id: 'emp-10', code: 'EMP-010', name: 'Sultana Razia', designation: 'Quality Assurance Manager', department: 'Quality Control' },
  { id: 'emp-11', code: 'EMP-011', name: 'Kazi Nazmul', designation: 'Logistics Supervisor', department: 'Supply Chain' },
  { id: 'emp-12', code: 'EMP-012', name: 'Imran Kabir', designation: 'IT Systems Administrator', department: 'Information Technology' },
  { id: 'emp-13', code: 'EMP-013', name: 'Sharmin Sultana', designation: 'Tax & VAT Consultant', department: 'Finance & Accounts' },
  { id: 'emp-14', code: 'EMP-014', name: 'Asif Mahmud', designation: 'Production Coordinator', department: 'Operations' },
];

