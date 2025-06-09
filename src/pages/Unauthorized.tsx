// src/pages/Unauthorized.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { roleUtils } from '@/utils/roleUtils';

const Unauthorized: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-6">
        <div className="mb-8">
          {/* Icono de prohibido */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" 
              />
            </svg>
          </div>
          
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Acceso No Autorizado
          </h2>
          <p className="text-gray-600 mb-4">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          
          {user && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Usuario:</span> {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Rol actual:</span>{' '}
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800">
                  {roleUtils.getDisplayName(user.role.name as any)}
                </span>
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ir al Inicio
          </Link>
          
          {user && (
            <Link
              to={roleUtils.getHomeRoute(user.role.name as any)}
              className="inline-block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Ir a Mi Panel
            </Link>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;