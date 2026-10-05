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
  { id: 'emp-5', name: 'Mahbubur Rahman', designation: 'Factory General Manager', department: 'Operations' },
  { id: 'emp-6', name: 'Nusrat Jahan', designation: 'Internal Auditor', department: 'Audit & Compliance' },
  { id: 'emp-7', name: 'Tanvir Hossain', designation: 'Commercial Executive', department: 'Commercial & Export' },
  { id: 'emp-8', name: 'Farzana Akter', designation: 'Treasury Analyst', department: 'Finance & Accounts' },
  { id: 'emp-9', name: 'Zubair Ahmed', designation: 'Maintenance Lead Engineer', department: 'Engineering' },
  { id: 'emp-10', name: 'Sultana Razia', designation: 'Quality Assurance Manager', department: 'Quality Control' },
  { id: 'emp-11', name: 'Kazi Nazmul', designation: 'Logistics Supervisor', department: 'Supply Chain' },
  { id: 'emp-12', name: 'Imran Kabir', designation: 'IT Systems Administrator', department: 'Information Technology' },
  { id: 'emp-13', name: 'Sharmin Sultana', designation: 'Tax & VAT Consultant', department: 'Finance & Accounts' },
  { id: 'emp-14', name: 'Asif Mahmud', designation: 'Production Coordinator', department: 'Operations' },
];
