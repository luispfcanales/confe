// components/EventDriveView.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GoogleDriveFile, ScientificEventWithDrive, BreadcrumbItem } from '../driveFiles';
import { GoogleDriveService } from '../services/googleDriveService';
import { EventHeader } from './drive/EventHeader';
import { FileGrid } from './drive/FileGrid';
import { CreateFolderModal, UploadFilesModal } from './drive/DriveModals';

interface EventDriveViewProps {
  event: ScientificEventWithDrive;
}

export const EventDriveView: React.FC<EventDriveViewProps> = ({ event }) => {
  // Estados principales
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string>(event.id_path_drive_file || '');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  
  // Estados de modales
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Estados de drag & drop
  const [dragActive, setDragActive] = useState(false);

  // Cargar archivos de Google Drive
  const fetchFiles = useCallback(async () => {
    if (!currentFolderId) {
      setError('No hay carpeta de Google Drive asociada a este evento');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const filesData = await GoogleDriveService.getDriveFiles(currentFolderId);
      
      if (Array.isArray(filesData)) {
        setFiles(filesData);
      } else {
        console.warn('filesData no es un array:', filesData);
        setFiles([]);
        setError('Formato de respuesta inválido del servidor');
      }
    } catch (error) {
      console.error('Error fetching Drive files:', error);
      setError('Error al cargar archivos de Google Drive');
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Handlers de navegación
  const handleFolderClick = (folder: GoogleDriveFile) => {
    setCurrentFolderId(folder.ID);
    setBreadcrumbs(prev => [...prev, { id: folder.ID, name: folder.name, type: 'folder' }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setCurrentFolderId(event.id_path_drive_file || '');
      setBreadcrumbs([]);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1]?.id || event.id_path_drive_file || '');
    }
  };

  // Handlers de creación de carpeta
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      const loadingToastId = toast.loading('Creando carpeta en Google Drive...');
      
      await GoogleDriveService.createFolder({
        name: folderName.trim(),
        parent_id: currentFolderId,
      });

      toast.dismiss(loadingToastId);
      toast.success('Carpeta creada exitosamente', {
        description: `La carpeta "${folderName.trim()}" se ha creado en Google Drive.`,
        duration: 4000,
      });
      
      setIsCreateFolderModalOpen(false);
      setFolderName('');
      fetchFiles();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al crear carpeta', {
        description: 'No se pudo crear la carpeta en Google Drive.',
      });
      console.error('Error creating folder:', error);
    }
  };

  // Handlers de subida de archivos
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const loadingToastId = toast.loading('Subiendo archivos a Google Drive...');
      
      await GoogleDriveService.uploadFiles({
        parent_id: currentFolderId,
        files: selectedFiles,
      });

      toast.dismiss(loadingToastId);
      toast.success('Archivos subidos exitosamente', {
        description: `${selectedFiles.length} archivo(s) subido(s) a Google Drive.`,
        duration: 4000,
      });
      
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      fetchFiles();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al subir archivos', {
        description: 'No se pudieron subir los archivos a Google Drive.',
      });
      console.error('Error uploading files:', error);
    }
  };

  // Handlers de drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const validFiles = Array.from(e.dataTransfer.files).filter(file => {
        if (!GoogleDriveService.isValidFileType(file)) {
          toast.error(`Tipo de archivo no válido: ${file.name}`);
          return false;
        }
        if (!GoogleDriveService.isValidFileSize(file)) {
          toast.error(`Archivo demasiado grande: ${file.name}`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        setIsUploadModalOpen(true);
      }
    }
  };

  // Handler para validar archivos seleccionados
  const handleFileInputChange = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!GoogleDriveService.isValidFileType(file)) {
        toast.error(`Tipo de archivo no válido: ${file.name}`);
        return false;
      }
      if (!GoogleDriveService.isValidFileSize(file)) {
        toast.error(`Archivo demasiado grande: ${file.name}`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header del evento */}
        <EventHeader
          event={event}
          breadcrumbs={breadcrumbs}
          viewMode={viewMode}
          onBreadcrumbClick={handleBreadcrumbClick}
          onCreateFolderClick={() => setIsCreateFolderModalOpen(true)}
          onUploadFilesClick={() => setIsUploadModalOpen(true)}
          onViewModeChange={setViewMode}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Grid de archivos */}
        <FileGrid
          files={files}
          isLoading={isLoading}
          viewMode={viewMode}
          dragActive={dragActive}
          eventId={event.ID} // Pasar el ID del evento
          onFolderClick={handleFolderClick}
          onFileChange={fetchFiles}
          onDrag={handleDrag}
          onDrop={handleDrop}
        />

        {/* Modal para crear carpeta */}
        <CreateFolderModal
          isOpen={isCreateFolderModalOpen}
          folderName={folderName}
          onClose={() => setIsCreateFolderModalOpen(false)}
          onFolderNameChange={setFolderName}
          onCreateFolder={handleCreateFolder}
        />

        {/* Modal para subir archivos */}
        <UploadFilesModal
          isOpen={isUploadModalOpen}
          selectedFiles={selectedFiles}
          onClose={() => setIsUploadModalOpen(false)}
          onFilesChange={handleFileInputChange}
          onUploadFiles={handleFileUpload}
        />
      </div>
    </div>
  );
};