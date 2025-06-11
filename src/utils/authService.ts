// src/utils/authService.ts
import { AuthResponse, LoginCredentials, User, UserRole } from '@/types/auth';
import { API_URL } from '@/constants/api';
const API_BASE_URL = API_URL;

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la autenticación');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      // Si tienes un endpoint de logout en el backend
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continuar con la limpieza aunque falle el backend
    } finally {
      // Limpiar datos locales independientemente del resultado
      this.clearAuthData();
      console.log('Auth data cleared from localStorage');
    }
  }

  static saveAuthData(user: User, token?: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', user.role.name);
    localStorage.setItem('userId', user.ID);
    if (token) {
      localStorage.setItem('authToken', token);
    }
  }

  static getAuthData(): { user: User | null; token: string | null } {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      const user = userStr ? JSON.parse(userStr) : null;
      return { user, token };
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return { user: null, token: null };
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static clearAuthData(): void {
    console.log('Clearing auth data...');
    
    // Lista de todas las claves relacionadas con autenticación
    const authKeys = ['user', 'userRole', 'userId', 'authToken'];
    
    authKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Removed ${key} from localStorage`);
      }
    });
    
    // Verificar que se limpiaron correctamente
    const remainingAuthData = authKeys.filter(key => localStorage.getItem(key) !== null);
    if (remainingAuthData.length > 0) {
      console.warn('Some auth data was not cleared:', remainingAuthData);
    } else {
      console.log('All auth data cleared successfully');
    }
  }

  static isAuthenticated(): boolean {
    const { user } = this.getAuthData();
    return user !== null && user.is_active;
  }

  static hasRole(requiredRole: UserRole): boolean {
    const { user } = this.getAuthData();
    return user?.role.name === requiredRole;
  }

  static hasAnyRole(roles: UserRole[]): boolean {
    const { user } = this.getAuthData();
    return user ? roles.includes(user.role.name as UserRole) : false;
  }

  // Método para hacer fetch con autenticación automática
  static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (defaultHeaders as any).Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (response.status === 401) {
      this.clearAuthData();
      window.location.href = '/login';
    }

    return response;
  }
}