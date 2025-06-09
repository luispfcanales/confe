// src/components/auth/UserProfile.tsx - Actualizado para el nuevo sistema
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { roleUtils } from '@/utils/roleUtils';
import { toast } from 'sonner';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      console.log('User clicked logout');
      setIsDropdownOpen(false); // Cerrar dropdown inmediatamente
      
      const loadingToast = toast.loading('Cerrando sesión...');
      
      await logout();
      
      toast.success('Sesión cerrada exitosamente');
      toast.dismiss(loadingToast);
      
    } catch (error) {
      console.error('Error in handleLogout:', error);
      toast.error('Error al cerrar sesión');
      
      // Forzar limpieza manual si hay error
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  // Cerrar dropdown cuando se hace click fuera
  React.useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </p>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${roleUtils.getRoleBadgeColor(user.role.name)}`}>
            {roleUtils.getDisplayName(user.role.name as any)}
          </span>
        </div>
        <svg 
          className="w-4 h-4 text-gray-600 transition-transform"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${roleUtils.getRoleBadgeColor(user.role.name)}`}>
                  {roleUtils.getDisplayName(user.role.name as any)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                Información Personal
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Documento:</span>
                  <span className="font-medium">{user.identity_document}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">
                    {user.is_internal ? 'Interno' : 'Externo'}
                  </span>
                </div>
              </div>
            </div>
            
            <hr className="my-2" />
            
            {/* Permisos del usuario */}
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                Permisos
              </p>
              <div className="flex flex-wrap gap-1">
                {roleUtils.getPermissions(user.role.name as any).map((permission) => (
                  <span 
                    key={permission}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {permission.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            
            <hr className="my-2" />
            
            <button
            //   onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};