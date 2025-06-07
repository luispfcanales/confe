import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { EditInvestigatorTypeModal } from "./components/EditInvestigatorTypeModal";
import { InvestigatorType } from "./types";
import { createColumns } from "../columns";
import { DataTable } from "../data-table";
import { InvestigatorTypeService } from './services/investigatorTypeService';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      <p className="text-sm text-gray-600">Cargando tipos de investigadores...</p>
    </div>
  </div>
);

const InvestigatorTypesContent = () => {
  const [data, setData] = useState<InvestigatorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvestigatorType, setSelectedInvestigatorType] = useState<InvestigatorType | null>(null);

  const fetchInvestigatorTypes = async () => {
    try {
      setIsLoading(true);
      const investigatorTypes = await InvestigatorTypeService.getAllInvestigatorTypes();
      setData(investigatorTypes);
    } catch (error) {
      console.error('Error fetching investigator types:', error);
      toast.error('Error al cargar tipos de investigadores', {
        description: 'No se pudieron obtener los tipos de investigadores del sistema',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (investigatorType: InvestigatorType) => {
    try {
      const loadingToastId = toast.loading('Eliminando tipo de investigador...');
      
      await InvestigatorTypeService.deleteInvestigatorType(investigatorType.ID.toString());
  
      toast.dismiss(loadingToastId);
      toast.success('Tipo de investigador eliminado exitosamente', {
        description: `El tipo "${investigatorType.name}" se ha eliminado correctamente.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      await fetchInvestigatorTypes();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al eliminar tipo de investigador', {
        description: `No se pudo eliminar el tipo "${investigatorType.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error deleting investigator type:', error);
    }
  };

  const handleEdit = (investigatorType: InvestigatorType) => {
    setSelectedInvestigatorType(investigatorType);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedInvestigatorType(null);
    setIsCreateModalOpen(true);
  };

  const columns = createColumns<InvestigatorType>('investigatorType', handleEdit, handleDelete);

  useEffect(() => {
    fetchInvestigatorTypes();
  }, []);

  const handleCreate = async (newInvestigatorType: InvestigatorType) => {
    try {
      const loadingToastId = toast.loading('Creando nuevo tipo de investigador...');
      
      const createdInvestigatorType = await InvestigatorTypeService.createInvestigatorType({
        name: newInvestigatorType.name,
      });

      toast.dismiss(loadingToastId);
      toast.success('Tipo de investigador creado exitosamente', {
        description: `El tipo "${createdInvestigatorType.name}" fue creado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsCreateModalOpen(false);
      await fetchInvestigatorTypes();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al crear tipo de investigador', {
        description: 'No se pudo crear el nuevo tipo de investigador.',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error creating investigator type:', error);
    }
  };

  const handleSave = async (updatedInvestigatorType: InvestigatorType) => {
    if (!updatedInvestigatorType.ID) return;

    try {
      const loadingToastId = toast.loading('Actualizando tipo de investigador...');
      
      const updated = await InvestigatorTypeService.updateInvestigatorType(updatedInvestigatorType.ID.toString(), {
        name: updatedInvestigatorType.name,
      });

      toast.dismiss(loadingToastId);
      toast.success('Tipo de investigador actualizado', {
        description: `El tipo "${updated.name}" se ha actualizado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsEditModalOpen(false);
      await fetchInvestigatorTypes();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al actualizar tipo de investigador', {
        description: `No se pudo actualizar el tipo "${updatedInvestigatorType.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error updating investigator type:', error);
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Tipos de Investigadores</h1>
              <p className="text-gray-600 mt-1">Administra los tipos de investigadores del sistema</p>
            </div>
            <Button 
              onClick={handleCreateNew} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar Tipo
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Tipos de Investigadores</h2>
            <p className="text-sm text-gray-600 mt-1">
              {data.length} {data.length === 1 ? 'tipo encontrado' : 'tipos encontrados'}
            </p>
          </div>
          <DataTable columns={columns} data={data} type="role"/>
        </div>

        {/* Modals */}
        <EditInvestigatorTypeModal
          investigatorType={selectedInvestigatorType}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
        <EditInvestigatorTypeModal
          investigatorType={null}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
        />
      </div>
    </div>
  );
};

const InvestigatorTypesPage = () => {
  return <InvestigatorTypesContent />;
};

export default InvestigatorTypesPage;