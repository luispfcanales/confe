import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { EditAcademicGradeModal } from "./components/EditAcademicGradeModal";
import { AcademicGrade } from "./types";
import { createColumns } from "../columns";
import { DataTable } from "../data-table";
import { AcademicGradeService } from './services/academicGradeService';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Cargando grados académicos...</p>
    </div>
  </div>
);

const AcademicGradesContent = () => {
  const [data, setData] = useState<AcademicGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAcademicGrade, setSelectedAcademicGrade] = useState<AcademicGrade | null>(null);

  const fetchAcademicGrades = async () => {
    try {
      setIsLoading(true);
      const academicGrades = await AcademicGradeService.getAllAcademicGrades();
      setData(academicGrades);
    } catch (error) {
      console.error('Error fetching academic grades:', error);
      toast.error('Error al cargar grados académicos', {
        description: 'No se pudieron obtener los grados académicos del sistema',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (academicGrade: AcademicGrade) => {
    try {
      const loadingToastId = toast.loading('Eliminando grado académico...');
      
      await AcademicGradeService.deleteAcademicGrade(academicGrade.ID.toString());
  
      toast.dismiss(loadingToastId);
      toast.success('Grado académico eliminado exitosamente', {
        description: `El grado "${academicGrade.name}" se ha eliminado correctamente.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      await fetchAcademicGrades();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al eliminar grado académico', {
        description: `No se pudo eliminar el grado "${academicGrade.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error deleting academic grade:', error);
    }
  };

  const handleEdit = (academicGrade: AcademicGrade) => {
    setSelectedAcademicGrade(academicGrade);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedAcademicGrade(null);
    setIsCreateModalOpen(true);
  };

  // Usar type="academicGrade" para la estructura de columnas
  const columns = createColumns<AcademicGrade>('academicGrade', handleEdit, handleDelete);

  useEffect(() => {
    fetchAcademicGrades();
  }, []);

  const handleCreate = async (newAcademicGrade: AcademicGrade) => {
    try {
      const loadingToastId = toast.loading('Creando nuevo grado académico...');
      
      const createdAcademicGrade = await AcademicGradeService.createAcademicGrade({
        name: newAcademicGrade.name,
      });

      toast.dismiss(loadingToastId);
      toast.success('Grado académico creado exitosamente', {
        description: `El grado "${createdAcademicGrade.name}" fue creado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsCreateModalOpen(false);
      await fetchAcademicGrades();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al crear grado académico', {
        description: 'No se pudo crear el nuevo grado académico.',
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error creating academic grade:', error);
    }
  };

  const handleSave = async (updatedAcademicGrade: AcademicGrade) => {
    if (!updatedAcademicGrade.ID) return;

    try {
      const loadingToastId = toast.loading('Actualizando grado académico...');
      
      const updated = await AcademicGradeService.updateAcademicGrade(updatedAcademicGrade.ID.toString(), {
        name: updatedAcademicGrade.name,
      });

      toast.dismiss(loadingToastId);
      toast.success('Grado académico actualizado', {
        description: `El grado "${updated.name}" se ha actualizado.`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
        duration: 5000,
      });
      
      setIsEditModalOpen(false);
      await fetchAcademicGrades();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al actualizar grado académico', {
        description: `No se pudo actualizar el grado "${updatedAcademicGrade.name}".`,
        action: { label: 'Cerrar', onClick: () => toast.dismiss() },
      });
      console.error('Error updating academic grade:', error);
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Grados Académicos</h1>
              <p className="text-gray-600 mt-1">Administra los grados y niveles académicos del sistema educativo</p>
            </div>
            <Button 
              onClick={handleCreateNew} 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Agregar Grado
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Grados Académicos</h2>
            <p className="text-sm text-gray-600 mt-1">
              {data.length} {data.length === 1 ? 'grado encontrado' : 'grados encontrados'}
            </p>
          </div>
          <DataTable columns={columns} data={data} type="academicGrade"/>
        </div>

        {/* Modals */}
        <EditAcademicGradeModal
          academicGrade={selectedAcademicGrade}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
        <EditAcademicGradeModal
          academicGrade={null}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
        />
      </div>
    </div>
  );
};

const AcademicGradesPage = () => {
  return <AcademicGradesContent />;
};

export default AcademicGradesPage;