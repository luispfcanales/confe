// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, hasAnyRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Componente para proteger contenido específico dentro de una página
interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  fallback = null
}) => {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(requiredRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};