// //index.tsx
// import { PlusCircle, Users, Filter } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from "sonner";
// import { useEffect, useState } from 'react';
// import { EditUserModal } from "./components/EditUserModal";
// import { User, Role } from "./types";
// import { createColumns } from "../columns";
// import { DataTable } from "../data-table";
// import { UserService } from './services/userService';

// const LoadingSpinner = () => (
//   <div className="flex items-center justify-center h-64">
//     <div className="flex flex-col items-center space-y-4">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       <p className="text-sm text-gray-600">Cargando usuarios...</p>
//     </div>
//   </div>
// );

// interface Filters {
//   roleId: string;
//   userType: string; // 'all' | 'internal' | 'external'
//   status: string;   // 'all' | 'active' | 'inactive'
// }

// const UsersContent = () => {
//   const [data, setData] = useState<User[]>([]);
//   const [allData, setAllData] = useState<User[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
//   // Estados para los filtros
//   const [filters, setFilters] = useState<Filters>({
//     roleId: 'all',
//     userType: 'all',
//     status: 'all'
//   });

//   const fetchUsers = async () => {
//     try {
//       setIsLoading(true);
//       const users = await UserService.getAllUsers();
//       console.log(users);
//       setAllData(users);
//       applyFilters(users, filters);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error('Error al cargar usuarios', {
//         description: 'No se pudieron obtener los usuarios del sistema',
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const rolesData = await UserService.getAllRoles();
//       setRoles(rolesData);
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//       toast.error('Error al cargar roles', {
//         description: 'No se pudieron obtener los roles del sistema',
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//       });
//     }
//   };

//   const applyFilters = (users: User[], currentFilters: Filters) => {
//     let filteredUsers = [...users];

//     // Filtro por rol
//     if (currentFilters.roleId !== 'all') {
//       filteredUsers = filteredUsers.filter(user => 
//         user.role_id?.toString() === currentFilters.roleId
//       );
//     }

//     // Filtro por tipo de usuario (interno/externo)
//     if (currentFilters.userType !== 'all') {
//       filteredUsers = filteredUsers.filter(user => {
//         if (currentFilters.userType === 'internal') {
//           return user.is_internal === true;
//         } else if (currentFilters.userType === 'external') {
//           return user.is_internal === false;
//         }
//         return true;
//       });
//     }

//     // Filtro por estado (activo/inactivo)
//     if (currentFilters.status !== 'all') {
//       filteredUsers = filteredUsers.filter(user => {
//         if (currentFilters.status === 'active') {
//           return user.is_active === true;
//         } else if (currentFilters.status === 'inactive') {
//           return user.is_active === false;
//         }
//         return true;
//       });
//     }

//     setData(filteredUsers);
//   };

//   const handleFilterChange = (filterType: keyof Filters, value: string) => {
//     const newFilters = { ...filters, [filterType]: value };
//     setFilters(newFilters);
//     applyFilters(allData, newFilters);
//   };

//   const clearAllFilters = () => {
//     const resetFilters = { roleId: 'all', userType: 'all', status: 'all' };
//     setFilters(resetFilters);
//     applyFilters(allData, resetFilters);
//   };

//   const handleDelete = async (user: User) => {
//     try {
//       const loadingToastId = toast.loading('Eliminando usuario...');
      
//       await UserService.deleteUser(user.ID!);
  
//       toast.dismiss(loadingToastId);
//       toast.success('Usuario eliminado exitosamente', {
//         description: `El usuario "${user.first_name} ${user.last_name}" se ha eliminado correctamente.`,
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//         duration: 5000,
//       });
      
//       await fetchUsers();
//     } catch (error) {
//       toast.dismiss();
//       toast.error('Error al eliminar usuario', {
//         description: `No se pudo eliminar el usuario "${user.first_name} ${user.last_name}".`,
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//       });
//       console.error('Error deleting user:', error);
//     }
//   };

//   const handleEdit = (user: User) => {
//     setSelectedUser(user);
//     setIsEditModalOpen(true);
//   };

//   const handleCreateNew = () => {
//     setSelectedUser(null);
//     setIsCreateModalOpen(true);
//   };

//   const handleToggleStatus = async (user: User) => {
//     try {
//       const loadingToastId = toast.loading(
//         user.is_active ? 'Desactivando usuario...' : 'Activando usuario...'
//       );
      
