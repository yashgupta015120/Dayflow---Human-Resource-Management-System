import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DirectoryView } from './components/DirectoryView';
import { AttendanceView } from './components/AttendanceView';
import { LeavesView } from './components/LeavesView';
import { PayrollView } from './components/PayrollView';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { EmployeeProfileModal } from './components/EmployeeProfileModal';
import { SignInView } from './components/SignInView';
import { NetworkParticleBackground } from './components/NetworkParticleBackground';
import { CompanyLogo } from './components/CompanyLogo';
import { Employee } from './types';
import { api } from './services/api';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState<Employee | null>(null);
  const [pendingLeavesCount, setPendingLeavesCount] = useState<number>(0);

  // Sync pending leaves count for sidebar badge
  const refreshPendingLeaves = async () => {
    try {
      const pending = await api.getLeaves({ status: 'Pending' });
      setPendingLeavesCount(pending.length);
    } catch (err) {
      console.error('Error fetching pending leaves count:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshPendingLeaves();
    }
  }, [currentUser, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 relative flex flex-col items-center justify-center overflow-hidden font-sans">
        <NetworkParticleBackground intensity="focused" />

        <div className="relative z-10 glass-box p-8 rounded-3xl max-w-sm w-full mx-4 flex flex-col items-center text-center space-y-5 border border-white/20 shadow-2xl">
          <div className="relative">
            <CompanyLogo size="xl" withContainer className="shadow-2xl shadow-indigo-500/30" />
            <div className="absolute -inset-1 rounded-2xl bg-white/20 blur-sm animate-pulse -z-10" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-manrope font-extrabold text-xl text-white tracking-tight">DAYFLOW HRMS</h2>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-code">WORKSPACE_SEC // +prove✓ trust001</p>
          </div>

          {/* Loading Progress Bar */}
          <div className="w-full space-y-2">
            <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/10 p-0.5">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 h-full rounded-full animate-pulse"
                style={{ width: '84%' }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono-code text-slate-400">
              <span>Initializing Workplace Matrix</span>
              <span className="text-indigo-400">1000^-1 ms</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no user is logged in, show dedicated Sign In page
  if (!currentUser) {
    return <SignInView />;
  }

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-600 relative overflow-x-hidden">
      {/* Dynamic Animated Constellation Particle Network Background */}
      <NetworkParticleBackground intensity="standard" />

      {/* Top Navigation Bar */}
      <div className="relative z-40">
        <Navbar
          onOpenAi={() => setIsAiModalOpen(true)}
          onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
        />
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'ai-assistant') {
              setIsAiModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          pendingLeavesCount={pendingLeavesCount}
        />

        {/* Dynamic Main Workspace Content with Smooth Transition */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)] pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
                  onOpenAi={() => setIsAiModalOpen(true)}
                  onViewEmployee={(emp) => setSelectedEmployeeForModal(emp)}
                />
              )}

              {activeTab === 'directory' && <DirectoryView />}

              {activeTab === 'attendance' && <AttendanceView />}

              {activeTab === 'leaves' && (
                <LeavesView
                  onOpenApplyModal={() => setIsLeaveModalOpen(true)}
                  onOpenAi={() => setIsAiModalOpen(true)}
                />
              )}

              {activeTab === 'payroll' && (
                <PayrollView onOpenAi={() => setIsAiModalOpen(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Modals */}
      <ApplyLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmitted={() => {
          refreshPendingLeaves();
        }}
        onOpenAiHelper={() => setIsAiModalOpen(true)}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {selectedEmployeeForModal && (
        <EmployeeProfileModal
          employee={selectedEmployeeForModal}
          onClose={() => setSelectedEmployeeForModal(null)}
          onUpdated={(updated) => {
            setSelectedEmployeeForModal(updated);
          }}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
