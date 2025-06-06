// services/userService.ts
import { API_URL } from '@/constants/api';
import { User, CreateUserRequest, UpdateUserRequest, Role, DocumentType, UserType } from '../types';

const API_BASE_URL = API_URL;

export const UserService = {
  // Obtener todos los usuarios
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Agregar headers de autenticación si es necesario
        // 'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
    const data  = await response.json();
    console.log(data)
    return data.data.users;
  },

  // Obtener usuarios filtrados por tipo
  getUsersByType: async (type: UserType): Promise<User[]> => {
    let url = `${API_BASE_URL}/users`;
    
    switch (type) {
      case UserType.INTERNAL:
        url += '?is_internal=true';
        break;
      case UserType.EXTERNAL:
        url += '?is_internal=false';
        break;
      case UserType.ACTIVE:
        url += '?is_active=true';
        break;
      case UserType.INACTIVE:
        url += '?is_active=false';
        break;
      default:
        // ALL - no filter
        break;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    return response.json();
  },

  // Obtener un usuario por ID
  getUserById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    return response.json();
  },

  // Crear un nuevo usuario
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error creating user: ${response.statusText}`);
    }

    return response.json();
  },

  // Actualizar un usuario existente
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error updating user: ${response.statusText}`);
    }

    return response.json();
  },

  // Eliminar un usuario
  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error deleting user: ${response.statusText}`);
    }
  },

  // Cambiar estado de un usuario (activar/desactivar)
  toggleUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error updating user status: ${response.statusText}`);
    }

    return response.json();
  },

  // Obtener todos los roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching roles: ${response.statusText}`);
    }

    return response.json();
  },

  // Obtener todos los tipos de documento
  getAllDocumentTypes: async (): Promise<DocumentType[]> => {
    const response = await fetch(`${API_BASE_URL}/document-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching document types: ${response.statusText}`);
    }

    return response.json();
  },

  // Resetear contraseña de usuario
  resetUserPassword: async (id: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error resetting password: ${response.statusText}`);
    }
  },
};