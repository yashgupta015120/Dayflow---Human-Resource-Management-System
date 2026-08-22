import { Employee, AttendanceRecord, LeaveRequest, Payslip, SystemStats, SalaryStructure } from '../src/types';

// Helper to compute Indian salary structure and statutory deductions
export function calculateSalaryStructure(monthlyGrossOrBase: number): SalaryStructure {
  // If a standard number is passed (e.g. ₹95,000 monthly gross)
  const grossSalary = Math.round(monthlyGrossOrBase);
  
  // 1. Basic Salary (50% of Gross as per Indian labor wage code)
  const basicSalary = Math.round(grossSalary * 0.50);
  
  // 2. House Rent Allowance (40% of Basic Pay for Non-Metro, 50% for Metro)
  const hra = Math.round(basicSalary * 0.40);
  
  // 3. Standard Allowances
  const conveyanceAllowance = 1600; // Fixed Conveyance
  const medicalAllowance = 1250; // Fixed Medical
  const performanceBonus = Math.round(grossSalary * 0.05); // 5% KPI incentive

  // 4. Special Allowance (Balancing allowance to equal Gross)
  const specialAllowance = Math.max(0, grossSalary - (basicSalary + hra + conveyanceAllowance + medicalAllowance + performanceBonus));

  // 5. Statutory Deductions
  // Employee Provident Fund (EPF): 12% of Basic Pay (EPFO Act)
  const epfDeduction = Math.round(basicSalary * 0.12);
  
  // Professional Tax (PT): Standard ₹200/month (Indian State Tax)
  const professionalTax = 200;

  // Income Tax / TDS (Under New Tax Regime Section 192)
  const annualGross = grossSalary * 12;
  let taxDeduction = 0;
  if (annualGross > 1500000) {
    taxDeduction = Math.round(grossSalary * 0.16); // ~16% TDS
  } else if (annualGross > 1000000) {
    taxDeduction = Math.round(grossSalary * 0.11); // ~11% TDS
  } else if (annualGross > 700000) {
    taxDeduction = Math.round(grossSalary * 0.06); // ~6% TDS
  } else {
    taxDeduction = Math.round(grossSalary * 0.02); // ~2% TDS
  }

  const totalDeductions = epfDeduction + professionalTax + taxDeduction;
  const netSalary = grossSalary - totalDeductions;

  // 6. Employer Contributions (CTC calculation)
  const employerEpf = Math.round(basicSalary * 0.12);
  const gratuity = Math.round((basicSalary * 15) / 26 / 12); // ~4.81% Gratuity Act
  const ctcMonthly = grossSalary + employerEpf + gratuity;
  const ctcAnnual = ctcMonthly * 12;

  return {
    basicSalary,
    baseSalary: basicSalary, // compatibility alias
    hra,
    conveyanceAllowance,
    medicalAllowance,
    specialAllowance,
    performanceBonus,
    grossSalary,
    epfDeduction,
    pfDeduction: epfDeduction, // compatibility alias
    professionalTax,
    taxDeduction,
    totalDeductions,
    employerEpf,
    gratuity,
    ctcMonthly,
    ctcAnnual,
    netSalary,
    currency: 'INR'
  };
}

