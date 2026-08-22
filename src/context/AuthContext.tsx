import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: Employee | null;
  role: UserRole;
  isAdmin: boolean;
  demoUsers: Array<Pick<Employee, 'id' | 'name' | 'email' | 'role' | 'jobTitle' | 'department' | 'avatarUrl'>>;
  isLoading: boolean;
  login: (emailOrId: string, password?: string) => Promise<void>;
  register: (data: Partial<Employee> & { baseSalary?: number; password?: string }) => Promise<void>;
  switchUser: (employeeId: string) => Promise<void>;
  updateCurrentUserState: (updated: Employee) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [demoUsers, setDemoUsers] = useState<Array<Pick<Employee, 'id' | 'name' | 'email' | 'role' | 'jobTitle' | 'department' | 'avatarUrl'>>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize demo users and check authenticated session
  useEffect(() => {
    async function init() {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);

        const savedId = localStorage.getItem('dayflow_user_id');
        if (savedId) {
          try {
            const fullUser = await api.getEmployeeById(savedId);
            setCurrentUser(fullUser);
          } catch (e) {
            localStorage.removeItem('dayflow_user_id');
            setCurrentUser(null);
          }
        } else {
          // If first visit, start logged in as Ananya Deshmukh (Admin) or let them view sign in
          const defaultUser = await api.getEmployeeById('EMP-1001').catch(() => null);
          if (defaultUser) {
            setCurrentUser(defaultUser);
            localStorage.setItem('dayflow_user_id', defaultUser.id);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = async (emailOrId: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(emailOrId, password);
      setCurrentUser(res.user);
      localStorage.setItem('dayflow_user_id', res.user.id);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<Employee> & { baseSalary?: number; password?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setCurrentUser(res.user);
      localStorage.setItem('dayflow_user_id', res.user.id);
      // Refresh demo users
      const users = await api.getDemoUsers();
      setDemoUsers(users);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (employeeId: string) => {
    setIsLoading(true);
    try {
      const user = await api.getEmployeeById(employeeId);
      setCurrentUser(user);
      localStorage.setItem('dayflow_user_id', user.id);
    } catch (err) {
      console.error('Failed to switch user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentUserState = (updated: Employee) => {
    setCurrentUser(updated);
  };

  const refreshUser = async () => {
    if (!currentUser) return;
    try {
      const refreshed = await api.getEmployeeById(currentUser.id);
      setCurrentUser(refreshed);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('dayflow_user_id');
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role || 'employee';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAdmin,
        demoUsers,
        isLoading,
        login,
        register,
        switchUser,
        updateCurrentUserState,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
