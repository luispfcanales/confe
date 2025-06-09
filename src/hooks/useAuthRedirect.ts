// src/hooks/useAuthRedirect.ts - Actualizado para el nuevo sistema
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/types/auth';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requiredRoles?: UserRole[];
  redirectOnSuccess?: string;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const { 
    redirectTo = '/login', 
    requiredRoles = [], 
    redirectOnSuccess 
  } = options;

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate(redirectTo);
      return;
    }

    if (requiredRoles.length > 0 && user) {
      const hasRequiredRole = requiredRoles.includes(user.role.name as UserRole);
      if (!hasRequiredRole) {
        navigate('/unauthorized');
        return;
      }
    }

    // Si el usuario está autenticado y tiene los roles necesarios,
    // redirigir a la página de éxito si se especifica
    if (redirectOnSuccess && isAuthenticated) {
      navigate(redirectOnSuccess);
    }
  }, [isAuthenticated, user, loading, navigate, redirectTo, requiredRoles, redirectOnSuccess]);

  return { 
    isAuthenticated, 
    user, 
    loading,
    hasAccess: user && requiredRoles.length > 0 
      ? requiredRoles.includes(user.role.name as UserRole)
      : true
  };
};

// Hook específico para redirección después del login
export const useLoginRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role.name as UserRole;
      switch (role) {
        case 'ADMINISTRADOR':
          navigate('/admin/dashboard');
          break;
        case 'REVISOR_POSTERS':
          navigate('/reviewer/dashboard');
          break;
        case 'INVESTIGADOR':
          navigate('/investigator');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return { isAuthenticated, user };
};