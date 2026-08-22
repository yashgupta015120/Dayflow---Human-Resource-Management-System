import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Square, 
  Calendar as CalendarIcon, 
  List, 
  Download, 
  Filter, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AttendanceRecord, AttendanceStatus, Department } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const AttendanceView: React.FC = () => {
  const { currentUser, isAdmin, refreshUser } = useAuth();
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isClocking, setIsClocking] = useState<boolean>(false);
  const [locationType, setLocationType] = useState<string>('Office HQ - 4th Floor');
  const [shiftNote, setShiftNote] = useState<string>('');
  const [todayStatus, setTodayStatus] = useState<{ isClockedIn: boolean; record: AttendanceRecord | null }>({
    isClockedIn: false,
    record: null
  });

  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 7, 1)); // August 2026

  const loadAttendance = async () => {
    try {
      const params: any = {};
      if (!isAdmin && currentUser) {
        params.employeeId = currentUser.id;
      }
      if (selectedDept !== 'All') {
        params.department = selectedDept;
      }

      const [data, today] = await Promise.all([
        api.getAttendance(params),
        currentUser ? api.getTodayAttendanceStatus(currentUser.id) : Promise.resolve({ isClockedIn: false, record: null })
      ]);

      setRecords(data);
      setTodayStatus(today);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [currentUser, isAdmin, selectedDept]);

  // Handle Clock In
  const handleClockIn = async () => {
    if (!currentUser) return;
    setIsClocking(true);
    try {
      await api.clockIn(currentUser.id, locationType, shiftNote);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setShiftNote('');
      await loadAttendance();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Clock in failed');
    } finally {
      setIsClocking(false);
    }
  };

  // Handle Clock Out
  const handleClockOut = async () => {
    if (!currentUser) return;
    setIsClocking(true);
    try {
      await api.clockOut(currentUser.id, shiftNote || 'Standard shift end');
      setShiftNote('');
      await loadAttendance();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Clock out failed');
    } finally {
      setIsClocking(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesSearch = searchQuery === '' || 
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Record ID', 'Employee ID', 'Employee Name', 'Department', 'Date', 'Clock In', 'Clock Out', 'Hours', 'Status', 'Location'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.employeeId,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.date,
      r.clockInTime,
      r.clockOutTime || 'Active',
      r.totalWorkHours,
      r.status,
      `"${r.location}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dayflow_Attendance_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calendar matrix generator for the month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const getDayAttendance = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.filter(r => r.date === dateStr);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'Half-day':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      case 'Leave':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30';
      case 'Absent':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/30';
      default:
        return 'bg-slate-800/60 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-indigo-600" />
            Attendance Management Matrix
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {isAdmin ? 'Aggregated organization logs, shift trackers, and punch history.' : 'Your personal check-in/out timesheet and calendar record.'}
          </p>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/70 border border-white/15 backdrop-blur-md">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table List</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/15 text-xs font-semibold text-slate-200 shadow-md backdrop-blur-md transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Clock-in Station Banner */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold ${
            todayStatus.isClockedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' : 'bg-slate-800/80 text-slate-400 border border-white/10'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-manrope font-bold text-white text-base">
                {currentUser?.name} • Daily Shift Portal
              </h2>
              <span className={`text-[10px] font-mono-code font-bold px-2.5 py-0.5 rounded-full ${
                todayStatus.isClockedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-slate-800 text-slate-400 border border-white/10'
              }`}>
                {todayStatus.isClockedIn ? 'ACTIVE SESSION' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {todayStatus.isClockedIn
                ? `Clocked in at ${todayStatus.record?.clockInTime} (${todayStatus.record?.location})`
                : 'Self-service shift punch. Core business window: 09:00 AM - 05:30 PM.'}
            </p>
          </div>
        </div>

        {/* Input & Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!todayStatus.isClockedIn ? (
            <>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="text-xs bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
              >
                <option value="Office HQ - 4th Floor" className="bg-slate-900 text-white">Office HQ - 4th Floor</option>
                <option value="Remote Work (Home/VPN)" className="bg-slate-900 text-white">Remote Work (Home/VPN)</option>
                <option value="Client Site / Travel" className="bg-slate-900 text-white">Client Site / Travel</option>
              </select>

              <input
                type="text"
                value={shiftNote}
                onChange={(e) => setShiftNote(e.target.value)}
                placeholder="Optional task note..."
                className="text-xs bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 w-48"
              />

              <button
                onClick={handleClockIn}
                disabled={isClocking}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer border border-emerald-400/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isClocking ? 'Clocking in...' : 'Clock In'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shiftNote}
                onChange={(e) => setShiftNote(e.target.value)}
                placeholder="Shift summary note..."
                className="text-xs bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 w-56"
              />

              <button
                onClick={handleClockOut}
                disabled={isClocking}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer border border-rose-400/30"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>{isClocking ? 'Clocking out...' : 'Clock Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by staff or location..."
              className="pl-8 pr-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 w-52"
            />
          </div>

          {isAdmin && (
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
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="All" className="bg-slate-900 text-white">All Statuses</option>
            <option value="Present" className="bg-slate-900 text-white">Present</option>
            <option value="Half-day" className="bg-slate-900 text-white">Half-day</option>
            <option value="Leave" className="bg-slate-900 text-white">On Leave</option>
            <option value="Absent" className="bg-slate-900 text-white">Absent</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300 font-mono-code font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span> Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span> Half-day
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400"></span> Leave
          </span>
        </div>
      </div>

      {/* CALENDAR MATRIX VIEW */}
      {viewMode === 'calendar' ? (
        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-manrope text-lg font-bold text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <span className="text-xs font-mono-code text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-md border border-indigo-400/30 font-semibold">
                {records.length} Logs Tracked
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                className="p-1.5 rounded-xl bg-slate-950/70 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                className="p-1.5 rounded-xl bg-slate-950/70 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono-code font-semibold text-slate-400">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-24 rounded-xl bg-slate-950/30 border border-white/5"></div>;
              }

              const dayRecs = getDayAttendance(day);
              const isToday = day === new Date().getDate() && month === new Date().getMonth();

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[100px] p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'bg-indigo-950/60 border-indigo-400/60 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono-code font-bold ${isToday ? 'text-indigo-300' : 'text-slate-300'}`}>
                      {day}
                    </span>
                    {dayRecs.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono-code">
                        {dayRecs.length} rec{dayRecs.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 my-1 overflow-y-auto max-h-16">
                    {dayRecs.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center justify-between font-medium ${getStatusBadge(r.status)}`}
                      >
                        <span className="truncate">{isAdmin ? r.employeeName.split(' ')[0] : r.status}</span>
                        <span className="font-mono-code font-semibold">{r.totalWorkHours}h</span>
                      </div>
                    ))}
                    {dayRecs.length > 3 && (
                      <p className="text-[9px] text-slate-400 text-center">+{dayRecs.length - 3} more</p>
                    )}
                  </div>

                  <div className="text-[9px] text-slate-400 font-mono-code text-right">
                    {dayRecs.length === 0 ? '—' : `${dayRecs.reduce((sum, c) => sum + c.totalWorkHours, 0).toFixed(1)}h total`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/15 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-mono-code uppercase tracking-wider border-b border-white/10 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Clock In</th>
                  <th className="py-3.5 px-4">Clock Out</th>
                  <th className="py-3.5 px-4">Total Hours</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No attendance records found matching the filter.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{rec.employeeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono-code">{rec.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 text-indigo-400 font-medium">{rec.department}</td>
                      <td className="py-3 px-4 font-mono-code text-slate-300">{rec.date}</td>
                      <td className="py-3 px-4 font-mono-code text-emerald-400 font-semibold">{rec.clockInTime}</td>
                      <td className="py-3 px-4 font-mono-code text-slate-300">
                        {rec.clockOutTime || <span className="text-amber-400 font-semibold">Active</span>}
                      </td>
                      <td className="py-3 px-4 font-mono-code font-bold text-white">
                        {rec.totalWorkHours > 0 ? `${rec.totalWorkHours} hrs` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold border ${getStatusBadge(rec.status)}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rec.location}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
