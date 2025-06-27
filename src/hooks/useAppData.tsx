
import { createContext, useContext, useState, ReactNode } from 'react';
import { Suggestion, RoadmapItem, User } from '@/types';
import { useAuth } from './useAuth';

interface AppDataContextType {
  suggestions: Suggestion[];
  roadmapItems: RoadmapItem[];
  users: User[];
  createSuggestion: (suggestion: Omit<Suggestion, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt' | 'votes'>) => void;
  updateSuggestion: (id: string, updates: Partial<Suggestion>) => void;
  deleteSuggestion: (id: string) => void;
  createRoadmapItem: (item: Omit<RoadmapItem, 'id' | 'createdAt'>) => void;
  updateRoadmapItem: (id: string, updates: Partial<RoadmapItem>) => void;
  deleteRoadmapItem: (id: string) => void;
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Mock data
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Dark Mode Support',
    description: 'Add dark mode toggle to improve user experience during night time usage.',
    category: 'feature',
    status: 'approved',
    priority: 'medium',
    authorId: '2',
    authorName: 'John Employee',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    votes: 12,
    adminNotes: 'Great idea, will implement in Q2'
  },
  {
    id: '2',
    title: 'Mobile App Version',
    description: 'Create a mobile application for better accessibility on phones and tablets.',
    category: 'feature',
    status: 'pending',
    priority: 'high',
    authorId: '3',
    authorName: 'Jane Smith',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    votes: 25
  }
];

const mockRoadmapItems: RoadmapItem[] = [
  {
    id: '1',
    title: 'User Authentication System',
    description: 'Implement secure user authentication with role-based access control.',
    status: 'completed',
    priority: 'high',
    quarter: 'Q1 2024',
    estimatedCompletion: '2024-03-31',
    assignedTo: 'Development Team',
    relatedSuggestions: [],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Dark Mode Implementation',
    description: 'Add dark mode support across the entire application.',
    status: 'in-progress',
    priority: 'medium',
    quarter: 'Q2 2024',
    estimatedCompletion: '2024-06-30',
    assignedTo: 'UI/UX Team',
    relatedSuggestions: ['1'],
    createdAt: '2024-02-01T00:00:00Z'
  }
];

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

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(mockRoadmapItems);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const createSuggestion = (newSuggestion: Omit<Suggestion, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt' | 'votes'>) => {
    if (!auth.user) return;
    
    const suggestion: Suggestion = {
      ...newSuggestion,
      id: Date.now().toString(),
      authorId: auth.user.id,
      authorName: auth.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: 0
    };
    
    setSuggestions(prev => [suggestion, ...prev]);
  };

  const updateSuggestion = (id: string, updates: Partial<Suggestion>) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    ));
  };

  const deleteSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const createRoadmapItem = (newItem: Omit<RoadmapItem, 'id' | 'createdAt'>) => {
    const item: RoadmapItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setRoadmapItems(prev => [item, ...prev]);
  };

  const updateRoadmapItem = (id: string, updates: Partial<RoadmapItem>) => {
    setRoadmapItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteRoadmapItem = (id: string) => {
    setRoadmapItems(prev => prev.filter(item => item.id !== id));
  };

  const createUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [user, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user =>
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <AppDataContext.Provider value={{
      suggestions,
      roadmapItems,
      users,
      createSuggestion,
      updateSuggestion,
      deleteSuggestion,
      createRoadmapItem,
      updateRoadmapItem,
      deleteRoadmapItem,
      createUser,
      updateUser,
      deleteUser,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
