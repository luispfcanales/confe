// src/components/auth/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthAction, LoginCredentials, UserRole } from '@/types/auth';
import { AuthService } from '@/utils/authService';

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hardReset: () => void; // Nueva función para reset completo
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initAuth = () => {
      try {
        const { user } = AuthService.getAuthData();
        if (user && user.is_active && AuthService.isAuthenticated()) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          console.log('🔍 Invalid or missing auth data, clearing...');
          AuthService.clearAuthData();
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        AuthService.clearAuthData();
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();

    // Listener para cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue === null) {
        console.log('🔄 Storage change detected: user removed');
        dispatch({ type: 'LOGOUT' });
      }
    };

    // Verificación periódica de consistencia (cada 5 segundos)
    const consistencyCheck = setInterval(() => {
      const isAuthenticatedContext = state.isAuthenticated;
      const isAuthenticatedService = AuthService.isAuthenticated();
      
      if (isAuthenticatedContext !== isAuthenticatedService) {
        console.warn('🚨 Inconsistency detected between context and service');
        console.log('Context says:', isAuthenticatedContext);
        console.log('Service says:', isAuthenticatedService);
        
        if (!isAuthenticatedService) {
          console.log('🔄 Auto-correcting: logging out');
          dispatch({ type: 'LOGOUT' });
          AuthService.clearAuthData();
        }
      }
    }, 5000);

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(consistencyCheck);
    };
  }, [state.isAuthenticated]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await AuthService.login(credentials);
      
      if (response.success && response.data.user) {
        AuthService.saveAuthData(response.data.user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        throw new Error(response.message || 'Error en la autenticación');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Starting logout process...');
      
      // Paso 1: Dispatch LOGOUT inmediatamente
      dispatch({ type: 'LOGOUT' });
      
      // Paso 2: Limpiar localStorage de forma agresiva
      AuthService.clearAuthData();
      
      // Paso 3: Verificar que el estado se actualizó
      console.log('🔍 Verifying state after logout...');
      
      // Paso 4: Intentar llamar al backend (opcional)
      // try {
      //   const token = localStorage.getItem('authToken');
      //   if (token) {
      //     await fetch('http://localhost:3000/api/auth/logout', {
      //       method: 'POST',
      //       headers: {
      //         'Authorization': `Bearer ${token}`,
      //         'Content-Type': 'application/json',
      //       },
      //     });
      //   }
      // } catch (backendError) {
      //   console.warn('Backend logout failed (not critical):', backendError);
      // }
      
      // Paso 5: Verificación final y redirección
      setTimeout(() => {
        // Force reset si aún hay datos
        const stillHasData = localStorage.getItem('user') || 
                            localStorage.getItem('userRole') || 
                            localStorage.getItem('authToken');
        
        if (stillHasData) {
          console.error('🚨 Data still present, forcing complete reset');
          hardReset();
        }
        
        console.log('🔄 Redirecting to login...');
        window.location.href = '/login';
      }, 300);
      
    } catch (error) {
      console.error('❌ Error during logout:', error);
      hardReset();
    }
  };

  const hardReset = (): void => {
    console.log('🔄 HARD RESET: Clearing everything...');
    
    // Limpiar localStorage completamente
    localStorage.clear();
    sessionStorage.clear();
    
    // Forzar estado de logout
    dispatch({ type: 'LOGOUT' });
    
    // Esperar un tick y verificar
    setTimeout(() => {
      // const currentState = {
      //   user: null,
      //   loading: false,
      //   error: null,
      //   isAuthenticated: false,
      // };
      
      // Force update si es necesario
      dispatch({ type: 'LOGOUT' });
      console.log('✅ Hard reset completed');
    }, 50);
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role.name === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role.name as UserRole) : false;
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    hardReset,
    clearError,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};