//       await UserService.toggleUserStatus(user.ID!, !user.is_active);

//       toast.dismiss(loadingToastId);
//       toast.success(
//         user.is_active ? 'Usuario desactivado' : 'Usuario activado',
//         {
//           description: `El usuario "${user.first_name} ${user.last_name}" ha sido ${
//             user.is_active ? 'desactivado' : 'activado'
//           }.`,
//           action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//           duration: 5000,
//         }
//       );
      
//       await fetchUsers();
//     } catch (error) {
//       toast.dismiss();
//       toast.error('Error al cambiar estado del usuario', {
//         description: `No se pudo cambiar el estado del usuario "${user.first_name} ${user.last_name}".`,
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//       });
//       console.error('Error toggling user status:', error);
//     }
//   };

//   const columns = createColumns<User>('user', handleEdit, handleDelete, handleToggleStatus);

//   useEffect(() => {
//     fetchUsers();
//     fetchRoles();
//   }, []);

//   const handleCreate = async (newUser: User) => {
//     try {
//       const loadingToastId = toast.loading('Creando nuevo usuario...');
      
//       const createdUser = await UserService.createUser({
//         RoleID: newUser.role_id,
//         DocumentTypeID: newUser.document_type_id,
//         FirstName: newUser.first_name,
//         LastName: newUser.last_name,
//         IdentityDocument: newUser.identity_document,
//         Address: newUser.address,
//         Email: newUser.email,
//         Sex: newUser.sex,
//         Password: newUser.password!,
//         IsActive: newUser.is_active,
//         IsInternal: newUser.is_internal
//       });

//       toast.dismiss(loadingToastId);
//       toast.success('Usuario creado exitosamente', {
//         description: `El usuario "${createdUser.first_name} ${createdUser.last_name}" fue creado.`,
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//         duration: 5000,
//       });
      
//       setIsCreateModalOpen(false);
//       await fetchUsers();
//     } catch (error) {
//       toast.dismiss();
//       toast.error('Error al crear usuario', {
//         description: 'No se pudo crear el nuevo usuario.',
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//       });
//       console.error('Error creating user:', error);
//     }
//   };

//   const handleSave = async (updatedUser: User) => {
//     if (!updatedUser.ID) return;

//     try {
//       const loadingToastId = toast.loading('Actualizando usuario...');
      
//       const updateData: any = {
//         RoleID: updatedUser.role_id,
//         DocumentTypeID: updatedUser.document_type_id,
//         FirstName: updatedUser.first_name,
//         LastName: updatedUser.last_name,
//         IdentityDocument: updatedUser.identity_document,
//         Address: updatedUser.address,
//         Email: updatedUser.email,
//         Sex: updatedUser.sex,
//         IsActive: updatedUser.is_active,
//         IsInternal: updatedUser.is_internal
//       };

//       // Solo incluir contraseña si se proporcionó
//       if (updatedUser.password && updatedUser.password.trim()) {
//         updateData.Password = updatedUser.password;
//       }

//       const updated = await UserService.updateUser(updatedUser.ID, updateData);

//       toast.dismiss(loadingToastId);
//       toast.success('Usuario actualizado', {
//         description: `El usuario "${updated.first_name} ${updated.last_name}" se ha actualizado.`,
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//         duration: 5000,
//       });
      
//       setIsEditModalOpen(false);
//       await fetchUsers();
//     } catch (error) {
//       toast.dismiss();
//       toast.error('Error al actualizar usuario', {
//         description: `No se pudo actualizar el usuario "${updatedUser.first_name} ${updatedUser.last_name}".`,
//         action: { label: 'Cerrar', onClick: () => toast.dismiss() },
//       });
//       console.error('Error updating user:', error);
//     }
//   };

//   const getFilteredCount = () => {
//     return data.length;
//   };

//   const getFilteredDescription = () => {
//     const count = getFilteredCount();
//     const total = allData.length;
    
//     const hasFilters = filters.roleId !== 'all' || filters.userType !== 'all' || filters.status !== 'all';
    
//     if (!hasFilters) {
//       return `${count} ${count === 1 ? 'usuario encontrado' : 'usuarios encontrados'}`;
//     }
    
//     return `${count} de ${total} usuarios filtrados`;
//   };

