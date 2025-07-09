
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, MapPin, Users, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function AdminNavbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { 
      name: 'Main Dashboard', 
      href: '/admin', 
      icon: LayoutDashboard,
      isActive: location.pathname === '/admin'
    },
    { 
      name: 'Roadmap Panel', 
      href: '/admin/roadmap', 
      icon: MapPin,
      isActive: location.pathname === '/admin/roadmap'
    },
    { 
      name: 'Suggestion Panel', 
      href: '/admin/suggestions', 
      icon: Lightbulb,
      isActive: location.pathname === '/admin/suggestions'
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      icon: Users,
      isActive: location.pathname === '/admin/users'
    },
  ];

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-700">
      <div className="container mx-auto px-6">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden py-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                <Menu className="h-5 w-5" />
                <span className="ml-2">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Admin Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                      item.isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
