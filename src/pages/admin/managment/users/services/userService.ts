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
    const data = await response.json();
    console.log('Raw API response for users:', data);
    
    // Normalizar los datos de usuarios para asegurar tipos consistentes
    const users = (data.data?.users || data.users || data).map((user: any) => ({
      ...user,
      role_id: user.role_id?.toString() || user.role_id,
      document_type_id: user.document_type_id?.toString() || user.document_type_id,
      researcher_type_id: user.researcher_type_id?.toString() || user.researcher_type_id,
      academic_grade_id: user.academic_grade_id?.toString() || user.academic_grade_id,
      participation_type_id: user.participation_type_id?.toString() || user.participation_type_id,
      faculty_id: user.faculty_id?.toString() || user.faculty_id,
      academic_department_id: user.academic_department_id?.toString() || user.academic_department_id,
    }));
    
    console.log('Normalized users:', users);
    return users;
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

    const data = await response.json();
    
    // Normalizar los datos
    return (data.data?.users || data.users || data).map((user: any) => ({
      ...user,
      role_id: user.role_id?.toString() || user.role_id,
      document_type_id: user.document_type_id?.toString() || user.document_type_id,
      researcher_type_id: user.researcher_type_id?.toString() || user.researcher_type_id,
      academic_grade_id: user.academic_grade_id?.toString() || user.academic_grade_id,
      participation_type_id: user.participation_type_id?.toString() || user.participation_type_id,
      faculty_id: user.faculty_id?.toString() || user.faculty_id,
      academic_department_id: user.academic_department_id?.toString() || user.academic_department_id,
    }));
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

    const user = await response.json();
    
    // Normalizar el usuario
    return {
      ...user,
      role_id: user.role_id?.toString() || user.role_id,
      document_type_id: user.document_type_id?.toString() || user.document_type_id,
      researcher_type_id: user.researcher_type_id?.toString() || user.researcher_type_id,
      academic_grade_id: user.academic_grade_id?.toString() || user.academic_grade_id,
      participation_type_id: user.participation_type_id?.toString() || user.participation_type_id,
      faculty_id: user.faculty_id?.toString() || user.faculty_id,
      academic_department_id: user.academic_department_id?.toString() || user.academic_department_id,
    };
  },

  // Crear un nuevo usuario
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    console.log('Creating user with data:', userData);
    
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

    const user = await response.json();
    
    // Normalizar el usuario creado
    return {
      ...user,
      role_id: user.role_id?.toString() || user.role_id,
      document_type_id: user.document_type_id?.toString() || user.document_type_id,
      researcher_type_id: user.researcher_type_id?.toString() || user.researcher_type_id,
      academic_grade_id: user.academic_grade_id?.toString() || user.academic_grade_id,
      participation_type_id: user.participation_type_id?.toString() || user.participation_type_id,
      faculty_id: user.faculty_id?.toString() || user.faculty_id,
      academic_department_id: user.academic_department_id?.toString() || user.academic_department_id,
    };
  },

  // Actualizar un usuario existente
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    console.log('Updating user with data:', userData);
    
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

    const user = await response.json();
    
    // Normalizar el usuario actualizado
    return {
      ...user,
      role_id: user.role_id?.toString() || user.role_id,
      document_type_id: user.document_type_id?.toString() || user.document_type_id,
      researcher_type_id: user.researcher_type_id?.toString() || user.researcher_type_id,
      academic_grade_id: user.academic_grade_id?.toString() || user.academic_grade_id,
      participation_type_id: user.participation_type_id?.toString() || user.participation_type_id,
      faculty_id: user.faculty_id?.toString() || user.faculty_id,
      academic_department_id: user.academic_department_id?.toString() || user.academic_department_id,
    };
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

    const user = await response.json();
    
    // Normalizar el usuario
    return {
      ...user,
      role_id: user.role_id?.toString() || user.role_id,
      document_type_id: user.document_type_id?.toString() || user.document_type_id,
      researcher_type_id: user.researcher_type_id?.toString() || user.researcher_type_id,
      academic_grade_id: user.academic_grade_id?.toString() || user.academic_grade_id,
      participation_type_id: user.participation_type_id?.toString() || user.participation_type_id,
      faculty_id: user.faculty_id?.toString() || user.faculty_id,
      academic_department_id: user.academic_department_id?.toString() || user.academic_department_id,
    };
  },

  // Obtener todos los roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching roles: ${response.statusText}`);
    }

    const res = await response.json();
    console.log('Raw roles response:', res);
    
    const roles = (res.data || res).map((role: any) => ({
      ...role,
      ID: role.ID?.toString() || role.ID
    }));
    
    console.log('Normalized roles:', roles);
    return roles;
  },

  // Obtener todos los tipos de documento
  getAllDocumentTypes: async (): Promise<DocumentType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/document-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching document types: ${response.statusText}`);
    }

    const res = await response.json();
    console.log('Raw document types response:', res);
    
    const documentTypes = (res.data || res).map((docType: any) => ({
      ...docType,
      ID: docType.ID?.toString() || docType.ID
    }));
    
    console.log('Normalized document types:', documentTypes);
    return documentTypes;
  },

  // === APIs adicionales para investigadores ===
  
  // Obtener todos los tipos de investigador
  getAllInvestigatorTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/api/investigator-types/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching investigator types: ${response.statusText}`);
    }

    const res = await response.json();
    console.log('Raw investigator types response:', res);
    const data = res.data || res;
    
    // Verificar si usa estructura key/value o ID/name
    const firstItem = data[0];
    if (firstItem && 'key' in firstItem && 'value' in firstItem) {
      // Estructura key/value
      return data.map((item: any) => ({
        ID: item.key?.toString(),
        name: item.value,
        description: item.description,
        status: item.status
      }));
    } else {
      // Estructura ID/name
      return data.map((item: any) => ({
        ID: item.ID?.toString() || item.id?.toString(),
        name: item.name || item.description,
        description: item.description,
        status: item.status
      }));
    }
  },

  // Obtener todos los grados académicos
  getAllAcademicGrades: async () => {
    const response = await fetch(`${API_BASE_URL}/api/academic-grades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching academic grades: ${response.statusText}`);
    }

    const res = await response.json();
    console.log('Raw academic grades response:', res);
    const data = res.data || res;
    
    // Verificar si usa estructura key/value o ID/name
    const firstItem = data[0];
    if (firstItem && 'key' in firstItem && 'value' in firstItem) {
      // Estructura key/value
      return data.map((item: any) => ({
        ID: item.key?.toString(),
        name: item.value,
        description: item.description,
        status: item.status
      }));
    } else {
      // Estructura ID/name
      return data.map((item: any) => ({
        ID: item.ID?.toString() || item.id?.toString(),
        name: item.name || item.description,
        description: item.description,
        status: item.status
      }));
    }
  },

  // Obtener todos los tipos de participación
  getAllParticipationTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/api/general/participation-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching participation types: ${response.statusText}`);
    }

    const res = await response.json();
    console.log('Raw participation types response:', res);
    const data = res.data || res;
    
    // Manejar estructura con key/value específicamente para participation types
    return data.map((item: any) => ({
      ID: item.key?.toString() || item.ID?.toString() || item.id?.toString(),
      name: item.value || item.name || item.description,
      description: item.description,
      status: item.status
    }));
  },

  // Obtener todas las facultades
  getAllFaculties: async () => {
    const response = await fetch(`${API_BASE_URL}/api/faculties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching faculties: ${response.statusText}`);
    }

    const res = await response.json();
    console.log('Raw faculties response:', res);
    const data = res.data || res;
    
    // Manejar estructura con ID/name para facultades
    return data.map((item: any) => ({
      ID: item.ID?.toString() || item.id?.toString(),
      name: item.name || item.description,
      description: item.description,
      status: item.status,
      // Si hay departamentos anidados, también normalizarlos
      academic_department: item.academic_department ? item.academic_department.map((dept: any) => ({
        ID: dept.ID?.toString() || dept.id?.toString(),
        name: dept.name || dept.description,
        faculty_id: dept.faculty_id?.toString() || dept.facultyId?.toString() || item.ID?.toString(),
        description: dept.description,
        status: dept.status
      })) : []
    }));
  },

  // Obtener todos los departamentos académicos
  getAllAcademicDepartments: async () => {
    const response = await fetch(`${API_BASE_URL}/api/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching academic departments: ${response.statusText}`);
    }

    const res = await response.json();
    console.log('Raw academic departments response:', res);
    const data = res.data || res;
    
    // Manejar estructura con ID/name para departamentos
    return data.map((item: any) => ({
      ID: item.ID?.toString() || item.id?.toString(),
      name: item.name || item.description,
      faculty_id: item.faculty_id?.toString() || item.facultyId?.toString(),
      description: item.description,
      status: item.status
    }));
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