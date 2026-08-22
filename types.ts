export type UserRole = 'admin' | 'employee';

export type Department = 'Engineering' | 'Product Design' | 'Marketing' | 'Human Resources' | 'Finance & Ops' | 'Sales';

export type EmploymentStatus = 'Active' | 'On Leave' | 'Probation' | 'Contract' | 'Terminated';

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave';

export type LeaveType = 'Paid' | 'Sick' | 'Unpaid' | 'Casual' | 'Parental';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface SalaryStructure {
  basicSalary: number; // Basic Pay (~50% of monthly CTC / Gross)
  baseSalary: number; // Compatibility alias
  hra: number; // House Rent Allowance (~40% of Basic)
  conveyanceAllowance: number; // Conveyance Allowance
  medicalAllowance: number; // Medical Allowance
  specialAllowance: number; // Special Allowance / Executive Balance
  performanceBonus: number; // Performance Incentive
  grossSalary: number; // Monthly Gross Earnings

  // Statutory Deductions (Indian Labor & Tax Laws)
  epfDeduction: number; // Employee Provident Fund (12% of Basic under EPFO)
  pfDeduction: number; // Compatibility alias
  professionalTax: number; // Professional Tax (PT standard ₹200/mo)
  taxDeduction: number; // TDS / Income Tax deduction under Sec 192
  totalDeductions: number;

  // Employer Contributions
  employerEpf: number; // Employer EPF contribution (12%)
  gratuity: number; // Gratuity provision (~4.81% of Basic)
  ctcMonthly: number; // Total Monthly Cost to Company
  ctcAnnual: number; // Annual Cost to Company (LPA)

  netSalary: number; // Net Disbursed Take-Home Pay
  currency: string; // 'INR'
}

export interface Employee {
  id: string; // e.g. "EMP-1001"
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  jobTitle: string;
  department: Department;
  avatarUrl: string;
  phone: string;
  address: string;
  joinDate: string;
  status: EmploymentStatus;
  managerName?: string;
  panNumber: string; // PAN e.g. "ABCDE1234F"
  uanNumber: string; // EPFO UAN e.g. "101234567890"
  bankName: string; // e.g. "HDFC Bank"
  bankAccountNumber: string; // e.g. "50100492817263"
  ifscCode: string; // e.g. "HDFC0001234"
  salary: SalaryStructure;
  leaveBalance: {
    paid: { total: number; used: number };
    sick: { total: number; used: number };
    casual: { total: number; used: number };
    parental?: { total: number; used: number };
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: Array<{
    name: string;
    type: string;
    uploadDate: string;
    size: string;
  }>;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  clockInTime: string; // HH:mm:ss or HH:mm
  clockOutTime?: string;
  totalWorkHours: number; // in hours, e.g. 8.5
  status: AttendanceStatus;
  location: string; // "Bengaluru Tech Hub - 4th Floor" | "Remote (India)"
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewComment?: string;
}

export interface Payslip {
  id: string;
  payrollMonth: string; // e.g. "August 2026"
  issueDate: string;
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  department: Department;
  panNumber: string;
  uanNumber: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  salary: SalaryStructure;
  workedDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  lossOfPayDays?: number;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  paymentReference: string; // e.g. "NEFT-HDFC-98217349"
  paymentMethod?: string; // "NEFT / Direct Bank Credit"
}

export interface SystemStats {
  totalEmployees: number;
  todayPresent: number;
  todayAbsent: number;
  todayOnLeave: number;
  todayHalfDay: number;
  attendanceRate: number; // percentage e.g. 92%
  pendingLeavesCount: number;
  monthlyPayrollTotal: number;
}

export interface AuthResponse {
  user: Employee;
  token: string;
}

