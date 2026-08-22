import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  LayoutGrid, 
  List, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  User, 
  ChevronRight,
  Plus,
  X
} from 'lucide-react';
import { Employee, Department, EmploymentStatus, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { EmployeeProfileModal } from './EmployeeProfileModal';
import confetti from 'canvas-confetti';

export const DirectoryView: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Add Employee Form State
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newJobTitle, setNewJobTitle] = useState<string>('');
  const [newDept, setNewDept] = useState<Department>('Engineering');
  const [newRole, setNewRole] = useState<UserRole>('employee');
  const [newSalary, setNewSalary] = useState<number>(8500);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const loadEmployees = async () => {
    try {
      const data = await api.getEmployees({
        department: selectedDept,
        status: selectedStatus,
        query: searchQuery
      });
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load directory:', err);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [selectedDept, selectedStatus, searchQuery]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    setIsAdding(true);
    try {
      await api.createEmployee({
        name: newName,
        email: newEmail,
        jobTitle: newJobTitle || 'Software Engineer',
        department: newDept,
        role: newRole,
        baseSalary: Number(newSalary)
      });

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      setNewJobTitle('');
      await loadEmployees();
    } catch (err: any) {
      alert(err.message || 'Failed to add employee');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            Staff Directory & Profiles
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Organization member directory, role definitions, and verified document vaults.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/70 border border-white/15 backdrop-blur-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, title, or ID..."
              className="pl-8 pr-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 w-64"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="All" className="bg-slate-900 text-white">All Departments</option>
            <option value="Engineering" className="bg-slate-900 text-white">Engineering</option>
            <option value="Product Design" className="bg-slate-900 text-white">Product Design</option>
            <option value="Marketing" className="bg-slate-900 text-white">Marketing</option>
            <option value="Human Resources" className="bg-slate-900 text-white">Human Resources</option>
            <option value="Finance & Ops" className="bg-slate-900 text-white">Finance & Ops</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="All" className="bg-slate-900 text-white">All Statuses</option>
            <option value="Active" className="bg-slate-900 text-white">Active</option>
            <option value="On Leave" className="bg-slate-900 text-white">On Leave</option>
            <option value="Probation" className="bg-slate-900 text-white">Probation</option>
          </select>
        </div>

        <span className="text-xs text-indigo-300 font-mono-code font-medium">
          {employees.length} Staff Member{employees.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* DIRECTORY VIEW: GRID OR TABLE */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl hover:border-indigo-400/50 hover:bg-slate-900/80 cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <img
                  src={emp.avatarUrl}
                  alt={emp.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 group-hover:border-indigo-400 transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="font-manrope font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                      {emp.name}
                    </h2>
                    <span className="text-[10px] text-slate-400 font-mono-code font-bold">
                      {emp.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">{emp.jobTitle}</p>
                  <p className="text-[11px] text-indigo-400 font-medium">{emp.department}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                  emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {emp.status}
                </span>

                <span className="text-[11px] text-indigo-300 group-hover:text-indigo-200 flex items-center gap-1 transition-colors font-medium">
                  View Profile <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/15 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono-code uppercase tracking-wider border-b border-white/10 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Job Title</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                        <div>
                          <div className="font-semibold text-white">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono-code">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{emp.jobTitle}</td>
                    <td className="py-3 px-4 text-indigo-400 font-medium">{emp.department}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                        emp.role === 'admin' ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      }`}>
                        {emp.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono-code text-slate-400">{emp.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-indigo-400 font-semibold hover:text-indigo-300">
                      Inspect →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdated={(updated) => {
            setSelectedEmployee(updated);
            loadEmployees();
          }}
        />
      )}

      {/* ADD EMPLOYEE MODAL (ADMIN ONLY) */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div 
            className="bg-slate-900/90 backdrop-blur-2xl max-w-lg w-full p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h2 className="font-manrope font-bold text-white text-base">
                  Onboard New Employee
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white border border-white/20 transition-all cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company Email *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. rachel.adams@dayflow.internal"
                  className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as Department)}
                    className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Engineering" className="bg-slate-900 text-white">Engineering</option>
                    <option value="Product Design" className="bg-slate-900 text-white">Product Design</option>
                    <option value="Marketing" className="bg-slate-900 text-white">Marketing</option>
                    <option value="Human Resources" className="bg-slate-900 text-white">Human Resources</option>
                    <option value="Finance & Ops" className="bg-slate-900 text-white">Finance & Ops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="employee" className="bg-slate-900 text-white">Standard Employee</option>
                    <option value="admin" className="bg-slate-900 text-white">HR Admin / Officer</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Monthly Base Salary (₹)</label>
                  <input
                    type="number"
                    value={newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
                    className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/40"
                >
                  {isAdding ? 'Onboarding...' : 'Create Employee Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
