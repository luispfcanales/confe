import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { EditRoleModal } from "./components/EditRoleModal";
import { Role } from "./types";
import { createColumns } from "../columns";
import { DataTable } from "../data-table";
import { RoleService } from './services/roleService';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Cargando roles...</p>
    </div>
  </div>
);

const RolesContent = () => {
  const [data, setData] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const roles = await RoleService.getAllRoles();
      setData(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Error al cargar roles', {
        description: 'No se pudieron obtener los roles del sistema',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (role: Role) => {
    try {
      const loadingToastId = toast.loading('Eliminando rol...');
      
      await RoleService.deleteRole(role.ID.toString());
  
      toast.dismiss(loadingToastId);
      toast.success('Rol eliminado exitosamente', {
        description: `El rol "${role.name}" se ha eliminado correctamente.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      await fetchRoles();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al eliminar rol', {
        description: `No se pudo eliminar el rol "${role.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error deleting role:', error);
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedRole(null);
    setIsCreateModalOpen(true);
  };




  const columns = createColumns<Role>('role', handleEdit,handleDelete);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = async (newRole: Role) => {
    try {
      const loadingToastId = toast.loading('Creando nuevo rol...');
      
      const createdRole = await RoleService.createRole({
        name: newRole.name,
        description: newRole.description,
        status: newRole.status
      });

      toast.dismiss(loadingToastId);
      toast.success('Rol creado exitosamente', {
        description: `El rol "${createdRole.name}" fue creado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsCreateModalOpen(false);
      await fetchRoles();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al crear rol', {
        description: 'No se pudo crear el nuevo rol.',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error creating role:', error);
    }
  };

  const handleSave = async (updatedRole: Role) => {
    if (!updatedRole.ID) return;

    try {
      const loadingToastId = toast.loading('Actualizando rol...');
      
      const updated = await RoleService.updateRole(updatedRole.ID.toString(), {
        name: updatedRole.name,
        description: updatedRole.description,
        status: updatedRole.status
      });

      toast.dismiss(loadingToastId);
      toast.success('Rol actualizado', {
        description: `El rol "${updated.name}" se ha actualizado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsEditModalOpen(false);
      await fetchRoles();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al actualizar rol', {
        description: `No se pudo actualizar el rol "${updatedRole.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error updating role:', error);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
              <p className="text-gray-600 mt-1">Administra los roles del sistema</p>
            </div>
            <Button 
              onClick={handleCreateNew} 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar Rol
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Roles</h2>
            <p className="text-sm text-gray-600 mt-1">
              {data.length} {data.length === 1 ? 'rol encontrado' : 'roles encontrados'}
            </p>
          </div>
          <DataTable columns={columns} data={data} type="role"/>
        </div>

        {/* Modals */}
        <EditRoleModal
          role={selectedRole}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
        <EditRoleModal
          role={null}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
        />
      </div>
    </div>
  );
};

const RolesPage = () => {
  return <RolesContent />;
};

export default RolesPage;