//   const getRoleName = (roleId: string) => {
//     const role = roles.find(r => r.ID?.toString() === roleId);
//     return role ? role.name : 'Desconocido';
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/50">
//       <div className="max-w-7xl mx-auto p-6 space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
//               <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
//             </div>
//             <Button 
//               onClick={handleCreateNew} 
//               className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
//             >
//               <PlusCircle className="h-4 w-4" />
//               Agregar Usuario
//             </Button>
//           </div>
//         </div>

//         {/* Filtros */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">Filtros:</span>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Filtro por Rol */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                   Por Rol
//                 </label>
//                 <Select 
//                   value={filters.roleId} 
//                   onValueChange={(value) => handleFilterChange('roleId', value)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Seleccionar rol" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         Todos los roles
//                       </div>
//                     </SelectItem>
//                     {roles.map((role) => (
//                       <SelectItem key={role.ID} value={role.ID?.toString() || ''}>
//                         <div className="flex items-center gap-2">
//                           <Users className="h-4 w-4 text-purple-600" />
//                           {role.name}
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Filtro por Tipo de Usuario */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                   Tipo de Usuario
//                 </label>
//                 <Select 
//                   value={filters.userType} 
//                   onValueChange={(value) => handleFilterChange('userType', value)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         Todos los tipos
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="internal">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4 text-blue-600" />
//                         Usuarios internos
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="external">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4 text-green-600" />
//                         Usuarios externos
//                       </div>
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Filtro por Estado */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                   Estado
//                 </label>
//                 <Select 
//                   value={filters.status} 
//                   onValueChange={(value) => handleFilterChange('status', value)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4" />
//                         Todos los estados
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="active">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4 text-emerald-600" />
//                         Usuarios activos
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="inactive">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4 text-red-600" />
//                         Usuarios inactivos
//                       </div>
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Botón para limpiar filtros */}
//               <div className="space-y-2">
//                 <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                   Acciones
//                 </label>
//                 <Button 
//                   variant="outline" 
//                   onClick={clearAllFilters}
//                   className="w-full"
//                 >
//                   Limpiar Filtros
//                 </Button>
//               </div>
//             </div>

//             {/* Información de filtros aplicados */}
//             <div className="pt-4 border-t border-gray-200">
//               <div className="flex flex-wrap gap-2 text-sm text-gray-600">
//                 <span>Mostrando:</span>
//                 <span className="font-medium text-gray-900">{getFilteredDescription()}</span>
                
//                 {/* Mostrar filtros activos */}
//                 {filters.roleId !== 'all' && (
//                   <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
//                     Rol: {getRoleName(filters.roleId)}
//                   </span>
//                 )}
//                 {filters.userType !== 'all' && (
//                   <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                     Tipo: {filters.userType === 'internal' ? 'Interno' : 'Externo'}
//                   </span>
//                 )}
//                 {filters.status !== 'all' && (
//                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
//                     Estado: {filters.status === 'active' ? 'Activo' : 'Inactivo'}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table Container */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900">Lista de Usuarios</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               {getFilteredDescription()}
//             </p>
//           </div>
//           <DataTable columns={columns} data={data} type="user"/>
//         </div>

//         {/* Modals */}
//         <EditUserModal
//           user={selectedUser}
//           isOpen={isEditModalOpen}
//           onClose={() => setIsEditModalOpen(false)}
//           onSave={handleSave}
//         />
//         <EditUserModal
//           user={null}
//           isOpen={isCreateModalOpen}
//           onClose={() => setIsCreateModalOpen(false)}
//           onSave={handleCreate}
//         />
//       </div>
//     </div>
//   );
// };

// const UsersPage = () => {
//   return <UsersContent />;
// };

// export default UsersPage;

//index.tsx
import { PlusCircle, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { EditUserModal } from "./components/EditUserModal";
import { User, Role } from "./types";
import { createColumns } from "../columns";
import { DataTable } from "../data-table";
import { UserService } from './services/userService';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Cargando usuarios...</p>
    </div>
  </div>
);

interface Filters {
  roleId: string;
  userType: string; // 'all' | 'internal' | 'external'
  status: string;   // 'all' | 'active' | 'inactive'
}