export let employees: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@dayflow.internal',
    password: 'ananya@dayflow2026',
    role: 'admin',
    jobTitle: 'Head of People & HR Operations',
    department: 'Human Resources',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    phone: '+91 98201 44521',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
    joinDate: '2023-01-15',
    status: 'Active',
    managerName: 'Board of Directors',
    panNumber: 'AAEPD8912K',
    uanNumber: '101294817201',
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100492817263',
    ifscCode: 'HDFC0000128',
    salary: calculateSalaryStructure(145000), // ₹1,45,000/mo (~18.5 LPA)
    leaveBalance: {
      paid: { total: 20, used: 4 },
      sick: { total: 10, used: 1 },
      casual: { total: 8, used: 2 }
    },
    emergencyContact: {
      name: 'Rohan Deshmukh',
      relationship: 'Spouse',
      phone: '+91 98201 44599'
    },
    documents: [
      { name: 'Employment_Agreement_Ananya.pdf', type: 'Appointment Letter', uploadDate: '2023-01-15', size: '1.8 MB' },
      { name: 'PAN_Aadhaar_KYC_Verified.pdf', type: 'Statutory KYC', uploadDate: '2023-01-15', size: '2.4 MB' }
    ]
  },
  {
    id: 'EMP-1042',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@dayflow.internal',
    password: 'aarav@dayflow2026',
    role: 'employee',
    jobTitle: 'Senior Frontend Engineer',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    phone: '+91 98450 19283',
    address: 'HSR Layout Sector 2, Bengaluru, Karnataka 560102',
    joinDate: '2023-06-01',
    status: 'Active',
    managerName: 'Vikram Sengupta (Engineering Lead)',
    panNumber: 'BPMMA4519L',
    uanNumber: '101938472910',
    bankName: 'ICICI Bank',
    bankAccountNumber: '002901582910',
    ifscCode: 'ICIC0000029',
    salary: calculateSalaryStructure(115000), // ₹1,15,000/mo (~14.8 LPA)
    leaveBalance: {
      paid: { total: 18, used: 5 },
      sick: { total: 10, used: 2 },
      casual: { total: 6, used: 1 }
    },
    emergencyContact: {
      name: 'Kavita Mehta',
      relationship: 'Sister',
      phone: '+91 98450 19280'
    },
    documents: [
      { name: 'Offer_Letter_AaravMehta.pdf', type: 'Offer Letter', uploadDate: '2023-06-01', size: '1.2 MB' },
      { name: 'Form16_TDS_Declaration.pdf', type: 'Tax & Form 16', uploadDate: '2023-06-02', size: '420 KB' }
    ]
  },
  {
    id: 'EMP-1055',
    name: 'Marcus Chen',
    email: 'marcus.chen@dayflow.internal',
    password: 'marcus@dayflow2026',
    role: 'employee',
    jobTitle: 'Lead Product Designer',
    department: 'Product Design',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    phone: '+91 97112 38491',
    address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034',
    joinDate: '2023-08-10',
    status: 'Active',
    managerName: 'Ananya Deshmukh (HR Admin)',
    panNumber: 'CHPMC9921D',
    uanNumber: '101827364519',
    bankName: 'Axis Bank',
    bankAccountNumber: '912010048192019',
    ifscCode: 'UTIB0000142',
    salary: calculateSalaryStructure(105000), // ₹1,05,000/mo (~13.5 LPA)
    leaveBalance: {
      paid: { total: 18, used: 3 },
      sick: { total: 10, used: 0 },
      casual: { total: 6, used: 2 }
    },
    emergencyContact: {
      name: 'Linda Chen',
      relationship: 'Mother',
      phone: '+91 97112 38400'
    },
    documents: [
      { name: 'Design_Lead_Contract.pdf', type: 'Contract', uploadDate: '2023-08-10', size: '1.5 MB' }
    ]
  },
  {
    id: 'EMP-1078',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@dayflow.internal',
    password: 'sneha@dayflow2026',
    role: 'employee',
    jobTitle: 'Growth & Brand Marketing Lead',
    department: 'Marketing',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    phone: '+91 99302 48192',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    joinDate: '2024-02-01',
    status: 'Active',
    managerName: 'Ananya Deshmukh (HR Admin)',
    panNumber: 'KLKPS3819M',
    uanNumber: '101748291048',
    bankName: 'State Bank of India',
    bankAccountNumber: '309182740192',
    ifscCode: 'SBIN0000300',
    salary: calculateSalaryStructure(92000), // ₹92,000/mo (~11.8 LPA)
    leaveBalance: {
      paid: { total: 18, used: 6 },
      sick: { total: 10, used: 1 },
      casual: { total: 6, used: 0 }
    },
    emergencyContact: {
      name: 'Nitin Kulkarni',
      relationship: 'Spouse',
      phone: '+91 99302 48100'
    },
    documents: [
      { name: 'Marketing_Confidentiality_NDA.pdf', type: 'NDA', uploadDate: '2024-02-01', size: '890 KB' }
    ]
  },
  {
    id: 'EMP-1090',
    name: 'Vikram Sengupta',
    email: 'vikram.s@dayflow.internal',
    password: 'vikram@dayflow2026',
    role: 'admin',
    jobTitle: 'DevOps & Infrastructure Architect',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    phone: '+91 98301 92841',
    address: 'Gachibowli, Hyderabad, Telangana 500032',
    joinDate: '2023-03-15',
    status: 'Active',
    managerName: 'Ananya Deshmukh (HR Admin)',
    panNumber: 'SNGPV1092P',
    uanNumber: '101629481029',
    bankName: 'Kotak Mahindra Bank',
    bankAccountNumber: '4910294819',
    ifscCode: 'KKBK0000420',
    salary: calculateSalaryStructure(138000), // ₹1,38,000/mo (~17.8 LPA)
    leaveBalance: {
      paid: { total: 20, used: 2 },
      sick: { total: 10, used: 0 },
      casual: { total: 8, used: 1 }
    },
    emergencyContact: {
      name: 'Ritu Sengupta',
      relationship: 'Spouse',
      phone: '+91 98301 92800'
    },
    documents: [
      { name: 'Security_Clearance_Doc.pdf', type: 'Compliance', uploadDate: '2023-03-15', size: '2.1 MB' }
    ]
  },
  {
    id: 'EMP-1104',
    name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.internal',
    password: 'priya@dayflow2026',
    role: 'employee',
    jobTitle: 'Senior Financial Operations Analyst',
    department: 'Finance & Ops',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
    phone: '+91 98112 49102',
    address: 'DLF Cyber City, Phase 2, Gurugram, Haryana 122002',
    joinDate: '2024-01-10',
    status: 'On Leave',
    managerName: 'Ananya Deshmukh (HR Admin)',
    panNumber: 'SHRPS9102H',
    uanNumber: '101582910482',
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100819204819',
    ifscCode: 'HDFC0000240',
    salary: calculateSalaryStructure(98000), // ₹98,000/mo (~12.6 LPA)
    leaveBalance: {
      paid: { total: 18, used: 8 },
      sick: { total: 10, used: 3 },
      casual: { total: 6, used: 2 }
    },
    emergencyContact: {
      name: 'Arjun Sharma',
      relationship: 'Brother',
      phone: '+91 98112 49199'
    },
    documents: [
      { name: 'Chartered_Accountant_ICAI_Cert.pdf', type: 'Cert', uploadDate: '2024-01-10', size: '3.0 MB' }
    ]
  },
  {
    id: 'EMP-1115',
    name: 'Rohan Verma',
    email: 'rohan.verma@dayflow.internal',
    password: 'rohan@dayflow2026',
    role: 'employee',
    jobTitle: 'Backend Distributed Systems Engineer',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    phone: '+91 97654 32190',
    address: 'Baner, Pune, Maharashtra 411045',
    joinDate: '2024-05-15',
    status: 'Probation',
    managerName: 'Vikram Sengupta (Engineering Lead)',
    panNumber: 'VRMPR4910N',
    uanNumber: '101492019481',
    bankName: 'ICICI Bank',
    bankAccountNumber: '003401928401',
    ifscCode: 'ICIC0000034',
    salary: calculateSalaryStructure(85000), // ₹85,000/mo (~10.9 LPA)
    leaveBalance: {
      paid: { total: 12, used: 1 },
      sick: { total: 6, used: 0 },
      casual: { total: 4, used: 0 }
    },
    emergencyContact: {
      name: 'Pooja Verma',
      relationship: 'Sister',
      phone: '+91 97654 32100'
    },
    documents: [
      { name: 'Probation_Agreement_RohanVerma.pdf', type: 'Contract', uploadDate: '2024-05-15', size: '1.1 MB' }
    ]
  }
];

