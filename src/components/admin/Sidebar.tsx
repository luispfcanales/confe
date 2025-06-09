import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileImage, 
  LogOut,
  Settings,
  Shield,
  MonitorCog,
  Microscope,
  GraduationCap,
  IdCard,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthContext'; // ✅ Importar el contexto

const Sidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, logout } = useAuth(); // ✅ Usar el contexto

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/admin/system',
      name: 'Gestión del Sistema',
      icon: MonitorCog,
      submenu: [
        {
          path: '/admin/system/roles',
          name: 'Roles del sistema',
          icon: Shield
        },
        {
          path: '/admin/system/investigator-types',
          name: 'Tipos de investigadores',
          icon: Microscope
        },
        {
          path: '/admin/system/academic-grades',
          name: 'Grados academicos',
          icon: GraduationCap
        },
        {
          path: '/admin/system/document-types',
          name: 'Documentos identidad',
          icon: IdCard
        },
        {
          path: '/admin/system/users',
          name: 'Usuarios',
          icon: Users
        },
      ]
    },
    {
      path: '/admin/scientific-events',
      name: 'Eventos',
      icon: CalendarDays
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

  // ✅ Función corregida que usa el contexto
  const handleLogout = async () => {
    try {
      console.log('🚪 Sidebar logout initiated');
      await logout(); // Usar la función del contexto
    } catch (error) {
      console.error('❌ Sidebar logout error:', error);
      // Fallback
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
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
            const isSubmenuActive = item.submenu?.some(subitem => location.pathname === subitem.path);
            const isOpen = openSubmenu === item.path;
            
            return (
              <li key={item.path}>
                {item.submenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive || isSubmenuActive
                        ? 'bg-slate-700 text-white' 
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium flex-1 text-left">{item.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
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
                )}
                {/* Submenu */}
                {item.submenu && isOpen && (
                  <ul className="ml-9 mt-2 space-y-1">
                    {item.submenu.map((subitem) => (
                      <li key={subitem.path}>
                        <Link
                          to={subitem.path}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                            location.pathname === subitem.path
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                          }`}
                        >
                          {subitem.icon && <subitem.icon className="h-4 w-4" />}
                          {subitem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
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
            {/* ✅ Mostrar datos reales del usuario */}
            <p className="text-sm font-medium">
              {user ? `${user.first_name} ${user.last_name}` : 'Usuario'}
            </p>
            <p className="text-xs text-slate-400">
              {user?.email || 'email@ejemplo.com'}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role?.name || 'Rol'}
            </p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleLogout} // ✅ Usar la función corregida
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;