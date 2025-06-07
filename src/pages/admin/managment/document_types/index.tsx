import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { EditDocumentTypeModal } from "./components/EditDocumentTypeModal";
import { DocumentType } from "./types";
import { createColumns } from "../columns";
import { DataTable } from "../data-table";
import { DocumentTypeService } from './services/documentTypeService';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="text-sm text-gray-600">Cargando tipos de documentos...</p>
    </div>
  </div>
);

const DocumentTypesContent = () => {
  const [data, setData] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);

  const fetchDocumentTypes = async () => {
    try {
      setIsLoading(true);
      const documentTypes = await DocumentTypeService.getAllDocumentTypes();
      setData(documentTypes);
    } catch (error) {
      console.error('Error fetching document types:', error);
      toast.error('Error al cargar tipos de documentos', {
        description: 'No se pudieron obtener los tipos de documentos del sistema',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (documentType: DocumentType) => {
    try {
      const loadingToastId = toast.loading('Eliminando tipo de documento...');
      
      await DocumentTypeService.deleteDocumentType(documentType.ID.toString());
  
      toast.dismiss(loadingToastId);
      toast.success('Tipo de documento eliminado exitosamente', {
        description: `El tipo "${documentType.name}" se ha eliminado correctamente.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      await fetchDocumentTypes();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al eliminar tipo de documento', {
        description: `No se pudo eliminar el tipo "${documentType.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error deleting document type:', error);
    }
  };

  const handleEdit = (documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedDocumentType(null);
    setIsCreateModalOpen(true);
  };

  // Usar type="role" ya que la estructura de columnas es similar (sin status específico)
  const columns = createColumns<DocumentType>('documentType', handleEdit, handleDelete);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const handleCreate = async (newDocumentType: DocumentType) => {
    try {
      const loadingToastId = toast.loading('Creando nuevo tipo de documento...');
      
      const createdDocumentType = await DocumentTypeService.createDocumentType({
        name: newDocumentType.name,
        description: newDocumentType.description
      });

      toast.dismiss(loadingToastId);
      toast.success('Tipo de documento creado exitosamente', {
        description: `El tipo "${createdDocumentType.name}" fue creado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsCreateModalOpen(false);
      await fetchDocumentTypes();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al crear tipo de documento', {
        description: 'No se pudo crear el nuevo tipo de documento.',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error creating document type:', error);
    }
  };

  const handleSave = async (updatedDocumentType: DocumentType) => {
    if (!updatedDocumentType.ID) return;

    try {
      const loadingToastId = toast.loading('Actualizando tipo de documento...');
      
      const updated = await DocumentTypeService.updateDocumentType(updatedDocumentType.ID.toString(), {
        name: updatedDocumentType.name,
        description: updatedDocumentType.description
      });

      toast.dismiss(loadingToastId);
      toast.success('Tipo de documento actualizado', {
        description: `El tipo "${updated.name}" se ha actualizado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsEditModalOpen(false);
      await fetchDocumentTypes();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al actualizar tipo de documento', {
        description: `No se pudo actualizar el tipo "${updatedDocumentType.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error updating document type:', error);
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Tipos de Documentos</h1>
              <p className="text-gray-600 mt-1">Administra los tipos de documentos de identidad del sistema</p>
            </div>
            <Button 
              onClick={handleCreateNew} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar Tipo
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Tipos de Documentos</h2>
            <p className="text-sm text-gray-600 mt-1">
              {data.length} {data.length === 1 ? 'tipo encontrado' : 'tipos encontrados'}
            </p>
          </div>
          <DataTable columns={columns} data={data} type="documentType"/>
        </div>

        {/* Modals */}
        <EditDocumentTypeModal
          documentType={selectedDocumentType}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
        <EditDocumentTypeModal
          documentType={null}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
        />
      </div>
    </div>
  );
};

const DocumentTypesPage = () => {
  return <DocumentTypesContent />;
};

export default DocumentTypesPage;