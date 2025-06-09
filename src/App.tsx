// // // App.tsx - Modificaciones necesarias
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import Home from "./pages/home";
// // import PublicationPage from "./pages/publications";
// // import Register from "./pages/register/register";
// // import UserRegistration from "./pages/user_registration/user_registration";
// // import Login from "./pages/login";
// // import AdminLayout from './components/admin/Layout';
// // import Dashboard from './pages/admin/dashboard/dashboard';
// // import RolesPage from './pages/admin/managment/roles/';
// // import InvestigatorTypePage from './pages/admin/managment/investigator_types';
// // import DocumentTypesPage from './pages/admin/managment/document_types';
// // import AcademicGradesPage from './pages/admin/managment/academic_grades';
// // import ScientificEventsManagement from './pages/admin/managment/scientific_events'
// // import EventDrivePage from './pages/admin/managment/scientific_events/EventDrivePage'; // NUEVA IMPORTACIÓN
// // import UsersPage from './pages/admin/managment/users';
// // import PostersPage from './pages/admin/posters';
// // import PosterEditorPage from './pages/admin/poster-editor';
// // import NewEditor from './pages/admin/new-editor';
// // import { Toaster } from 'sonner';

// // // Componente para proteger rutas
// // const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
// //   const isAuthenticated = localStorage.getItem('userRole') === 'admin';

// //   if (!isAuthenticated) {
// //     return <Navigate to="/login" />;
// //   }

// //   return children;
// // };

// // const ProtectedRouteInevstigator = ({ children }: { children: JSX.Element }) => {
// //   const isAuthenticated = localStorage.getItem('userRole') === 'investigator';

// //   if (!isAuthenticated) {
// //     return <Navigate to="/login" />;
// //   }

// //   return children;
// // };

// // function App(): JSX.Element {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/publications" element={<PublicationPage />} />
// //         <Route path="/register" element={<Register />} />
// //         <Route path="/user-registration" element={<UserRegistration />} />
// //         <Route path="/login" element={<Login />} />

// //         {/* Rutas protegidas del administrador */}
// //         <Route path="/admin" element={
// //           <ProtectedRoute>
// //             <AdminLayout />
// //           </ProtectedRoute>
// //         }>
// //           <Route path="dashboard" element={<Dashboard />} />
// //           <Route path="system/roles" element={<RolesPage />} />
// //           <Route path="system/users" element={<UsersPage />} />
// //           <Route path="system/investigator-types" element={<InvestigatorTypePage />} />
// //           <Route path="system/document-types" element={<DocumentTypesPage />} />
// //           <Route path="system/academic-grades" element={<AcademicGradesPage />} />
          
// //           {/* MODIFICACIÓN: Rutas anidadas para eventos científicos */}
// //           <Route path="scientific-events">
// //             <Route index element={<ScientificEventsManagement />} />
// //             <Route path=":uuid/drive" element={<EventDrivePage />} /> {/* NUEVA RUTA */}
// //           </Route>

// //           <Route path="posters" element={<PostersPage />} />
// //           <Route path="posters/new" element={<PosterEditorPage />} />
// //           <Route path="posters/A4-new" element={<NewEditor />} />
// //         </Route>

// //         <Route path="/investigator" element={
// //           <ProtectedRouteInevstigator>
// //             <Register />
// //           </ProtectedRouteInevstigator>
// //         } />
// //       </Routes>
// //       <Toaster />
// //     </BrowserRouter>
// //   );
// // }

// // export default App;








// // src/App.tsx - Sistema de autenticación completo integrado
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './components/auth/AuthContext';
// import { ProtectedRoute } from './components/auth/ProtectedRoute';
// import { Toaster } from 'sonner';
// import { UserRole } from './types/auth';

// // Páginas públicas
// import Home from "./pages/home";
// import PublicationPage from "./pages/publications";
// import Register from "./pages/register/register";
// import UserRegistration from "./pages/user_registration/user_registration";

// // Páginas de autenticación
// import Login from './pages/login';
// import Unauthorized from './pages/Unauthorized';

// // Layout y páginas del admin
// import AdminLayout from './components/admin/Layout';
// import Dashboard from './pages/admin/dashboard/dashboard';
// import RolesPage from './pages/admin/managment/roles/';
// import InvestigatorTypePage from './pages/admin/managment/investigator_types';
// import DocumentTypesPage from './pages/admin/managment/document_types';
// import AcademicGradesPage from './pages/admin/managment/academic_grades';
// import ScientificEventsManagement from './pages/admin/managment/scientific_events'
// import EventDrivePage from './pages/admin/managment/scientific_events/EventDrivePage';
// import UsersPage from './pages/admin/managment/users';
// import PostersPage from './pages/admin/posters';
// import PosterEditorPage from './pages/admin/poster-editor';
// import NewEditor from './pages/admin/new-editor';

