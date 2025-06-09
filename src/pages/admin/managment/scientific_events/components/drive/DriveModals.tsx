// components/drive/DriveModals.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GoogleDriveService } from '../../services/googleDriveService';

interface CreateFolderModalProps {
  isOpen: boolean;
  folderName: string;
  onClose: () => void;
  onFolderNameChange: (name: string) => void;
  onCreateFolder: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  folderName,
  onClose,
  onFolderNameChange,
  onCreateFolder
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCreateFolder();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nueva Carpeta</DialogTitle>
          <DialogDescription>
            Crea una nueva carpeta en Google Drive para organizar tus archivos.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName">Nombre de la carpeta</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => onFolderNameChange(e.target.value)}
              placeholder="Nombre de la carpeta"
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onCreateFolder} disabled={!folderName.trim()}>
            Crear Carpeta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface UploadFilesModalProps {
  isOpen: boolean;
  selectedFiles: File[];
  onClose: () => void;
  onFilesChange: (files: File[]) => void;
  onUploadFiles: () => void;
}

export const UploadFilesModal: React.FC<UploadFilesModalProps> = ({
  isOpen,
  selectedFiles,
  onClose,
  onFilesChange,
  onUploadFiles
}) => {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file => {
        if (!GoogleDriveService.isValidFileType(file)) {
          // Toast de error será manejado en el componente padre
          return false;
        }
        if (!GoogleDriveService.isValidFileSize(file)) {
          // Toast de error será manejado en el componente padre
          return false;
        }
        return true;
      });

      onFilesChange(validFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir Archivos</DialogTitle>
          <DialogDescription>
            Selecciona los archivos que deseas subir a Google Drive.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileInput">Seleccionar archivos</Label>
            <Input
              id="fileInput"
              type="file"
              multiple
              onChange={handleFileInputChange}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            />
            <p className="text-xs text-gray-500">
              Máximo 100MB por archivo. Formatos permitidos: imágenes, PDF, Word, Excel, PowerPoint, texto, ZIP
            </p>
          </div>
          
          {/* Lista de archivos seleccionados */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Archivos seleccionados ({selectedFiles.length}):</Label>
              <div className="max-h-32 overflow-y-auto space-y-1 border rounded-md p-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex-1 min-w-0">
                      <span className="truncate block" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-gray-500">
                        {GoogleDriveService.formatFileSize(file.size)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onUploadFiles} 
            disabled={selectedFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Subir {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Archivo{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};