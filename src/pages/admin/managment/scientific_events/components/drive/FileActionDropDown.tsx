// components/drive/FileActionDropdown.tsx (Test version)
import React from 'react';
import { MoreHorizontal, Images, FileImage, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { GoogleDriveFile } from '../../driveFiles';
import { GoogleDriveService } from '../../services/googleDriveService';

interface FileActionDropdownProps {
  file: GoogleDriveFile;
  eventId: string;
  onFileChange: () => void;
  className?: string;
}

export const FileActionDropdown: React.FC<FileActionDropdownProps> = ({ 
  file, 
  eventId,
  onFileChange, 
  className 
}) => {
  const isFolder = GoogleDriveService.isFolder(file);

  const handleAssignToGallery = async () => {
    console.log('Assigning to -------:', eventId);
    console.log('Assigning to gallery:', file.ID);
    try {
      await GoogleDriveService.assignFolderToEventSection(eventId, file.ID, 'gallery');
      toast.success('Carpeta asignada a galería');
      onFileChange();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al asignar carpeta');
    }
  };

  const handleAssignToPosters = async () => {
    console.log('Assigning to posters:', file.name);
    try {
      await GoogleDriveService.assignFolderToEventSection(eventId, file.ID, 'posters');
      toast.success('Carpeta asignada a posters');
      onFileChange();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al asignar carpeta');
    }
  };

  const handleDelete = () => {
    console.log('Delete clicked for:', file.name);
    toast.info(`Eliminar ${file.name} (funcionalidad en desarrollo)`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 hover:bg-gray-100 ${className}`}
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔄 Button clicked for:', file.name);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => {
            console.log('🐛 Test item clicked for:', file.name);
            toast.success(`Test menu funcionando para: ${file.name}`);
          }}
        >
          🐛 Test Menu
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isFolder && (
          <>
            <DropdownMenuItem 
              onClick={handleAssignToGallery}
              className="text-green-600"
            >
              <Images className="mr-2 h-4 w-4" />
              Asignar a Galería
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleAssignToPosters}
              className="text-purple-600"
            >
              <FileImage className="mr-2 h-4 w-4" />
              Asignar a Posters
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem disabled className="text-xs text-gray-500">
          ID: {file.ID.substring(0, 8)}...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};