import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileImage, 
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/admin/users',
      name: 'Gestión de Usuarios',
      icon: Users
    },
    {
      path: '/admin/posters',
      name: 'Posters Científicos',
      icon: FileImage
    },
    {
      path: '/admin/settings',
      name: 'Configuración',
      icon: Settings
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen flex-col bg-slate-800 text-slate-100 w-72 fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-semibold">Panel Administrativo</h1>
        <p className="text-sm text-slate-400 mt-1">Sistema de Posters Científicos</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
            <Users className="h-5 w-5 text-slate-300" />
          </div>
          <div>
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-slate-400">admin@ejemplo.com</p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;