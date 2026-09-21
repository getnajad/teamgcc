import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X, Home, Users, Briefcase, User as UserIcon } from 'lucide-react';

export const Layout: React.FC = () => {
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const memberLinks = [
    { name: 'Dashboard', path: '/member/dashboard', icon: Home },
    { name: 'Profile', path: '/member/profile', icon: UserIcon },
    { name: 'Jobs', path: '/member/jobs', icon: Briefcase },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
  ];

  const links = role === 'admin' || role === 'super_admin' ? adminLinks : memberLinks;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <span className="text-lg font-bold text-primary">TEAM GCC</span>
          <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="px-4 py-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 mt-4 px-2">Menu</p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.email}
            </span>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
