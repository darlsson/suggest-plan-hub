
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminNavbar() {
  const location = useLocation();

  const navItems = [
    { 
      name: 'Main Dashboard', 
      href: '/admin', 
      icon: LayoutDashboard,
      isActive: location.pathname === '/admin'
    },
    { 
      name: 'Suggestion Panel', 
      href: '/admin/suggestions', 
      icon: Lightbulb,
      isActive: location.pathname === '/admin/suggestions'
    },
    { 
      name: 'Roadmap Panel', 
      href: '/admin/roadmap', 
      icon: MapPin,
      isActive: location.pathname === '/admin/roadmap'
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      icon: Users,
      isActive: location.pathname === '/admin/users'
    },
  ];

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-700">
      <div className="container mx-auto px-6">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-4 text-sm font-medium transition-colors border-b-2',
                item.isActive
                  ? 'text-white border-blue-500 bg-gray-800'
                  : 'text-gray-300 border-transparent hover:text-white hover:border-gray-600'
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
