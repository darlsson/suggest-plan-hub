
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'bug' | 'other';
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  votes: number;
  adminNotes?: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  quarter: string;
  estimatedCompletion?: string;
  assignedTo?: string;
  relatedSuggestions: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppContextType {
  auth: AuthState;
  suggestions: Suggestion[];
  roadmapItems: RoadmapItem[];
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
