
import { User } from '@/types';

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isEmployee = (user: User | null): boolean => {
  return user?.role === 'employee';
};

export const canAccessAdminRoutes = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canAccessEmployeeRoutes = (user: User | null): boolean => {
  return user !== null;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
