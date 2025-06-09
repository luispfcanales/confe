// components/drive/FileActionDropdown.tsx
import React, { useState, useEffect } from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  Trash2,
  Archive,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { GoogleDriveFile, FilePermissionInfo } from '../../driveFiles';
import { GoogleDriveService } from '../../services/googleDriveService';

interface FileActionDropdownProps {
  file: GoogleDriveFile;
  onFileChange: () => void; // Callback para refrescar la lista de archivos
  className?: string;
}

export const FileActionDropdown: React.FC<FileActionDropdownProps> = ({ 
  file, 
  onFileChange, 
  className 
}) => {
  const [permissions, setPermissions] = useState<FilePermissionInfo | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    strategy: 'safe' | 'trash' | 'force';
  }>({
    isOpen: false,
    strategy: 'safe'
  });

  const isFolder = GoogleDriveService.isFolder(file);

  // Cargar permisos al montar el componente
  useEffect(() => {
    const loadPermissions = async () => {
      if (!isFolder) {
        try {
          const filePermissions = await GoogleDriveService.checkFilePermissions(file.ID);
          setPermissions(filePermissions);
        } catch (error) {
          // Si no se pueden obtener permisos, asumir permisos básicos
          setPermissions({
            fileId: file.ID,
            fileName: file.name,
            mimeType: file.mimeType,
            ownedByMe: file.ownedByMe || false,
            canDelete: file.ownedByMe || false,
            canEdit: file.ownedByMe || false,
            canView: true
          });
        }
      } else {
        // Para carpetas, asumir permisos completos
        setPermissions({
          fileId: file.ID,
          fileName: file.name,
          mimeType: file.mimeType,
          ownedByMe: true,
          canDelete: true,
          canEdit: true,
          canView: true
        });
      }
    };

    loadPermissions();
  }, [file.ID, file.ownedByMe, file.mimeType, file.name, isFolder]);

  const handleViewFile = () => {
    if (file.webviewLink) {
      window.open(file.webviewLink, '_blank');
    }
  };

  const handleDownloadFile = async () => {
    try {
      await GoogleDriveService.downloadFile(file);
      toast.success('Descarga iniciada', {
        description: `Descargando "${file.name}"...`,
        duration: 3000,
      });
    } catch (error) {
      toast.error('Error al descargar', {
        description: 'No se pudo descargar el archivo.',
      });
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteRequest = (strategy: 'safe' | 'trash' | 'force') => {
    setDeleteConfirmation({
      isOpen: true,
      strategy
    });
  };

  const executeDelete = async () => {
    const { strategy } = deleteConfirmation;
    
    try {
      const loadingToastId = toast.loading(
        strategy === 'trash' ? 'Moviendo a papelera...' : 'Eliminando archivo...'
      );

      let result;
      
      if (strategy === 'trash') {
        // Usar endpoint específico de papelera
        result = await GoogleDriveService.moveToTrash(file.ID);
      } else {
        // Usar eliminación con estrategia
        result = await GoogleDriveService.deleteFileWithStrategy(file.ID, strategy);
      }
      
      toast.dismiss(loadingToastId);
      
      // Mensajes específicos según la acción realizada
      switch (result.action) {
        case 'moved_to_trash':
          toast.success('Archivo movido a papelera', {
            description: `"${file.name}" se encuentra ahora en la papelera de Google Drive.`,
            action: {
              label: 'Deshacer',
              onClick: () => handleRestoreFile()
            }
          });
          break;
        case 'safely_deleted':
        case 'force_deleted':
          toast.success('Archivo eliminado exitosamente', {
            description: `"${file.name}" se ha eliminado permanentemente.`,
          });
          break;
        default:
          toast.success('Operación completada', {
            description: result.message || 'El archivo se ha procesado correctamente.',
          });
      }
      
      // Cerrar modal y refrescar lista
      setDeleteConfirmation({ isOpen: false, strategy: 'safe' });
      onFileChange();
      
    } catch (error) {
      toast.dismiss();
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Manejar errores específicos con opciones de recuperación
      if (errorMessage.includes('Insufficient permissions') || errorMessage.includes('insufficientFilePermissions')) {
        toast.error('Sin permisos suficientes', {
          description: 'No tienes permisos para eliminar este archivo.',
          action: strategy !== 'trash' ? {
            label: 'Mover a papelera',
            onClick: () => handleDeleteRequest('trash')
          } : undefined,
        });
      } else {
        toast.error('Error al eliminar', {
          description: errorMessage,
        });
      }
      
      console.error('Error deleting file:', error);
    }
  };

  const handleRestoreFile = async () => {
    try {
      const loadingToastId = toast.loading('Restaurando archivo...');
      
      await GoogleDriveService.restoreFromTrash(file.ID);
      
      toast.dismiss(loadingToastId);
      toast.success('Archivo restaurado', {
        description: `"${file.name}" se ha restaurado desde la papelera.`,
      });
      
      onFileChange();
    } catch (error) {
      toast.dismiss();
      toast.error('Error al restaurar', {
        description: 'No se pudo restaurar el archivo desde la papelera.',
      });
      console.error('Error restoring file:', error);
    }
  };

  const canDelete = permissions?.canDelete || permissions?.ownedByMe || false;
  //const canEdit = permissions?.canEdit || permissions?.ownedByMe || false;

  return (
    <>
      <DropdownMenu>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <DropdownMenuContent>
          {/* Ver archivo */}
          {!isFolder && file.webviewLink && (
            <DropdownMenuItem onClick={handleViewFile}>
              <Eye className="mr-2 h-4 w-4" />
              Ver en Drive
            </DropdownMenuItem>
          )}
          
          {/* Descargar archivo */}
          {!isFolder && (
            <DropdownMenuItem onClick={handleDownloadFile}>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          {/* Opciones de eliminación basadas en permisos */}
          {canDelete ? (
            <>
              <DropdownMenuItem 
                onClick={() => handleDeleteRequest('safe')}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
              
              {!isFolder && (
                <DropdownMenuItem 
                  onClick={() => handleDeleteRequest('trash')}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Mover a papelera
                </DropdownMenuItem>
              )}
            </>
          ) : (
            <DropdownMenuItem disabled className="text-gray-400">
              <Trash2 className="mr-2 h-4 w-4" />
              Sin permisos para eliminar
            </DropdownMenuItem>
          )}
          
          {/* Mostrar información de ownership */}
          {permissions && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-xs">
                {permissions.ownedByMe ? '👑 Propietario' : '👁️ Solo lectura'}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog 
        open={deleteConfirmation.isOpen} 
        onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {deleteConfirmation.strategy === 'trash' ? (
                <Archive className="h-5 w-5 text-orange-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              {deleteConfirmation.strategy === 'trash' ? 'Mover a papelera' : 'Eliminar archivo'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmation.strategy === 'trash' ? (
                <>
                  ¿Estás seguro de que quieres mover "<strong>{file.name}</strong>" a la papelera? 
                  Podrás recuperarlo desde la papelera de Google Drive.
                </>
              ) : (
                <>
                  ¿Estás seguro de que quieres eliminar "<strong>{file.name}</strong>"? 
                  Esta acción puede ser permanente.
                </>
              )}
              
              {permissions && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">
                    {permissions.ownedByMe 
                      ? '👑 Eres el propietario de este archivo' 
                      : '⚠️ No eres el propietario - permisos limitados'
                    }
                  </span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDelete}
              className={
                deleteConfirmation.strategy === 'trash' 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {deleteConfirmation.strategy === 'trash' ? 'Mover a papelera' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};