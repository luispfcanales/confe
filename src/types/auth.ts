// src/types/auth.ts
export interface User {
    ID: string;
    role_id: string;
    document_type_id: string;
    investigator_id: string;
    first_name: string;
    last_name: string;
    identity_document: string;
    address: string;
    email: string;
    sex: number;
    is_active: boolean;
    is_internal: boolean;
    created_at: string;
    updated_at: string;
    role: {
      ID: string;
      name: string;
      description: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    };
  }
  
  export interface AuthResponse {
    data: {
      user: User;
    };
    message: string;
    success: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export type UserRole = 'ADMINISTRADOR' | 'REVISOR_POSTERS' | 'INVESTIGADOR';
  
  export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  }
  
  export type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_ERROR'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_LOADING'; payload: boolean };