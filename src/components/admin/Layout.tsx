import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-72 min-h-screen bg-slate-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;