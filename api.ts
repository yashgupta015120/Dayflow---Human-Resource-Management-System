import { Employee, AttendanceRecord, LeaveRequest, Payslip, SystemStats } from '../types';

export const api = {
  // Stats
  async getStats(): Promise<SystemStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch system stats');
    return res.json();
  },

  // Auth
  async login(email: string, password?: string): Promise<{ user: Employee; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to sign in');
    }
    return res.json();
  },

  async register(data: Partial<Employee> & { baseSalary?: number; password?: string }): Promise<{ user: Employee; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to sign up');
    }
    return res.json();
  },

  async getDemoUsers(): Promise<Array<Pick<Employee, 'id' | 'name' | 'email' | 'role' | 'jobTitle' | 'department' | 'avatarUrl'>>> {
    const res = await fetch('/api/auth/demo-users');
    if (!res.ok) throw new Error('Failed to fetch demo users');
    return res.json();
  },

  // Employees
  async getEmployees(params?: { department?: string; status?: string; query?: string }): Promise<Employee[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/employees?${query}`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const res = await fetch(`/api/employees/${id}`);
    if (!res.ok) throw new Error('Failed to fetch employee details');
    return res.json();
  },

  async createEmployee(data: any): Promise<Employee> {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create employee');
    }
    return res.json();
  },

  async updateEmployee(id: string, data: Partial<Employee> & { baseSalary?: number }): Promise<Employee> {
    const res = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update employee');
    }
    return res.json();
  },

  // Attendance
  async getAttendance(params?: { employeeId?: string; date?: string; department?: string }): Promise<AttendanceRecord[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/attendance?${query}`);
    if (!res.ok) throw new Error('Failed to fetch attendance records');
    return res.json();
  },

  async getTodayAttendanceStatus(employeeId: string): Promise<{ date: string; isClockedIn: boolean; record: AttendanceRecord | null }> {
    const res = await fetch(`/api/attendance/today-status/${employeeId}`);
    if (!res.ok) throw new Error('Failed to fetch today status');
    return res.json();
  },

  async clockIn(employeeId: string, location?: string, notes?: string): Promise<AttendanceRecord> {
    const res = await fetch('/api/attendance/clock-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, location, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to clock in');
    }
    return res.json();
  },

  async clockOut(employeeId: string, notes?: string): Promise<AttendanceRecord> {
    const res = await fetch('/api/attendance/clock-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to clock out');
    }
    return res.json();
  },

  // Leaves
  async getLeaves(params?: { employeeId?: string; status?: string }): Promise<LeaveRequest[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/leaves?${query}`);
    if (!res.ok) throw new Error('Failed to fetch leave requests');
    return res.json();
  },

  async createLeave(data: { employeeId: string; leaveType: string; startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> {
    const res = await fetch('/api/leaves/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit leave request');
    }
    return res.json();
  },

  async applyLeave(data: { employeeId: string; leaveType: string; startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> {
    return this.createLeave(data);
  },

  async updateLeaveStatus(id: string, status: 'Approved' | 'Rejected', reviewerName: string, reviewComment?: string): Promise<LeaveRequest> {
    const res = await fetch(`/api/leaves/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewerName, reviewComment })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update leave status');
    }
    return res.json();
  },

  // Payroll
  async getPayslips(params?: { employeeId?: string }): Promise<Payslip[]> {
    const url = params?.employeeId ? `/api/payroll/employee/${params.employeeId}` : '/api/payroll';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch payslips');
    return res.json();
  },

  async getPayroll(): Promise<Payslip[]> {
    return this.getPayslips();
  },

  async getEmployeePayslips(employeeId: string): Promise<Payslip[]> {
    return this.getPayslips({ employeeId });
  },

  async generatePayslip(employeeId: string, month?: string): Promise<Payslip> {
    const res = await fetch('/api/payroll/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, month })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate payslip');
    }
    return res.json();
  },

  async runPayroll(month?: string): Promise<{ success: boolean; generatedCount: number; targetMonth: string }> {
    const res = await fetch('/api/payroll/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to execute payroll run');
    }
    return res.json();
  },

  // AI Assistant
  async askAi(prompt: string, context?: any): Promise<{ answer: string; timestamp: string }> {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        employeeId: context?.currentUser?.id || (typeof context === 'string' ? context : undefined),
        context 
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to query AI assistant');
    }
    return res.json();
  }
};
