import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  employees,
  attendanceRecords,
  leaveRequests,
  payslips,
  getSystemStats,
  calculateSalaryStructure
} from './server/db.js';
import { askDayflowAi } from './server/gemini.js';
import { Employee, AttendanceRecord, LeaveRequest, Payslip } from './src/types.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // 1. HEALTH & METRICS
  // ==========================================
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Dayflow HRMS API', version: '3.2.0', timestamp: new Date().toISOString() });
  });

  app.get('/api/stats', (req, res) => {
    try {
      const stats = getSystemStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // 2. AUTHENTICATION & DEMO SWITCHER
  // ==========================================
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const identifier = (email || '').trim().toLowerCase();
    const providedPass = (password || '').trim();

    if (!identifier) {
      return res.status(400).json({ error: 'Please enter your Employee ID or Work Email address.' });
    }

    const user = employees.find(
      e => e.email.toLowerCase() === identifier || e.id.toLowerCase() === identifier
    );

    if (!user) {
      return res.status(401).json({ 
        error: `No employee account found matching "${email}". Check your Employee ID (e.g. EMP-1001) or email address.` 
      });
    }

    // Password validation: Check specific assigned password or standard universal fallbacks
    const expectedPass = user.password || `${user.name.split(' ')[0].toLowerCase()}@dayflow2026`;
    const firstName = user.name.split(' ')[0].toLowerCase();
    const allowedPasswords = [
      expectedPass.toLowerCase(),
      'dayflow123',
      'dayflow@2026',
      'password123',
      'admin123',
      `${firstName}@123`,
      `${firstName}@dayflow2026`,
      `${user.id.toLowerCase()}123`
    ];

    if (!providedPass) {
      return res.status(400).json({ 
        error: `Please enter the password for ${user.name}.` 
      });
    }

    if (!allowedPasswords.includes(providedPass.toLowerCase())) {
      return res.status(401).json({ 
        error: `Incorrect password for ${user.name}. Please enter the correct password.` 
      });
    }

    res.json({
      user,
      token: `dayflow-token-${user.id}-${Date.now()}`
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, department, jobTitle, employeeId } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and work email are required.' });
    }

    const existing = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An employee with this work email already exists.' });
    }

    const newId = employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const baseSalary = role === 'admin' ? 140000 : 95000;
    const newEmployee: Employee = {
      id: newId,
      name,
      email,
      password: password || 'Dayflow@2026',
      role: role === 'admin' ? 'admin' : 'employee',
      jobTitle: jobTitle || (role === 'admin' ? 'HR Operations Specialist' : 'Software Engineer'),
      department: department || 'Engineering',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      phone: '+91 98000 12345',
      address: 'Bengaluru, Karnataka, India',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      managerName: 'Ananya Deshmukh (HR Admin)',
      panNumber: `PAN${Math.random().toString(36).substring(2, 7).toUpperCase()}1Z`,
      uanNumber: `101${Math.floor(100000000 + Math.random() * 900000000)}`,
      bankName: 'HDFC Bank',
      bankAccountNumber: `50100${Math.floor(100000000 + Math.random() * 900000000)}`,
      ifscCode: 'HDFC0000128',
      salary: calculateSalaryStructure(baseSalary),
      leaveBalance: {
        paid: { total: 18, used: 0 },
        sick: { total: 10, used: 0 },
        casual: { total: 6, used: 0 }
      },
      emergencyContact: {
        name: 'Family Contact',
        relationship: 'Guardian',
        phone: '+91 98000 99999'
      },
      documents: [
        { name: 'Onboarding_Profile_Form.pdf', type: 'Onboarding', uploadDate: new Date().toISOString().split('T')[0], size: '950 KB' }
      ]
    };

    employees.unshift(newEmployee);

    res.status(201).json({
      user: newEmployee,
      token: `dayflow-token-${newEmployee.id}-${Date.now()}`
    });
  });

  app.get('/api/auth/demo-users', (req, res) => {
    res.json(employees.map(e => ({
      id: e.id,
      name: e.name,
      email: e.email,
      role: e.role,
      jobTitle: e.jobTitle,
      department: e.department,
      avatarUrl: e.avatarUrl
    })));
  });

  // ==========================================
  // 3. EMPLOYEES & DIRECTORY MANAGEMENT
  // ==========================================
  app.get('/api/employees', (req, res) => {
    const { department, status, query } = req.query;
    let list = [...employees];

    if (department && department !== 'All') {
      list = list.filter(e => e.department === department);
    }
    if (status && status !== 'All') {
      list = list.filter(e => e.status === status);
    }
    if (query) {
      const q = String(query).toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.jobTitle.toLowerCase().includes(q));
    }

    res.json(list);
  });

  app.get('/api/employees/:id', (req, res) => {
    const emp = employees.find(e => e.id === req.params.id);
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(emp);
  });

  app.post('/api/employees', (req, res) => {
    const data = req.body;
    if (!data.name || !data.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const baseSal = Number(data.baseSalary) || 95000;

    const newEmp: Employee = {
      id: newId,
      name: data.name,
      email: data.email,
      role: data.role || 'employee',
      jobTitle: data.jobTitle || 'Software Engineer',
      department: data.department || 'Engineering',
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      phone: data.phone || '+91 98450 12345',
      address: data.address || 'Bengaluru, Karnataka, India',
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Active',
      managerName: data.managerName || 'Ananya Deshmukh (HR Admin)',
      panNumber: data.panNumber || `BPM${Math.random().toString(36).substring(2, 6).toUpperCase()}892K`,
      uanNumber: data.uanNumber || `101${Math.floor(100000000 + Math.random() * 900000000)}`,
      bankName: data.bankName || 'HDFC Bank',
      bankAccountNumber: data.bankAccountNumber || `50100${Math.floor(100000000 + Math.random() * 900000000)}`,
      ifscCode: data.ifscCode || 'HDFC0000128',
      salary: calculateSalaryStructure(baseSal),
      leaveBalance: {
        paid: { total: 18, used: 0 },
        sick: { total: 10, used: 0 },
        casual: { total: 6, used: 0 }
      },
      emergencyContact: {
        name: data.emergencyContactName || 'Emergency Contact',
        relationship: data.emergencyRelationship || 'Family',
        phone: data.emergencyPhone || '+91 98450 99999'
      },
      documents: [
        { name: 'Standard_Employment_Agreement.pdf', type: 'Contract', uploadDate: new Date().toISOString().split('T')[0], size: '1.4 MB' }
      ]
    };

    employees.unshift(newEmp);
    res.status(201).json(newEmp);
  });

  app.put('/api/employees/:id', (req, res) => {
    const idx = employees.findIndex(e => e.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updateData = req.body;
    const current = employees[idx];

    // Merge allowed fields
    const updated: Employee = {
      ...current,
      ...updateData,
      salary: updateData.baseSalary ? calculateSalaryStructure(Number(updateData.baseSalary)) : current.salary,
      emergencyContact: {
        ...current.emergencyContact,
        ...(updateData.emergencyContact || {})
      }
    };

    employees[idx] = updated;
    res.json(updated);
  });

  // ==========================================
  // 4. ATTENDANCE MANAGEMENT
  // ==========================================
  app.get('/api/attendance', (req, res) => {
    const { employeeId, date, department } = req.query;
    let records = [...attendanceRecords];

    if (employeeId) {
      records = records.filter(r => r.employeeId === employeeId);
    }
    if (date) {
      records = records.filter(r => r.date === date);
    }
    if (department && department !== 'All') {
      records = records.filter(r => r.department === department);
    }

    // Sort newest date first
    records.sort((a, b) => b.date.localeCompare(a.date));
    res.json(records);
  });

  app.get('/api/attendance/today-status/:employeeId', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const rec = attendanceRecords.find(r => r.employeeId === req.params.employeeId && r.date === today);

    res.json({
      date: today,
      isClockedIn: !!rec && !rec.clockOutTime,
      record: rec || null
    });
  });

  app.post('/api/attendance/clock-in', (req, res) => {
    const { employeeId, location, notes } = req.body;
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = attendanceRecords.find(r => r.employeeId === employeeId && r.date === today);

    if (existing && !existing.clockOutTime) {
      return res.status(400).json({ error: 'You are already clocked in for today.' });
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

    if (existing && existing.clockOutTime) {
      // Re-clock in
      existing.clockOutTime = undefined;
      existing.notes = (existing.notes ? existing.notes + ' | ' : '') + 'Re-clocked in at ' + timeStr;
      return res.json(existing);
    }

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      date: today,
      clockInTime: timeStr,
      clockOutTime: undefined,
      totalWorkHours: 0,
      status: 'Present',
      location: location || 'Bengaluru Tech Hub - 4th Floor',
      notes: notes || 'Standard shift start'
    };

    attendanceRecords.unshift(newRecord);
    res.status(201).json(newRecord);
  });

  app.post('/api/attendance/clock-out', (req, res) => {
    const { employeeId, notes } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const rec = attendanceRecords.find(r => r.employeeId === employeeId && r.date === today);

    if (!rec) {
      return res.status(400).json({ error: 'No active clock-in found for today.' });
    }
    if (rec.clockOutTime) {
      return res.status(400).json({ error: 'You have already clocked out for today.' });
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    rec.clockOutTime = timeStr;

    // Calculate total hours
    const [inH, inM, inS] = rec.clockInTime.split(':').map(Number);
    const [outH, outM, outS] = timeStr.split(':').map(Number);
    const inTotalSec = (inH || 0) * 3600 + (inM || 0) * 60 + (inS || 0);
    const outTotalSec = (outH || 0) * 3600 + (outM || 0) * 60 + (outS || 0);
    const diffHours = Math.max(0.1, Number(((outTotalSec - inTotalSec) / 3600).toFixed(2)));

    rec.totalWorkHours = diffHours;
    if (diffHours < 4.5) {
      rec.status = 'Half-day';
    }
    if (notes) {
      rec.notes = (rec.notes ? rec.notes + ' | ' : '') + notes;
    }

    res.json(rec);
  });

  // ==========================================
  // 5. LEAVE & TIME-OFF MANAGEMENT
  // ==========================================
  app.get('/api/leaves', (req, res) => {
    const { employeeId, status } = req.query;
    let list = [...leaveRequests];

    if (employeeId) {
      list = list.filter(l => l.employeeId === employeeId);
    }
    if (status && status !== 'All') {
      list = list.filter(l => l.status === status);
    }

    list.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
    res.json(list);
  });

  app.post('/api/leaves/apply', (req, res) => {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ error: 'Start date, end date, and reason are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const newLeave: LeaveRequest = {
      id: `LV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatarUrl,
      department: emp.department,
      leaveType: leaveType || 'Paid',
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    leaveRequests.unshift(newLeave);
    res.status(201).json(newLeave);
  });

  app.put('/api/leaves/:id/status', (req, res) => {
    const { status, reviewComment, reviewerName } = req.body;
    const leave = leaveRequests.find(l => l.id === req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    leave.status = status; // 'Approved' | 'Rejected'
    leave.reviewedBy = reviewerName || 'Ananya Deshmukh (HR Admin)';
    leave.reviewDate = new Date().toISOString().split('T')[0];
    if (reviewComment) {
      leave.reviewComment = reviewComment;
    }

    // If approved, deduct balance
    if (status === 'Approved') {
      const emp = employees.find(e => e.id === leave.employeeId);
      if (emp) {
        if (leave.leaveType === 'Paid') {
          emp.leaveBalance.paid.used += leave.totalDays;
        } else if (leave.leaveType === 'Sick') {
          emp.leaveBalance.sick.used += leave.totalDays;
        } else if (leave.leaveType === 'Casual') {
          emp.leaveBalance.casual.used += leave.totalDays;
        }
      }
    }

    res.json(leave);
  });

  // ==========================================
  // 6. PAYROLL MANAGEMENT
  // ==========================================
  app.get('/api/payroll', (req, res) => {
    res.json(payslips);
  });

  app.get('/api/payroll/employee/:employeeId', (req, res) => {
    const empPayslips = payslips.filter(p => p.employeeId === req.params.employeeId);
    res.json(empPayslips);
  });

  app.post('/api/payroll/generate', (req, res) => {
    const { employeeId, month } = req.body;
    const targetMonth = month || 'August 2026';

    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const newPayslip: Payslip = {
      id: `PAY-${Date.now().toString().slice(-6)}-${emp.id.replace('EMP-', '')}`,
      payrollMonth: targetMonth,
      issueDate: new Date().toISOString().split('T')[0],
      employeeId: emp.id,
      employeeName: emp.name,
      jobTitle: emp.jobTitle,
      department: emp.department,
      panNumber: emp.panNumber || 'ABCDE1234F',
      uanNumber: emp.uanNumber || '101234567890',
      bankName: emp.bankName || 'HDFC Bank',
      bankAccountNumber: emp.bankAccountNumber || '50100492817263',
      ifscCode: emp.ifscCode || 'HDFC0000128',
      salary: emp.salary,
      workedDays: 22,
      paidLeaveDays: 1,
      unpaidLeaveDays: 0,
      lossOfPayDays: 0,
      paymentStatus: 'Paid',
      paymentReference: `NEFT-${(emp.bankName || 'HDFC').substring(0, 4).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentMethod: 'NEFT / Direct Bank Transfer'
    };

    payslips.unshift(newPayslip);
    res.status(201).json(newPayslip);
  });

  app.post('/api/payroll/run', (req, res) => {
    const { month } = req.body;
    const targetMonth = month || 'August 2026';
    let generatedCount = 0;

    for (const emp of employees) {
      if (emp.status !== 'Terminated') {
        const existing = payslips.find(p => p.employeeId === emp.id && p.payrollMonth === targetMonth);
        if (!existing) {
          const newPayslip: Payslip = {
            id: `PAY-${Date.now().toString().slice(-6)}-${emp.id.replace('EMP-', '')}`,
            payrollMonth: targetMonth,
            issueDate: new Date().toISOString().split('T')[0],
            employeeId: emp.id,
            employeeName: emp.name,
            jobTitle: emp.jobTitle,
            department: emp.department,
            panNumber: emp.panNumber || 'ABCDE1234F',
            uanNumber: emp.uanNumber || '101234567890',
            bankName: emp.bankName || 'HDFC Bank',
            bankAccountNumber: emp.bankAccountNumber || '50100492817263',
            ifscCode: emp.ifscCode || 'HDFC0000128',
            salary: emp.salary,
            workedDays: 22,
            paidLeaveDays: emp.leaveBalance.paid.used,
            unpaidLeaveDays: 0,
            lossOfPayDays: 0,
            paymentStatus: 'Paid',
            paymentReference: `NEFT-${(emp.bankName || 'HDFC').substring(0, 4).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
            paymentMethod: 'NEFT / Direct Bank Transfer'
          };
          payslips.unshift(newPayslip);
          generatedCount++;
        }
      }
    }

    res.json({ success: true, generatedCount, targetMonth });
  });

  // ==========================================
  // 7. DAYFLOW AI HR ASSISTANT
  // ==========================================
  app.post('/api/ai/ask', async (req, res) => {
    const { prompt, employeeId, context: clientContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const emp = employees.find(e => e.id === employeeId || e.email === employeeId);
    let systemStats: any = null;
    try {
      systemStats = getSystemStats();
    } catch {
      // ignore
    }

    const context = {
      role: emp ? emp.role : (clientContext?.currentUser?.role || 'employee'),
      employeeName: emp ? emp.name : (clientContext?.currentUser?.name || 'Staff Member'),
      department: emp ? emp.department : (clientContext?.currentUser?.department || 'Engineering'),
      employeeId: emp ? emp.id : (clientContext?.currentUser?.id || 'EMP-1001'),
      systemStats,
      ...(clientContext || {})
    };

    try {
      const response = await askDayflowAi(prompt, context);
      res.json({ answer: response, timestamp: new Date().toISOString() });
    } catch (err: any) {
      console.error('AI route error:', err);
      res.json({
        answer: 'Dayflow AI processed your query. Please review your active leave balance and statutory payslips in the portal.',
        timestamp: new Date().toISOString()
      });
    }
  });

  // ==========================================
  // 8. VITE MIDDLEWARE & STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dayflow HRMS Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