// function App(): JSX.Element {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Rutas públicas */}
//           <Route path="/" element={<Home />} />
//           <Route path="/publications" element={<PublicationPage />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/user-registration" element={<UserRegistration />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* Rutas protegidas del administrador */}
//           <Route 
//             path="/admin/*" 
//             element={
//               <ProtectedRoute requiredRoles={['ADMINISTRADOR'] as UserRole[]}>
//                 <AdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route path="dashboard" element={<Dashboard />} />
            
//             {/* Gestión del sistema - Solo administrador */}
//             <Route path="system/roles" element={<RolesPage />} />
//             <Route path="system/users" element={<UsersPage />} />
//             <Route path="system/investigator-types" element={<InvestigatorTypePage />} />
//             <Route path="system/document-types" element={<DocumentTypesPage />} />
//             <Route path="system/academic-grades" element={<AcademicGradesPage />} />
            
//             {/* Eventos científicos */}
//             <Route path="scientific-events" element={<ScientificEventsManagement />} />
//             <Route path="scientific-events/:uuid/drive" element={<EventDrivePage />} />
            
//             {/* Posters */}
//             <Route path="posters" element={<PostersPage />} />
//             <Route path="posters/new" element={<PosterEditorPage />} />
//             <Route path="posters/A4-new" element={<NewEditor />} />
            
//             {/* Redirigir /admin a /admin/dashboard */}
//             <Route index element={<Navigate to="dashboard" replace />} />
//           </Route>

//           {/* Rutas protegidas del revisor de posters */}
//           <Route 
//             path="/reviewer/*" 
//             element={
//               <ProtectedRoute requiredRoles={['REVISOR_POSTERS', 'ADMINISTRADOR'] as UserRole[]}>
//                 <AdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="posters" element={<PostersPage />} />
//             <Route index element={<Navigate to="dashboard" replace />} />
//           </Route>

//           {/* Rutas protegidas del investigador */}
//           <Route 
//             path="/investigator" 
//             element={
//               <ProtectedRoute requiredRoles={['INVESTIGADOR'] as UserRole[]}>
//                 <Register />
//               </ProtectedRoute>
//             }
//           />

//           {/* Ruta catch-all para páginas no encontradas */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
        
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//           }}
//         />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;








// // // App.tsx - Sistema de autenticación completo
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import { AuthProvider } from './contexts/AuthContext';
// // import { ProtectedRoute } from './components/auth/ProtectedRoute';
// // import { Toaster } from 'sonner';

// // // Páginas públicas
// // import Home from "./pages/home";
// // import PublicationPage from "./pages/publications";
// // import Register from "./pages/register/register";
// // import UserRegistration from "./pages/user_registration/user_registration";

// // // Páginas de autenticación
// // import Login from './pages/auth/Login';
// // import Unauthorized from './pages/Unauthorized';

// // // Layout y páginas del admin
// // import AdminLayout from './components/admin/Layout';
// // import Dashboard from './pages/admin/dashboard/dashboard';
// // import RolesPage from './pages/admin/managment/roles/';
// // import InvestigatorTypePage from './pages/admin/managment/investigator_types';
// // import DocumentTypesPage from './pages/admin/managment/document_types';
// // import AcademicGradesPage from './pages/admin/managment/academic_grades';
// // import ScientificEventsManagement from './pages/admin/managment/scientific_events'
// // import EventDrivePage from './pages/admin/managment/scientific_events/EventDrivePage';
// // import UsersPage from './pages/admin/managment/users';
// // import PostersPage from './pages/admin/posters';
// // import PosterEditorPage from './pages/admin/poster-editor';
// // import NewEditor from './pages/admin/new-editor';

// // // Tipos de roles
// // import { UserRole } from './types/auth';

// // function App(): JSX.Element {
// //   return (
// //     <AuthProvider>
// //       <BrowserRouter>
// //         <Routes>
// //           {/* Rutas públicas */}
// //           <Route path="/" element={<Home />} />
// //           <Route path="/publications" element={<PublicationPage />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/user-registration" element={<UserRegistration />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/unauthorized" element={<Unauthorized />} />

// //           {/* Rutas protegidas del administrador */}
// //           <Route 
// //             path="/admin/*" 
// //             element={
// //               <ProtectedRoute requiredRoles={['ADMINISTRADOR'] as UserRole[]}>
// //                 <AdminLayout />
// //               </ProtectedRoute>
// //             }
// //           >
// //             <Route path="dashboard" element={<Dashboard />} />
            
// //             {/* Gestión del sistema - Solo administrador */}
// //             <Route path="system/roles" element={<RolesPage />} />
// //             <Route path="system/users" element={<UsersPage />} />
// //             <Route path="system/investigator-types" element={<InvestigatorTypePage />} />
// //             <Route path="system/document-types" element={<DocumentTypesPage />} />
// //             <Route path="system/academic-grades" element={<AcademicGradesPage />} />
            
