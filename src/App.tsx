import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/home";
import PublicationPage from "./pages/publications";
import Register from "./pages/register/register";
import UserRegistration from "./pages/user_registration/user_registration";
import Login from "./pages/login";
import AdminLayout from './components/admin/Layout';
import Dashboard from './pages/admin/dashboard/dashboard';
import RolesPage from './pages/admin/managment/roles/';
import UsersPage from './pages/admin/managment/users';
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
        <Route path="/publications" element={<PublicationPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas del administrador */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard/>} />
          {/* <Route path="users" element={<UsersPage />} /> */}
          <Route path="system/roles" element={<RolesPage />} />
          <Route path="system/users" element={<UsersPage />} />
          {/* <Route path="users/researchers" element={<ResearchersPage />} />
          <Route path="users/evaluators" element={<EvaluatorsPage />} /> */}
          <Route path="posters" element={<PostersPage/>} />
          <Route path="posters/new" element={<PosterEditorPage />} />
          <Route path="posters/A4-new" element={<NewEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;