import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  CircleDollarSign, 
  Sparkles, 
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiquidWaveBackground } from './LiquidWaveBackground';

export type ActiveTab = 'dashboard' | 'directory' | 'attendance' | 'leaves' | 'payroll' | 'ai-assistant';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingLeavesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, pendingLeavesCount }) => {
  const { isAdmin, currentUser, logout } = useAuth();

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'directory' as ActiveTab,
      label: 'Staff Directory',
      icon: Users,
      badge: undefined
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Attendance Matrix',
      icon: Clock,
      badge: 'Live'
    },
    {
      id: 'leaves' as ActiveTab,
      label: 'Leave Requests',
      icon: CalendarDays,
      badge: isAdmin && pendingLeavesCount > 0 ? `${pendingLeavesCount} Pending` : undefined,
      badgeColor: 'bg-orange-500/25 text-orange-200 border-orange-400/40'
    },
    {
      id: 'payroll' as ActiveTab,
      label: 'Payroll & Slips',
      icon: CircleDollarSign,
      badge: undefined
    },
    {
      id: 'ai-assistant' as ActiveTab,
      label: 'Dayflow AI',
      icon: Sparkles,
      badge: 'Smart',
      badgeColor: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40'
    }
  ];

  return (
    <aside className="w-64 border-r border-white/10 text-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] select-none relative overflow-hidden shadow-2xl">
      {/* Background Graphic Overlay: Monochrome Liquid Wave Animated Artwork */}
      <LiquidWaveBackground />

      {/* Navigation List Container */}
      <div className="p-4 space-y-2 relative z-10">
        {/* Core Modules Header */}
        <div className="px-3 py-2 text-[11px] font-mono-code uppercase tracking-wider text-slate-200 font-bold flex items-center justify-between bg-white/[0.08] border border-white/15 rounded-xl backdrop-blur-md shadow-inner">
          <span className="flex items-center gap-1.5 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-300 shadow-sm shadow-white/40"></span>
            Core Modules
          </span>
          <span className="text-emerald-300 flex items-center gap-1 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-400/30">
            LIVE
          </span>
        </div>

        {/* Core Module Action Buttons with Clear Glass Box UI */}
        <div className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group cursor-pointer backdrop-blur-xl ${
                  isActive
                    ? 'bg-white/20 text-white font-bold shadow-lg shadow-black/30 border border-white/40 ring-1 ring-white/25 scale-[1.01]'
                    : 'bg-white/[0.06] hover:bg-white/[0.14] text-slate-200 hover:text-white border border-white/10 hover:border-white/25 shadow-md shadow-black/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-300 group-hover:text-white group-hover:bg-white/15'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-white text-slate-900 border-white shadow-sm'
                        : item.id === 'leaves'
                        ? 'bg-orange-500/20 text-orange-200 border-orange-400/40'
                        : item.id === 'ai-assistant'
                        ? 'bg-white/15 text-slate-200 border-white/25'
                        : 'bg-white/10 text-slate-300 border-white/15'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Info & Telemetry Card */}
      <div className="p-4 border-t border-white/10 space-y-3 relative z-10 bg-black/40 backdrop-blur-md">
        {/* Role Access Scope card */}
        <div className="p-3 rounded-xl bg-white/[0.06] border border-white/15 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-semibold">Access Scope</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
              isAdmin ? 'bg-orange-500/25 text-orange-200 border border-orange-400/40' : 'bg-white/15 text-slate-200 border border-white/20'
            }`}>
              {isAdmin ? 'FULL ADMIN' : 'SELF SERVICE'}
            </span>
          </div>

          <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {isAdmin ? (
              <p>Write access for organization payroll, leave reviews, and employee records.</p>
            ) : (
              <p>Self-service access to log attendance, apply for leaves, and inspect pay receipts.</p>
            )}
          </div>
        </div>

        {/* System telemetry status and logout */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-300 font-mono-code pt-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">NODE OK</span>
          </div>
          <button
            onClick={() => logout()}
            className="text-slate-400 hover:text-rose-300 font-sans text-xs transition-colors cursor-pointer hover:underline"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};