// Helper to get formatted dates
const todayStr = new Date().toISOString().split('T')[0];

function getDateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export let attendanceRecords: AttendanceRecord[] = [
  // Today's records
  {
    id: 'ATT-TODAY-01',
    employeeId: 'EMP-1001',
    employeeName: 'Ananya Deshmukh',
    department: 'Human Resources',
    date: todayStr,
    clockInTime: '08:45:00',
    clockOutTime: undefined,
    totalWorkHours: 5.2,
    status: 'Present',
    location: 'Bengaluru Tech Hub - 4th Floor',
    notes: 'Morning HR sync and August PF remittance verification'
  },
  {
    id: 'ATT-TODAY-02',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    department: 'Engineering',
    date: todayStr,
    clockInTime: '09:02:15',
    clockOutTime: undefined,
    totalWorkHours: 4.8,
    status: 'Present',
    location: 'Bengaluru Tech Hub - 4th Floor',
    notes: 'Sprint 24 Indian payroll UI integration'
  },
  {
    id: 'ATT-TODAY-03',
    employeeId: 'EMP-1055',
    employeeName: 'Marcus Chen',
    department: 'Product Design',
    date: todayStr,
    clockInTime: '09:30:00',
    clockOutTime: undefined,
    totalWorkHours: 4.2,
    status: 'Present',
    location: 'Remote (India)',
    notes: 'INR design tokens and payslip format review'
  },
  {
    id: 'ATT-TODAY-04',
    employeeId: 'EMP-1078',
    employeeName: 'Sneha Kulkarni',
    department: 'Marketing',
    date: todayStr,
    clockInTime: '09:15:00',
    clockOutTime: '13:30:00',
    totalWorkHours: 4.25,
    status: 'Half-day',
    location: 'Mumbai BKC Office',
    notes: 'Afternoon doctor consultation'
  },
  {
    id: 'ATT-TODAY-05',
    employeeId: 'EMP-1090',
    employeeName: 'Vikram Sengupta',
    department: 'Engineering',
    date: todayStr,
    clockInTime: '08:15:00',
    clockOutTime: undefined,
    totalWorkHours: 5.8,
    status: 'Present',
    location: 'Hyderabad Cyber Gateway',
    notes: 'Cloud database scaling'
  },
  {
    id: 'ATT-TODAY-06',
    employeeId: 'EMP-1104',
    employeeName: 'Priya Sharma',
    department: 'Finance & Ops',
    date: todayStr,
    clockInTime: '',
    clockOutTime: undefined,
    totalWorkHours: 0,
    status: 'Leave',
    location: 'Approved Privilege Leave',
    notes: 'Family function in Jaipur'
  },
  {
    id: 'ATT-TODAY-07',
    employeeId: 'EMP-1115',
    employeeName: 'Rohan Verma',
    department: 'Engineering',
    date: todayStr,
    clockInTime: '09:10:00',
    clockOutTime: undefined,
    totalWorkHours: 4.7,
    status: 'Present',
    location: 'Remote (India)',
    notes: 'API endpoints and tax slab calculation service'
  },

  // Past records for calendar & history
  {
    id: 'ATT-HIST-01',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    department: 'Engineering',
    date: getDateOffset(1),
    clockInTime: '08:55:00',
    clockOutTime: '17:35:00',
    totalWorkHours: 8.6,
    status: 'Present',
    location: 'Bengaluru Tech Hub - 4th Floor'
  },
  {
    id: 'ATT-HIST-02',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    department: 'Engineering',
    date: getDateOffset(2),
    clockInTime: '09:05:00',
    clockOutTime: '17:45:00',
    totalWorkHours: 8.6,
    status: 'Present',
    location: 'Remote (India)'
  },
  {
    id: 'ATT-HIST-03',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    department: 'Engineering',
    date: getDateOffset(3),
    clockInTime: '09:00:00',
    clockOutTime: '17:15:00',
    totalWorkHours: 8.2,
    status: 'Present',
    location: 'Bengaluru Tech Hub - 4th Floor'
  },
  {
    id: 'ATT-HIST-04',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    department: 'Engineering',
    date: getDateOffset(4),
    clockInTime: '08:48:00',
    clockOutTime: '13:00:00',
    totalWorkHours: 4.2,
    status: 'Half-day',
    location: 'Bengaluru Tech Hub - 4th Floor'
  },
  {
    id: 'ATT-HIST-05',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    department: 'Engineering',
    date: getDateOffset(7),
    clockInTime: '09:12:00',
    clockOutTime: '17:40:00',
    totalWorkHours: 8.4,
    status: 'Present',
    location: 'Bengaluru Tech Hub - 4th Floor'
  },
  {
    id: 'ATT-HIST-06',
    employeeId: 'EMP-1001',
    employeeName: 'Ananya Deshmukh',
    department: 'Human Resources',
    date: getDateOffset(1),
    clockInTime: '08:30:00',
    clockOutTime: '17:30:00',
    totalWorkHours: 9.0,
    status: 'Present',
    location: 'Bengaluru Tech Hub - 4th Floor'
  },
  {
    id: 'ATT-HIST-07',
    employeeId: 'EMP-1055',
    employeeName: 'Marcus Chen',
    department: 'Product Design',
    date: getDateOffset(1),
    clockInTime: '09:20:00',
    clockOutTime: '18:00:00',
    totalWorkHours: 8.6,
    status: 'Present',
    location: 'Remote (India)'
  }
];

