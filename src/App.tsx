import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/home";
import Login from "./pages/login";
import AdminLayout from './components/admin/Layout';
import UsersPage from './pages/admin/users';
import RolesPage from './pages/admin/users/roles';
import AdministratorsPage from './pages/admin/users/administrators';
import ResearchersPage from './pages/admin/users/researchers';
import EvaluatorsPage from './pages/admin/users/evaluators';
import PostersPage from './pages/admin/posters';
import PosterEditorPage from './pages/admin/poster-editor';
import NewEditor from './pages/admin/new-editor';
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
          {/* <Route path="users" element={<UsersPage />} /> */}
          <Route path="users/roles" element={<RolesPage />} />
          <Route path="users/administrators" element={<AdministratorsPage />} />
          <Route path="users/researchers" element={<ResearchersPage />} />
          <Route path="users/evaluators" element={<EvaluatorsPage />} />
          <Route path="posters" element={<PostersPage/>} />
          <Route path="posters/new" element={<PosterEditorPage />} />
          <Route path="posters/A4-new" element={<NewEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;