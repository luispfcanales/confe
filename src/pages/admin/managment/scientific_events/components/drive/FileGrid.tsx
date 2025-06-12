// components/drive/FileGrid.tsx
import React from 'react';
import { Folder } from 'lucide-react';
import { GoogleDriveFile } from '../../driveFiles';
import { FileItem } from './FileItem';

interface FileGridProps {
  files: GoogleDriveFile[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  dragActive: boolean;
  eventId: string; // ID del evento científico
  onFolderClick: (folder: GoogleDriveFile) => void;
  onFileChange: () => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Cargando archivos de Google Drive...</p>
    </div>
  </div>
);

const EmptyState = ({ hasError }: { hasError: boolean }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <Folder className="h-16 w-16 mb-4 text-gray-300" />
    <p className="text-lg font-medium">
      {hasError ? 'Error al cargar archivos' : 'Esta carpeta está vacía'}
    </p>
    <p className="text-sm">
      {hasError 
        ? 'Verifica la conexión con Google Drive' 
        : 'Arrastra archivos aquí o usa el botón "Subir Archivos"'
      }
    </p>
  </div>
);

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  isLoading,
  viewMode,
  dragActive,
  eventId,
  onFolderClick,
  onFileChange,
  onDrag,
  onDrop
}) => {
  const hasError = !Array.isArray(files);
  const isEmpty = Array.isArray(files) && files.length === 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
        dragActive ? 'border-blue-500 bg-blue-50' : ''
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (hasError || isEmpty) ? (
        <EmptyState hasError={hasError} />
      ) : (
        <div className="p-6">
          {/* Header de la sección */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Archivos de Google Drive
            </h2>
            <p className="text-sm text-gray-600">
              {files.length} {files.length === 1 ? 'elemento' : 'elementos'}
            </p>
          </div>
          
          {/* Grilla o lista de archivos */}
          <div 
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
                : 'space-y-2'
            }
          >
            {files.map((file) => (
              <FileItem
                key={file.ID}
                file={file}
                viewMode={viewMode}
                eventId={eventId}
                onFolderClick={onFolderClick}
                onFileChange={onFileChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};