export let leaveRequests: LeaveRequest[] = [
  {
    id: 'LV-2026-089',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    department: 'Engineering',
    leaveType: 'Paid',
    startDate: getDateOffset(-4), // in 4 days
    endDate: getDateOffset(-6), // in 6 days
    totalDays: 3,
    reason: 'Attending JSConf India and Tech Architecture Summit in Delhi NCR.',
    status: 'Pending',
    appliedDate: getDateOffset(1)
  },
  {
    id: 'LV-2026-088',
    employeeId: 'EMP-1055',
    employeeName: 'Marcus Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    department: 'Product Design',
    leaveType: 'Casual',
    startDate: getDateOffset(-2),
    endDate: getDateOffset(-2),
    totalDays: 1,
    reason: 'Personal banking and passport renewal appointment.',
    status: 'Pending',
    appliedDate: getDateOffset(2)
  },
  {
    id: 'LV-2026-085',
    employeeId: 'EMP-1104',
    employeeName: 'Priya Sharma',
    employeeAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
    department: 'Finance & Ops',
    leaveType: 'Paid',
    startDate: todayStr,
    endDate: getDateOffset(-5),
    totalDays: 6,
    reason: 'Annual family festival and vacation in Rajasthan.',
    status: 'Approved',
    appliedDate: getDateOffset(10),
    reviewedBy: 'Ananya Deshmukh (HR)',
    reviewDate: getDateOffset(8),
    reviewComment: 'Approved. Please ensure Q2 GST TDS filing handover to finance team.'
  },
  {
    id: 'LV-2026-081',
    employeeId: 'EMP-1115',
    employeeName: 'Rohan Verma',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    department: 'Engineering',
    leaveType: 'Sick',
    startDate: getDateOffset(12),
    endDate: getDateOffset(11),
    totalDays: 2,
    reason: 'Viral fever and medical consultation.',
    status: 'Approved',
    appliedDate: getDateOffset(13),
    reviewedBy: 'Ananya Deshmukh (HR)',
    reviewDate: getDateOffset(12),
    reviewComment: 'Approved. Get well soon Rohan!'
  },
  {
    id: 'LV-2026-077',
    employeeId: 'EMP-1078',
    employeeName: 'Sneha Kulkarni',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    department: 'Marketing',
    leaveType: 'Unpaid',
    startDate: getDateOffset(20),
    endDate: getDateOffset(18),
    totalDays: 3,
    reason: 'Extended personal vacation during festival week.',
    status: 'Rejected',
    appliedDate: getDateOffset(25),
    reviewedBy: 'Ananya Deshmukh (HR)',
    reviewDate: getDateOffset(22),
    reviewComment: 'Diwali product launch campaign scheduled for those dates. Kindly reschedule post-launch.'
  }
];

