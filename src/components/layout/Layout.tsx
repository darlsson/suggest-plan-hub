
import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';
import { EmployeeNavbar } from './EmployeeNavbar';
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdminRoutes } from '@/utils/auth';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { auth } = useAuth();
  const isAdmin = canAccessAdminRoutes(auth.user);

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-gray-50 flex-col">
        <Header title={title} />
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="w-full h-full px-6 py-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      <Header title={title} />
      <EmployeeNavbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="w-full h-full px-6 py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
