// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { useLoginRedirect } from '@/hooks/useAuthRedirect';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const { login, loading, error, clearError } = useAuth();
  const { isAuthenticated } = useLoginRedirect();

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    try {
      await login(credentials);
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      // El error ya se maneja en el contexto y se muestra via useEffect
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Si ya está autenticado, el hook useLoginRedirect manejará la redirección
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            CONFERICIS
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Investigacion e Innovacion
          </p>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            Iniciar Sesión
          </h3>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su correo electrónico"
                value={credentials.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su contraseña"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-500 text-sm transition-colors"
            >
              ← Volver al inicio
            </Link>
            <Link
              to="/user-registration"
              className="text-blue-600 hover:text-blue-500 text-sm transition-colors"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>

        {/* Información de prueba (remover en producción) */}
      </div>
    </div>
  );
};

export default Login;