// //             {/* Eventos científicos */}
// //             <Route path="scientific-events" element={<ScientificEventsManagement />} />
// //             <Route path="scientific-events/:uuid/drive" element={<EventDrivePage />} />
            
// //             {/* Posters - Acceso para admin y revisor */}
// //             <Route path="posters" element={<PostersPage />} />
// //             <Route path="posters/new" element={<PosterEditorPage />} />
// //             <Route path="posters/A4-new" element={<NewEditor />} />
            
// //             {/* Redirigir /admin a /admin/dashboard */}
// //             <Route index element={<Navigate to="dashboard" replace />} />
// //           </Route>

// //           {/* Rutas protegidas del revisor de posters */}
// //           <Route 
// //             path="/reviewer/*" 
// //             element={
// //               <ProtectedRoute requiredRoles={['REVISOR_POSTERS', 'ADMINISTRADOR'] as UserRole[]}>
// //                 <AdminLayout />
// //               </ProtectedRoute>
// //             }
// //           >
// //             <Route path="dashboard" element={<Dashboard />} />
// //             <Route path="posters" element={<PostersPage />} />
// //             <Route index element={<Navigate to="dashboard" replace />} />
// //           </Route>

// //           {/* Rutas protegidas del investigador */}
// //           <Route 
// //             path="/investigator/*" 
// //             element={
// //               <ProtectedRoute requiredRoles={['INVESTIGADOR'] as UserRole[]}>
// //                 <Register />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* Ruta catch-all para páginas no encontradas */}
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Routes>
        
// //         <Toaster 
// //           position="top-right"
// //           toastOptions={{
// //             duration: 4000,
// //             style: {
// //               background: '#363636',
// //               color: '#fff',
// //             },
// //           }}
// //         />
// //       </BrowserRouter>
// //     </AuthProvider>
// //   );
// // }

// // export default App;




// src/App.tsx - Sistema de autenticación completo integrado
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthDebug } from './components/auth/AuthDebug'; // Temporal para debugging
import { Toaster } from 'sonner';
import { UserRole } from './types/auth';

// Páginas públicas
import Home from "./pages/home";
import PublicationPage from "./pages/publications";
import Register from "./pages/register/register";
import UserRegistration from "./pages/user_registration/user_registration";

// Páginas de autenticación
import Login from './pages/login';
import Unauthorized from './pages/Unauthorized';

// Layout y páginas del admin
import AdminLayout from './components/admin/Layout';
import Dashboard from './pages/admin/dashboard/dashboard';
import RolesPage from './pages/admin/managment/roles/';
import InvestigatorTypePage from './pages/admin/managment/investigator_types';
import DocumentTypesPage from './pages/admin/managment/document_types';
import AcademicGradesPage from './pages/admin/managment/academic_grades';
import ScientificEventsManagement from './pages/admin/managment/scientific_events'
import EventDrivePage from './pages/admin/managment/scientific_events/EventDrivePage';
import UsersPage from './pages/admin/managment/users';
import PostersPage from './pages/admin/posters';
import PosterEditorPage from './pages/admin/poster-editor';
import NewEditor from './pages/admin/new-editor';



function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/publications" element={<PublicationPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas del administrador */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR'] as UserRole[]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Gestión del sistema - Solo administrador */}
            <Route path="system/roles" element={<RolesPage />} />
            <Route path="system/users" element={<UsersPage />} />
            <Route path="system/investigator-types" element={<InvestigatorTypePage />} />
            <Route path="system/document-types" element={<DocumentTypesPage />} />
            <Route path="system/academic-grades" element={<AcademicGradesPage />} />
            
            {/* Eventos científicos */}
            <Route path="scientific-events" element={<ScientificEventsManagement />} />
            <Route path="scientific-events/:uuid/drive" element={<EventDrivePage />} />
            
            {/* Posters */}
            <Route path="posters" element={<PostersPage />} />
            <Route path="posters/new" element={<PosterEditorPage />} />
            <Route path="posters/A4-new" element={<NewEditor />} />
            
            {/* Redirigir /admin a /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Rutas protegidas del revisor de posters */}
          <Route 
            path="/reviewer/*" 
            element={
              <ProtectedRoute requiredRoles={['REVISOR_POSTERS', 'ADMINISTRADOR'] as UserRole[]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posters" element={<PostersPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Rutas protegidas del investigador */}
          <Route 
            path="/investigator" 
            element={
              <ProtectedRoute requiredRoles={['INVESTIGADOR'] as UserRole[]}>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Ruta catch-all para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster 
          position="top-right"
          duration={4000}
          toastOptions={{
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        {/* Componente temporal para debugging - remover en producción */}
        {/* <AuthDebug /> */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;