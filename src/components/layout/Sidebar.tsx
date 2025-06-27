
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccessAdminRoutes } from '@/utils/auth';
import { Home, Users, Settings, Plus, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.user) return null;

  const isAdmin = canAccessAdminRoutes(auth.user);

  const employeeNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Suggestions', href: '/my-suggestions', icon: FileText },
    { name: 'Roadmap', href: '/roadmap', icon: Plus },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin', icon: Home },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Suggestions', href: '/admin/suggestions', icon: FileText },
    { name: 'Roadmap Management', href: '/admin/roadmap', icon: Plus },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold">Roadmap Hub</h2>
        <p className="text-gray-400 text-sm mt-1">
          {isAdmin ? 'Admin Panel' : 'Employee Portal'}
        </p>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
