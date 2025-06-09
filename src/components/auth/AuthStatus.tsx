// src/components/auth/AuthStatus.tsx - Actualizado para el nuevo sistema
import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { roleUtils } from '@/utils/roleUtils';

interface AuthStatusProps {
  showFullProfile?: boolean;
  className?: string;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({ 
  showFullProfile = true, 
  className = "" 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Cargando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  if (showFullProfile) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <UserProfile />
      </div>
    );
  }

  // Versión simplificada para espacios reducidos
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {user?.first_name} {user?.last_name}
        </p>
        <p className="text-xs text-gray-600">
          {user && roleUtils.getDisplayName(user.role.name as any)}
        </p>
      </div>
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
        {user?.first_name.charAt(0)}{user?.last_name.charAt(0)}
      </div>
    </div>
  );
};

// Componente específico para la barra de navegación
export const NavAuthStatus: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          to="/login"
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Enlaces rápidos según el rol */}
      {user && (
        <div className="hidden md:flex items-center space-x-2 text-sm">
          {roleUtils.hasAdminAccess(user.role.name as any) && (
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded transition-colors"
            >
              Admin
            </Link>
          )}
          {roleUtils.hasReviewerAccess(user.role.name as any) && (
            <Link
              to="/reviewer/dashboard"
              className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded transition-colors"
            >
              Revisor
            </Link>
          )}
          {roleUtils.hasInvestigatorAccess(user.role.name as any) && (
            <Link
              to="/investigator"
              className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded transition-colors"
            >
              Mi Área
            </Link>
          )}
        </div>
      )}
      <UserProfile />
    </div>
  );
};