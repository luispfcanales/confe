// src/layouts/InvestigatorLayout.tsx
import { Outlet } from 'react-router-dom';
import InvestigatorSidebar from './InvestigatorSidebar';
import { useAuth } from '@/components/auth/AuthContext';

const InvestigatorLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Verificar que el usuario tenga rol de investigador
  if (!user || user.role.name !== 'investigador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InvestigatorSidebar />
      <main className="ml-72">
        <Outlet />
      </main>
    </div>
  );
};

export default InvestigatorLayout;