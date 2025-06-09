// src/components/auth/AuthDebug.tsx - Componente temporal para debugging
import React from 'react';
import { useAuth } from './AuthContext';
import { AuthService } from '@/utils/authService';

export const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, loading, logout, hardReset } = useAuth();

  const handleClearStorage = () => {
    console.log('🔥 EMERGENCY: Clearing ALL localStorage');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const handleForceLogout = async () => {
    try {
      console.log('🔨 FORCE LOGOUT: Starting aggressive logout');
      
      // Paso 1: Limpiar localStorage inmediatamente
      localStorage.clear();
      console.log('✅ LocalStorage cleared');
      
      // Paso 2: Limpiar sessionStorage también
      sessionStorage.clear();
      console.log('✅ SessionStorage cleared');
      
      // Paso 3: Redireccionar inmediatamente
      window.location.href = '/login';
      
    } catch (error) {
      console.error('❌ Force logout error:', error);
      // Si todo falla, recargar la página
      window.location.reload();
    }
  };

  const handleTestLogout = async () => {
    console.log('🧪 TESTING: Normal logout process');
    
    try {
      await logout();
      console.log('✅ Normal logout completed');
    } catch (error) {
      console.error('❌ Normal logout failed:', error);
    }
  };

  const handleShowExactKeys = () => {
    const allKeys = Object.keys(localStorage);
    const authKeys = allKeys.filter(key => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey.includes('user') || 
        lowerKey.includes('auth') || 
        lowerKey.includes('token') ||
        lowerKey.includes('role')
      );
    });
    
    console.log('🔍 EXACT localStorage analysis:');
    console.log('📋 All keys:', allKeys);
    console.log('🎯 Auth-related keys:', authKeys);
    
    authKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`   - ${key}: ${value?.substring(0, 50)}...`);
    });
  };

  const handleHardReset = () => {
    console.log('💥 HARD RESET: Using context hard reset');
    hardReset();
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  const getStorageData = () => {
    const allKeys = Object.keys(localStorage);
    const data: any = {
      allKeys: allKeys,
      authRelatedKeys: allKeys.filter(key => {
        const lowerKey = key.toLowerCase();
        return (
          lowerKey.includes('user') || 
          lowerKey.includes('auth') || 
          lowerKey.includes('token') ||
          lowerKey.includes('role')
        );
      })
    };
    
    // Agregar valores de keys específicas
    ['user', 'userRole', 'userId', 'authToken', 'userid'].forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        data[key] = key === 'user' ? JSON.parse(value) : value;
      }
    });
    
    return data;
  };

  const getAuthKeyCount = () => {
    const allKeys = Object.keys(localStorage);
    return allKeys.filter(key => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey.includes('user') || 
        lowerKey.includes('auth') || 
        lowerKey.includes('token') ||
        lowerKey.includes('role')
      );
    }).length;
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // No mostrar en producción
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="text-sm font-bold mb-2">🐛 Auth Debug</h3>
      
      <div className="text-xs space-y-1 mb-3">
        <div className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
          ✅ Authenticated: {isAuthenticated ? 'YES' : 'NO'}
        </div>
        <div className={loading ? 'text-yellow-400' : 'text-gray-400'}>
          ⏳ Loading: {loading ? 'YES' : 'NO'}
        </div>
        <div>👤 User: {user ? `${user.first_name} ${user.last_name}` : 'None'}</div>
        <div>🎭 Role: {user?.role?.name || 'None'}</div>
        <div className="text-xs text-gray-400 mt-2">
          📦 Auth keys: {getAuthKeyCount()} | All keys: {Object.keys(localStorage).length}
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => console.log('Auth State:', { user, isAuthenticated, loading })}
          className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          📝 Log State
        </button>
        
        <button
          onClick={handleShowExactKeys}
          className="w-full bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded text-xs"
        >
          🔍 Show Exact Keys
        </button>
        
        <button
          onClick={() => console.log('LocalStorage:', getStorageData())}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          💾 Log Storage
        </button>
        
        <button
          onClick={handleTestLogout}
          className="w-full bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded text-xs"
        >
          🧪 Test Normal Logout
        </button>
        
        <button
          onClick={handleHardReset}
          className="w-full bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
        >
          💥 Hard Reset Context
        </button>
        
        <button
          onClick={handleForceLogout}
          className="w-full bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
        >
          🔨 Force Logout
        </button>
        
        <button
          onClick={handleClearStorage}
          className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          🔥 Nuclear Option
        </button>
      </div>
    </div>
  );
};