const UsersContent = () => {
  const [data, setData] = useState<User[]>([]);
  const [allData, setAllData] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Estados para los filtros
  const [filters, setFilters] = useState<Filters>({
    roleId: 'all',
    userType: 'all',
    status: 'all'
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const users = await UserService.getAllUsers();
      console.log(users);
      setAllData(users);
      applyFilters(users, filters);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios', {
        description: 'No se pudieron obtener los usuarios del sistema',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await UserService.getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Error al cargar roles', {
        description: 'No se pudieron obtener los roles del sistema',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
    }
  };

  const applyFilters = (users: User[], currentFilters: Filters) => {
    let filteredUsers = [...users];

    // Filtro por rol
    if (currentFilters.roleId !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.role_id?.toString() === currentFilters.roleId
      );
    }

    // Filtro por tipo de usuario (interno/externo)
    if (currentFilters.userType !== 'all') {
      filteredUsers = filteredUsers.filter(user => {
        if (currentFilters.userType === 'internal') {
          return user.is_internal === true;
        } else if (currentFilters.userType === 'external') {
          return user.is_internal === false;
        }
        return true;
      });
    }

    // Filtro por estado (activo/inactivo)
    if (currentFilters.status !== 'all') {
      filteredUsers = filteredUsers.filter(user => {
        if (currentFilters.status === 'active') {
          return user.is_active === true;
        } else if (currentFilters.status === 'inactive') {
          return user.is_active === false;
        }
        return true;
      });
    }

    setData(filteredUsers);
  };

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(allData, newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = { roleId: 'all', userType: 'all', status: 'all' };
    setFilters(resetFilters);
    applyFilters(allData, resetFilters);
  };

  const handleDelete = async (user: User) => {
    try {
      const loadingToastId = toast.loading('Eliminando usuario...');
      
      await UserService.deleteUser(user.ID!);
  
      toast.dismiss(loadingToastId);
      toast.success('Usuario eliminado exitosamente', {
        description: `El usuario "${user.first_name} ${user.last_name}" se ha eliminado correctamente.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      await fetchUsers();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al eliminar usuario', {
        description: `No se pudo eliminar el usuario "${user.first_name} ${user.last_name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const loadingToastId = toast.loading(
        user.is_active ? 'Desactivando usuario...' : 'Activando usuario...'
      );
      
      await UserService.toggleUserStatus(user.ID!, !user.is_active);

      toast.dismiss(loadingToastId);
      toast.success(
        user.is_active ? 'Usuario desactivado' : 'Usuario activado',
        {
          description: `El usuario "${user.first_name} ${user.last_name}" ha sido ${
            user.is_active ? 'desactivado' : 'activado'
          }.`,
          action: { label: 'Cerrar', onClick: () => toast.dismiss() },
          duration: 5000,
        }
      );
      
      await fetchUsers();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al cambiar estado del usuario', {
        description: `No se pudo cambiar el estado del usuario "${user.first_name} ${user.last_name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error toggling user status:', error);
    }
  };

  const columns = createColumns<User>('user', handleEdit, handleDelete, handleToggleStatus);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleCreate = async (newUser: User) => {
    try {
      const loadingToastId = toast.loading('Creando nuevo usuario...');
      
      // Crear objeto base para usuario
      const createData: any = {
        RoleID: newUser.role_id,
        DocumentTypeID: newUser.document_type_id,
        FirstName: newUser.first_name,
        LastName: newUser.last_name,
        IdentityDocument: newUser.identity_document,
        Address: newUser.address,
        Email: newUser.email,
        Sex: newUser.sex,
        Password: newUser.password!,
        IsActive: newUser.is_active,
        IsInternal: newUser.is_internal
      };

      // Agregar campos adicionales de investigador si existen
      if (newUser.researcher_type_id) {
        createData.ResearcherTypeID = newUser.researcher_type_id;
      }
      if (newUser.academic_grade_id) {
        createData.AcademicGradeID = newUser.academic_grade_id;
      }
      if (newUser.participation_type_id) {
        createData.ParticipationTypeID = newUser.participation_type_id;
      }
      if (newUser.faculty_id) {
        createData.FacultyID = newUser.faculty_id;
      }
      if (newUser.academic_department_id) {
        createData.AcademicDepartmentID = newUser.academic_department_id;
      }

      const createdUser = await UserService.createUser(createData);

      toast.dismiss(loadingToastId);
      toast.success('Usuario creado exitosamente', {
        description: `El usuario "${createdUser.first_name} ${createdUser.last_name}" fue creado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsCreateModalOpen(false);
      await fetchUsers();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al crear usuario', {
        description: 'No se pudo crear el nuevo usuario.',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error creating user:', error);
    }
  };

  const handleSave = async (updatedUser: User) => {
    if (!updatedUser.ID) return;

    try {
      const loadingToastId = toast.loading('Actualizando usuario...');
      
      // Crear objeto base para actualización
      const updateData: any = {
        RoleID: updatedUser.role_id,
        DocumentTypeID: updatedUser.document_type_id,
        FirstName: updatedUser.first_name,
        LastName: updatedUser.last_name,
        IdentityDocument: updatedUser.identity_document,
        Address: updatedUser.address,
        Email: updatedUser.email,
        Sex: updatedUser.sex,
        IsActive: updatedUser.is_active,
        IsInternal: updatedUser.is_internal
      };

      // Solo incluir contraseña si se proporcionó
      if (updatedUser.password && updatedUser.password.trim()) {
        updateData.Password = updatedUser.password;
      }

      // Agregar campos adicionales de investigador si existen
      if (updatedUser.researcher_type_id) {
        updateData.ResearcherTypeID = updatedUser.researcher_type_id;
      }
      if (updatedUser.academic_grade_id) {
        updateData.AcademicGradeID = updatedUser.academic_grade_id;
      }
      if (updatedUser.participation_type_id) {
        updateData.ParticipationTypeID = updatedUser.participation_type_id;
      }
      if (updatedUser.faculty_id) {
        updateData.FacultyID = updatedUser.faculty_id;
      }
      if (updatedUser.academic_department_id) {
        updateData.AcademicDepartmentID = updatedUser.academic_department_id;
      }

      const updated = await UserService.updateUser(updatedUser.ID, updateData);

      toast.dismiss(loadingToastId);
      toast.success('Usuario actualizado', {
        description: `El usuario "${updated.first_name} ${updated.last_name}" se ha actualizado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsEditModalOpen(false);
      await fetchUsers();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al actualizar usuario', {
        description: `No se pudo actualizar el usuario "${updatedUser.first_name} ${updatedUser.last_name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error updating user:', error);
    }
  };

  const getFilteredCount = () => {
    return data.length;
  };

  const getFilteredDescription = () => {
    const count = getFilteredCount();
    const total = allData.length;
    
    const hasFilters = filters.roleId !== 'all' || filters.userType !== 'all' || filters.status !== 'all';
    
    if (!hasFilters) {
      return `${count} ${count === 1 ? 'usuario encontrado' : 'usuarios encontrados'}`;
    }
    
    return `${count} de ${total} usuarios filtrados`;
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.ID?.toString() === roleId);
    return role ? role.name : 'Desconocido';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
            </div>
            <Button 
              onClick={handleCreateNew} 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar Usuario
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtro por Rol */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Por Rol
                </label>
                <Select 
                  value={filters.roleId} 
                  onValueChange={(value) => handleFilterChange('roleId', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Todos los roles
                      </div>
                    </SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.ID} value={role.ID?.toString() || ''}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Tipo de Usuario */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Tipo de Usuario
                </label>
                <Select 
                  value={filters.userType} 
                  onValueChange={(value) => handleFilterChange('userType', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Todos los tipos
                      </div>
                    </SelectItem>
                    <SelectItem value="internal">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Usuarios internos
                      </div>
                    </SelectItem>
                    <SelectItem value="external">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        Usuarios externos
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Estado */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Estado
                </label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Todos los estados
                      </div>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-600" />
                        Usuarios activos
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-red-600" />
                        Usuarios inactivos
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botón para limpiar filtros */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Acciones
                </label>
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>

            {/* Información de filtros aplicados */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span>Mostrando:</span>
                <span className="font-medium text-gray-900">{getFilteredDescription()}</span>
                
                {/* Mostrar filtros activos */}
                {filters.roleId !== 'all' && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    Rol: {getRoleName(filters.roleId)}
                  </span>
                )}
                {filters.userType !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Tipo: {filters.userType === 'internal' ? 'Interno' : 'Externo'}
                  </span>
                )}
                {filters.status !== 'all' && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Estado: {filters.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Usuarios</h2>
            <p className="text-sm text-gray-600 mt-1">
              {getFilteredDescription()}
            </p>
          </div>
          <DataTable columns={columns} data={data} type="user"/>
        </div>

        {/* Modals */}
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
        <EditUserModal
          user={null}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
        />
      </div>
    </div>
  );
};

const UsersPage = () => {
  return <UsersContent />;
};

export default UsersPage;