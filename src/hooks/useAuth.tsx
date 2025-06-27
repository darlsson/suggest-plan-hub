
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUserView: (userId: string) => void;
  originalUser: User | null;
  isViewingAsUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2', 
    email: 'employee@company.com',
    name: 'John Employee',
    role: 'employee',
    createdAt: '2024-01-02T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'jane@company.com',
    name: 'Jane Smith',
    role: 'employee', 
    createdAt: '2024-01-03T00:00:00Z',
    lastLogin: new Date().toISOString(),
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [isViewingAsUser, setIsViewingAsUser] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    const savedOriginalUser = localStorage.getItem('originalUser');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      if (savedOriginalUser) {
        setOriginalUser(JSON.parse(savedOriginalUser));
        setIsViewingAsUser(true);
      }
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password') {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      setAuth({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setOriginalUser(null);
    setIsViewingAsUser(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('originalUser');
  };

  const switchUserView = (userId: string) => {
    if (!auth.user || auth.user.role !== 'admin') return;
    
    const targetUser = mockUsers.find(u => u.id === userId);
    if (!targetUser) return;

    if (!originalUser) {
      setOriginalUser(auth.user);
      localStorage.setItem('originalUser', JSON.stringify(auth.user));
    }

    setAuth(prev => ({
      ...prev,
      user: targetUser,
    }));
    setIsViewingAsUser(true);
    localStorage.setItem('currentUser', JSON.stringify(targetUser));
  };

  return (
    <AuthContext.Provider value={{
      auth,
      login,
      logout,
      switchUserView,
      originalUser,
      isViewingAsUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
