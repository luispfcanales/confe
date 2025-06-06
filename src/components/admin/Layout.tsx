import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-72 min-h-screen bg-slate-50 p-8">
        <Toaster 
          position="top-right"
          richColors
        />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;