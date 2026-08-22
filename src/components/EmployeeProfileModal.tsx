import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  IndianRupee, 
  HeartHandshake, 
  Edit3, 
  Save, 
  CheckCircle2,
  Lock,
  Download,
  CreditCard,
  Landmark,
  ArrowLeft
} from 'lucide-react';
import { Employee, Department, EmploymentStatus, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatCurrency';

interface EmployeeProfileModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdated: (emp: Employee) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  onClose,
  onUpdated
}) => {
  const { currentUser, isAdmin, updateCurrentUserState } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Editable Form State
  const [phone, setPhone] = useState<string>(employee.phone);
  const [address, setAddress] = useState<string>(employee.address);
  const [avatarUrl, setAvatarUrl] = useState<string>(employee.avatarUrl);
  const [emergencyName, setEmergencyName] = useState<string>(employee.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState<string>(employee.emergencyContact.phone);
  const [emergencyRel, setEmergencyRel] = useState<string>(employee.emergencyContact.relationship);

  // Statutory & Bank State
  const [panNumber, setPanNumber] = useState<string>(employee.panNumber || 'BPMMA4519L');
  const [uanNumber, setUanNumber] = useState<string>(employee.uanNumber || '101938472910');
  const [bankName, setBankName] = useState<string>(employee.bankName || 'HDFC Bank');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>(employee.bankAccountNumber || '50100492817263');
  const [ifscCode, setIfscCode] = useState<string>(employee.ifscCode || 'HDFC0000128');

  // Admin-only fields
  const [jobTitle, setJobTitle] = useState<string>(employee.jobTitle);
  const [department, setDepartment] = useState<Department>(employee.department);
  const [status, setStatus] = useState<EmploymentStatus>(employee.status);
  const [role, setRole] = useState<UserRole>(employee.role);
  const [baseSalary, setBaseSalary] = useState<number>(employee.salary.basicSalary || employee.salary.baseSalary);

  const canEditLimited = !isAdmin && currentUser?.id === employee.id;
  const canEditFull = isAdmin;
  const canEdit = canEditLimited || canEditFull;

  // Listen to Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: any = {
        phone,
        address,
        avatarUrl,
        panNumber,
        uanNumber,
        bankName,
        bankAccountNumber,
        ifscCode,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRel
        }
      };

      if (isAdmin) {
        payload.jobTitle = jobTitle;
        payload.department = department;
        payload.status = status;
        payload.role = role;
        payload.baseSalary = Number(baseSalary);
      }

      const updated = await api.updateEmployee(employee.id, payload);
      onUpdated(updated);
      if (currentUser?.id === updated.id) {
        updateCurrentUserState(updated);
      }
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white max-w-2xl w-full rounded-2xl border border-slate-200 overflow-hidden shadow-2xl my-6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar & Header Banner */}
        <div className="relative h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 flex justify-between items-start border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-mono-code font-bold border border-white/10">
              {employee.id}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono-code font-bold border ${
              employee.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {employee.status}
            </span>
            <span className="text-[11px] text-slate-300 font-mono-code hidden sm:inline">
              EMPLOYEE RECORD
            </span>
          </div>

          {/* Prominent High-Visibility Back & Close Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              title="Return to Directory (Esc)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-rose-600/80 text-white border border-white/20 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Close Profile (Esc)"
              aria-label="Close Profile"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 pb-6 pt-0 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <img
                src={avatarUrl || employee.avatarUrl}
                alt={employee.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-slate-100 ring-1 ring-slate-200"
              />
              <div>
                <h2 className="font-manrope text-xl font-extrabold text-slate-900">
                  {employee.name}
                </h2>
                <p className="text-xs text-indigo-600 font-bold">
                  {employee.jobTitle} • {employee.department}
                </p>
                <p className="text-[11px] text-slate-500 font-mono-code mt-0.5">
                  Joined: {employee.joinDate} • Manager: {employee.managerName}
                </p>
              </div>
            </div>

            {canEdit && (
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isAdmin ? 'Edit All Details' : 'Edit Contact Info'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Form / Detail Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Contact & Personal Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-mono-code font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Personal Contact Details
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Email Address</label>
                  <p className="text-slate-800 font-mono-code bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    {employee.email}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500 text-xs font-mono-code"
                    />
                  ) : (
                    <p className="text-slate-800 font-medium">{employee.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">Residential Location</label>
                  {isEditing ? (
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  ) : (
                    <p className="text-slate-800">{employee.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Statutory & KYC Details (PAN / UAN / Bank) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-mono-code font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                Indian Statutory & Bank KYC
              </h3>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">PAN Card</label>
                    {isEditing && isAdmin ? (
                      <input
                        type="text"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-900 font-mono-code text-xs font-bold"
                      />
                    ) : (
                      <span className="font-mono-code font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block">
                        {employee.panNumber || 'BPMMA4519L'}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">UAN (EPFO)</label>
                    {isEditing && isAdmin ? (
                      <input
                        type="text"
                        value={uanNumber}
                        onChange={(e) => setUanNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-900 font-mono-code text-xs font-bold"
                      />
                    ) : (
                      <span className="font-mono-code font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block">
                        {employee.uanNumber || '101938472910'}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Bank & IFSC Code</label>
                  <p className="font-mono-code text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
                    {employee.bankName || 'HDFC Bank'} • IFSC: {employee.ifscCode || 'HDFC0000128'}
                  </p>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Account Number</label>
                  <p className="font-mono-code text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
                    A/C: {employee.bankAccountNumber || '50100492817263'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Job Role & Indian Salary Structure */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono-code font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Indian Salary & CTC Structure
              </h3>
              {!isAdmin && (
                <span className="text-[10px] text-slate-500 font-mono-code flex items-center gap-1">
                  <Lock className="w-3 h-3" /> STATUTORY READ-ONLY
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Basic Pay (50%)</span>
                {isAdmin && isEditing ? (
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono-code text-xs mt-1 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <span className="font-mono-code font-bold text-slate-900 text-sm">
                    {formatINR(employee.salary.basicSalary || employee.salary.baseSalary)}
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">HRA (40%)</span>
                <span className="font-mono-code font-bold text-slate-700 text-sm">
                  {formatINR(employee.salary.hra)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Monthly Gross CTC</span>
                <span className="font-mono-code font-bold text-emerald-600 text-sm">
                  {formatINR(employee.salary.grossSalary)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                <span className="text-[10px] text-indigo-700 block font-medium">Net Take-Home</span>
                <span className="font-mono-code font-bold text-indigo-900 text-sm">
                  {formatINR(employee.salary.netSalary)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Employee Documents */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-mono-code font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Verified Onboarding & Compliance Documents
            </h3>

            <div className="space-y-2">
              {employee.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs hover:border-slate-300"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-slate-800">{doc.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono-code">
                        {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Downloading verified copy of ${doc.name}`)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Download Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Close Button Bar */}
          <div className="pt-2 flex items-center justify-end border-t border-slate-200 gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back / Close Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