export let payslips: Payslip[] = [
  {
    id: 'PAY-2026-08-1042',
    payrollMonth: 'August 2026',
    issueDate: '2026-08-31',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    jobTitle: 'Senior Frontend Engineer',
    department: 'Engineering',
    panNumber: 'BPMMA4519L',
    uanNumber: '101938472910',
    bankName: 'ICICI Bank',
    bankAccountNumber: '002901582910',
    ifscCode: 'ICIC0000029',
    salary: calculateSalaryStructure(115000),
    workedDays: 22,
    paidLeaveDays: 1,
    unpaidLeaveDays: 0,
    lossOfPayDays: 0,
    paymentStatus: 'Processing',
    paymentReference: 'NEFT-ICIC-89201491',
    paymentMethod: 'NEFT / Direct Bank Transfer'
  },
  {
    id: 'PAY-2026-08-1001',
    payrollMonth: 'August 2026',
    issueDate: '2026-08-31',
    employeeId: 'EMP-1001',
    employeeName: 'Ananya Deshmukh',
    jobTitle: 'Head of People & HR Operations',
    department: 'Human Resources',
    panNumber: 'AAEPD8912K',
    uanNumber: '101294817201',
    bankName: 'HDFC Bank',
    bankAccountNumber: '50100492817263',
    ifscCode: 'HDFC0000128',
    salary: calculateSalaryStructure(145000),
    workedDays: 22,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    lossOfPayDays: 0,
    paymentStatus: 'Processing',
    paymentReference: 'NEFT-HDFC-89201048',
    paymentMethod: 'NEFT / Direct Bank Transfer'
  },
  {
    id: 'PAY-2026-07-1042',
    payrollMonth: 'July 2026',
    issueDate: '2026-07-31',
    employeeId: 'EMP-1042',
    employeeName: 'Aarav Mehta',
    jobTitle: 'Senior Frontend Engineer',
    department: 'Engineering',
    panNumber: 'BPMMA4519L',
    uanNumber: '101938472910',
    bankName: 'ICICI Bank',
    bankAccountNumber: '002901582910',
    ifscCode: 'ICIC0000029',
    salary: calculateSalaryStructure(115000),
    workedDays: 22,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    lossOfPayDays: 0,
    paymentStatus: 'Paid',
    paymentReference: 'NEFT-ICIC-77192384',
    paymentMethod: 'NEFT / Direct Bank Transfer'
  },
  {
    id: 'PAY-2026-07-1055',
    payrollMonth: 'July 2026',
    issueDate: '2026-07-31',
    employeeId: 'EMP-1055',
    employeeName: 'Marcus Chen',
    jobTitle: 'Lead Product Designer',
    department: 'Product Design',
    panNumber: 'CHPMC9921D',
    uanNumber: '101827364519',
    bankName: 'Axis Bank',
    bankAccountNumber: '912010048192019',
    ifscCode: 'UTIB0000142',
    salary: calculateSalaryStructure(105000),
    workedDays: 21,
    paidLeaveDays: 1,
    unpaidLeaveDays: 0,
    lossOfPayDays: 0,
    paymentStatus: 'Paid',
    paymentReference: 'NEFT-UTIB-77192490',
    paymentMethod: 'NEFT / Direct Bank Transfer'
  }
];

export function getSystemStats(): SystemStats {
  const total = employees.length;
  const todayRecs = attendanceRecords.filter(r => r.date === todayStr);
  const todayPresent = todayRecs.filter(r => r.status === 'Present').length;
  const todayHalfDay = todayRecs.filter(r => r.status === 'Half-day').length;
  const todayOnLeave = todayRecs.filter(r => r.status === 'Leave').length;
  const todayAbsent = total - (todayPresent + todayHalfDay + todayOnLeave);
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;

  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + emp.salary.netSalary, 0);
  const attendanceRate = total > 0 ? Math.round(((todayPresent + todayHalfDay * 0.5) / total) * 100) : 0;

  return {
    totalEmployees: total,
    todayPresent,
    todayAbsent: Math.max(0, todayAbsent),
    todayOnLeave,
    todayHalfDay,
    attendanceRate,
    pendingLeavesCount: pendingLeaves,
    monthlyPayrollTotal: totalMonthlyPayroll
  };
}

