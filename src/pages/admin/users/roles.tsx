import { PlusCircle } from 'lucide-react'; // Asegúrate de tener instalado lucide-react
import { Button } from '@/components/ui/button'; // Asegúrate de tener tu componente Button
import { useEffect, useState } from 'react';
import { API_URL } from '@/constants/api'
import { EditRoleModal } from "@/components/modals/EditRoleModal"
import { Role, createColumns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Role[]> {
  try {
    const response = await fetch(`${API_URL}/api/roles`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data)
    return data.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return empty array or throw error based on your error handling strategy
    return [];
  }
}

const RolesContent = () => {
  const [data, setData] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Nuevo estado para modal
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };
  const handleCreateNew = () => {
    setSelectedRole(null);
    setIsCreateModalOpen(true);
  };
  const columns = createColumns<Role>('role',handleEdit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const handleCreate = async (newRole: Role) => {
    try {
      const response = await fetch(`${API_URL}/api/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Agrega aquí otros headers necesarios como Authorization si es requerido
        },
        body: JSON.stringify({
          name: newRole.name,
          description: newRole.description,
          status: newRole.status
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Role created successfully:', data);
      
      setIsCreateModalOpen(false);
      // Refresh the data after successful creation
      const result = await getData();
      setData(result);
      
      // Opcional: Mostrar notificación de éxito
      // toast.success('Role created successfully');
    } catch (error) {
      console.error('Error creating role:', error);
      // Opcional: Mostrar notificación de error
      // toast.error('Failed to create role');
    }
  };

const handleSave = async (updatedRole: Role) => {
  try {
    const response = await fetch(`${API_URL}/api/roles/${updatedRole.ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Agrega aquí otros headers necesarios como Authorization si es requerido
      },
      body: JSON.stringify({
        name: updatedRole.name,
        description: updatedRole.description,
        status: updatedRole.status
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Role updated successfully:', data);
    
    setIsEditModalOpen(false);
    // Refresh the data after successful update
    const result = await getData();
    setData(result);
    
    // Opcional: Mostrar notificación de éxito
    // toast.success('Role updated successfully');
  } catch (error) {
    console.error('Error updating role:', error);
    // Opcional: Mostrar notificación de error
    // toast.error('Failed to update role');
  }
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button onClick={handleCreateNew} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Agregar Rol
        </Button>
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
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
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
  </div>
);

const RolesPage = () => {
  return <RolesContent />;
};

export default RolesPage;