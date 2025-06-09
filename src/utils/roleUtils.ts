// src/utils/roleUtils.ts - Actualizado con funciones de autenticación
import { UserRole } from '@/types/auth';

export const roleUtils = {
  getDisplayName: (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      'ADMINISTRADOR': 'Administrador',
      'REVISOR_POSTERS': 'Revisor de Posters',
      'INVESTIGADOR': 'Investigador'
    };
    return roleNames[role] || role;
  },

  getHomeRoute: (role: UserRole): string => {
    const routes: Record<UserRole, string> = {
      'ADMINISTRADOR': '/admin/dashboard',
      'REVISOR_POSTERS': '/reviewer/dashboard',
      'INVESTIGADOR': '/investigator'
    };
    return routes[role] || '/';
  },

  canAccess: (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(userRole);
  },

  hasAdminAccess: (role: UserRole): boolean => {
    return role === 'ADMINISTRADOR';
  },

  hasReviewerAccess: (role: UserRole): boolean => {
    return role === 'ADMINISTRADOR' || role === 'REVISOR_POSTERS';
  },

  hasInvestigatorAccess: (role: UserRole): boolean => {
    return role === 'INVESTIGADOR';
  },

  getRoleBadgeColor: (roleName: string): string => {
    switch (roleName) {
      case 'ADMINISTRADOR':
        return 'bg-red-100 text-red-800';
      case 'REVISOR_POSTERS':
        return 'bg-blue-100 text-blue-800';
      case 'INVESTIGADOR':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  getPermissions: (role: UserRole): string[] => {
    const permissions: Record<UserRole, string[]> = {
      'ADMINISTRADOR': [
        'manage_users',
        'manage_roles', 
        'manage_system',
        'manage_events',
        'review_posters',
        'view_analytics'
      ],
      'REVISOR_POSTERS': [
        'review_posters',
        'view_posters',
        'comment_posters'
      ],
      'INVESTIGADOR': [
        'submit_posters',
        'view_own_posters',
        'edit_profile'
      ]
    };
    return permissions[role] || [];
  },

  hasPermission: (userRole: UserRole, permission: string): boolean => {
    const userPermissions = roleUtils.getPermissions(userRole);
    return userPermissions.includes(permission);
  }
};