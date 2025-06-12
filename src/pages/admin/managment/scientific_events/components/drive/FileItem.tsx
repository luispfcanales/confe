// components/drive/FileItem.tsx (Fixed version)
import React from 'react';
import { Folder, FileText } from 'lucide-react';
import { GoogleDriveFile } from '../../driveFiles';
import { GoogleDriveService } from '../../services/googleDriveService';
import { FileActionDropdown } from './FileActionDropDown';

interface FileItemProps {
  file: GoogleDriveFile;
  viewMode: 'grid' | 'list';
  eventId: string;
  onFolderClick: (folder: GoogleDriveFile) => void;
  onFileChange: () => void;
}

export const FileItem: React.FC<FileItemProps> = ({ 
  file, 
  viewMode, 
  eventId,
  onFolderClick, 
  onFileChange 
}) => {
  const isFolder = GoogleDriveService.isFolder(file);
  const previewUrl = GoogleDriveService.getPreviewUrl(file);

  const handleClick = (e: React.MouseEvent) => {
    // Solo navegar si se hace clic en la carpeta, no en los controles
    if (isFolder && e.currentTarget === e.target) {
      onFolderClick(file);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Verificar que no se haya hecho clic en el dropdown
    const target = e.target as HTMLElement;
    const isDropdownClick = target.closest('[data-dropdown-trigger]') || 
                           target.closest('[role="menuitem"]') ||
                           target.closest('button[aria-haspopup]');
    
    if (!isDropdownClick && isFolder) {
      onFolderClick(file);
    }
  };

  if (viewMode === 'grid') {
    return (
      <div
        className="group relative p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex flex-col items-center space-y-3">
          {/* Icono/Preview del archivo */}
          <div className="text-4xl relative">
            {isFolder ? (
              <Folder className="h-12 w-12 text-blue-500" />
            ) : previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt={file.name}
                  className="h-12 w-12 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const span = e.currentTarget.nextSibling as HTMLElement;
                    if (span) span.style.display = 'block';
                  }}
                />
                <span className="hidden text-2xl">
                  {GoogleDriveService.getFileIcon(file.mimeType)}
                </span>
              </div>
            ) : (
              <span>{GoogleDriveService.getFileIcon(file.mimeType)}</span>
            )}
          </div>
          
          {/* Información del archivo */}
          <div className="text-center w-full">
            <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </p>
            
            {/* Tamaño del archivo */}
            {!isFolder && file.size && (
              <p className="text-xs text-gray-500 mt-1">
                {GoogleDriveService.formatFileSize(file.size)}
              </p>
            )}
            
            {/* Fecha de modificación */}
            {file.modifiedTime && (
              <p className="text-xs text-gray-400 mt-1">
                {GoogleDriveService.formatDate(file.modifiedTime)}
              </p>
            )}
            
            {/* Indicador de ownership */}
            {file.ownedByMe !== undefined && (
              <div className="flex justify-center mt-1">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {file.ownedByMe ? '👑 Tuyo' : '👁️ Compartido'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Menú de acciones - IMPORTANTE: stopPropagation en el contenedor */}
        <div 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation(); // Evitar que se propague al card
            console.log('🎯 Dropdown container clicked');
          }}
          data-dropdown-trigger="true"
        >
          <FileActionDropdown
            file={file}
            eventId={eventId}
            onFileChange={onFileChange}
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
          />
        </div>
      </div>
    );
  }

  // Vista de lista
  return (
    <div
      className="group flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Icono del archivo */}
      <div className="flex-shrink-0 mr-3">
        {isFolder ? (
          <Folder className="h-6 w-6 text-blue-500" />
        ) : (
          <div className="relative">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt={file.name}
                className="h-6 w-6 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const span = e.currentTarget.nextSibling as HTMLElement;
                  if (span) span.style.display = 'block';
                }}
              />
            ) : null}
            <span className={previewUrl ? 'hidden' : ''}>
              <FileText className="h-6 w-6 text-gray-500" />
            </span>
          </div>
        )}
      </div>
      
      {/* Información del archivo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {/* Fecha de modificación */}
              {file.modifiedTime && (
                <span>{GoogleDriveService.formatDate(file.modifiedTime)}</span>
              )}
              
              {/* Tamaño del archivo */}
              {!isFolder && file.size && (
                <span>• {GoogleDriveService.formatFileSize(file.size)}</span>
              )}
              
              {/* Indicador de ownership */}
              {file.ownedByMe !== undefined && (
                <span>• {file.ownedByMe ? '👑 Tuyo' : '👁️ Compartido'}</span>
              )}
            </div>
          </div>
          
          {/* Menú de acciones */}
          <div 
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se propague al card
              console.log('🎯 Dropdown container clicked (list view)');
            }}
            data-dropdown-trigger="true"
          >
            <FileActionDropdown
              file={file}
              eventId={eventId}
              onFileChange={onFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};