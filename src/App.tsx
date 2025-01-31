import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/home";
import Login from "./pages/login";
import AdminLayout from './components/admin/Layout';
import UsersPage from './pages/admin/users';
import PostersPage from './pages/admin/posters';
import PosterEditorPage from './pages/admin/poster-editor';
import A4Editor from './pages/admin/poster-a4editor';
// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('userRole') === 'admin';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas del administrador */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard</div>} />
          <Route path="users" element={<UsersPage />} />
          <Route path="posters" element={<PostersPage/>} />
          <Route path="posters/new" element={<PosterEditorPage />} />
          <Route path="posters/A4-new" element={<A4Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;