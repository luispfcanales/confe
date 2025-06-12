// services/googleDriveService.ts
import { 
    GoogleDriveFile, 
    DriveFolder,
    DriveFilesResponse,
    DriveFolderResponse, 
    CreateFolderRequest,
    UploadFileRequest,
    MIME_TYPE_ICONS,
    GOOGLE_DRIVE_FOLDER_MIME,
    normalizeFilesResponse,
    FilePermissionInfo,
    DeleteResult
  } from '../driveFiles';
  import { ScientificEvent } from '../types';
import { API_URL } from '@/constants/api';
  
  const API_BASE_URL = API_URL;
  
  export class GoogleDriveService {
    private static baseUrl = `${API_BASE_URL}/api/drive`;
  
    // ========== MÉTODOS EXISTENTES ==========
  
    // Obtener archivos de una carpeta específica de Google Drive
    static async getDriveFiles(folderId: string): Promise<GoogleDriveFile[]> {
      try {
        const response = await fetch(`${this.baseUrl}/files?parentID=${folderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DriveFilesResponse = await response.json();
        return normalizeFilesResponse(data);
      } catch (error) {
        console.error('Error fetching Drive files:', error);
        return [];
      }
    }
  
    static async getParentDriveFolder(folderId: string): Promise<DriveFolder> {
      try {
        const responseFolder = await fetch(`${this.baseUrl}/folders/${folderId}`);
        if (!responseFolder.ok) {
          throw new Error(`HTTP error! status: ${responseFolder.status}`);
        }
        const folder: DriveFolderResponse = await responseFolder.json();
        return folder.data;
      } catch (error) {
        console.error('Error fetching Drive files:', error);
        throw error;
      }
    }
  
    // Crear una nueva carpeta en Google Drive
    static async createFolder(folderData: CreateFolderRequest): Promise<GoogleDriveFile> {
      try {
        const response = await fetch(`${this.baseUrl}/folders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(folderData),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
      }
    }
  
    // Subir archivos a Google Drive
    static async uploadFiles(uploadData: UploadFileRequest): Promise<GoogleDriveFile[]> {
      try {
        const formData = new FormData();
        formData.append('parent_id', uploadData.parent_id);
        
        uploadData.files.forEach((file) => {
          formData.append(`files`, file);
        });
  
        const response = await fetch(`${this.baseUrl}/files/upload`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
      }
    }
  
    // ========== MÉTODOS DE ELIMINACIÓN ==========
  
    // Verificar permisos de un archivo
    static async checkFilePermissions(fileId: string): Promise<FilePermissionInfo> {
      try {
        const response = await fetch(`${this.baseUrl}/files/${fileId}/permissions`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error checking permissions for file ${fileId}:`, error);
        throw error;
      }
    }
  
    // Eliminar archivo con estrategia específica
    static async deleteFileWithStrategy(fileId: string, strategy: 'safe' | 'trash' | 'force' = 'safe'): Promise<DeleteResult> {
      try {
        const response = await fetch(`${this.baseUrl}/files/${fileId}?strategy=${strategy}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error deleting file ${fileId} with strategy ${strategy}:`, error);
        throw error;
      }
    }
  
    // Mover archivo a papelera específicamente
    static async moveToTrash(fileId: string): Promise<DeleteResult> {
      try {
        const response = await fetch(`${this.baseUrl}/files/${fileId}/trash`, {
          method: 'POST',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error moving file ${fileId} to trash:`, error);
        throw error;
      }
    }
  
    // Restaurar archivo desde papelera
    static async restoreFromTrash(fileId: string): Promise<GoogleDriveFile> {
      try {
        const response = await fetch(`${this.baseUrl}/files/${fileId}/restore`, {
          method: 'POST',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error restoring file ${fileId} from trash:`, error);
        throw error;
      }
    }
  
    // ========== NUEVO: ASIGNACIÓN DE CARPETAS ==========
  
    // Asignar carpeta a una sección específica del evento (galería o posters)
    static async assignFolderToEventSection(
      eventId: string, 
      folderId: string, 
      sectionType: 'gallery' | 'posters'
    ): Promise<{ success: boolean; message: string }> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/scientific-events/${eventId}/assign-folder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folder_id: folderId,
            section_type: sectionType
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return {
          success: data.success || true,
          message: data.message || `Carpeta asignada exitosamente a ${sectionType}`
        };
      } catch (error) {
        console.error(`Error assigning folder ${folderId} to ${sectionType} for event ${eventId}:`, error);
        throw error;
      }
    }
  
    // Método de eliminación original (para compatibilidad)
    static async deleteFile(fileId: string): Promise<void> {
      try {
        await this.deleteFileWithStrategy(fileId, 'safe');
      } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error);
        throw error;
      }
    }
  
    // ========== UTILIDADES ==========
  
    // Descargar archivo desde Google Drive
    static async downloadFile(file: GoogleDriveFile): Promise<void> {
      try {
        if (file.downloadLink) {
          window.open(file.downloadLink, '_blank');
        } else if (file.webviewLink) {
          window.open(file.webviewLink, '_blank');
        } else {
          const response = await fetch(`${this.baseUrl}/download/${file.ID}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      } catch (error) {
        console.error(`Error downloading file ${file.ID}:`, error);
        throw error;
      }
    }
  
    // Verificar si un archivo puede ser eliminado por el usuario actual
    static async canUserDeleteFile(fileId: string): Promise<boolean> {
      try {
        const permissions = await this.checkFilePermissions(fileId);
        return permissions.canDelete || permissions.ownedByMe;
      } catch (error) {
        console.warn(`Could not check permissions for file ${fileId}:`, error);
        return false;
      }
    }
  
    // Utilidades existentes
    static getFileIcon(mimeType: string): string {
      return MIME_TYPE_ICONS[mimeType as keyof typeof MIME_TYPE_ICONS] || '📄';
    }
  
    static isFolder(file: GoogleDriveFile): boolean {
      return file.mimeType === GOOGLE_DRIVE_FOLDER_MIME;
    }
  
    static formatFileSize(bytes?: number): string {
      if (!bytes || bytes === 0) return '';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  
    static formatDate(dateString?: string): string {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '';
      }
    }
  
    static getPreviewUrl(file: GoogleDriveFile): string | null {
      if (file.thumbnailLink) {
        return file.thumbnailLink;
      }
      
      if (file.mimeType.startsWith('image/') && file.webviewLink) {
        return file.webviewLink;
      }
      
      return null;
    }
  
    // Obtener evento por ID (si no tienes el método)
    static async getEventById(id: string): Promise<ScientificEvent> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/scientific-events/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success && data.data) {
          return data.data;
        } else {
          throw new Error(data.message || 'No se pudo obtener el evento');
        }
      } catch (error) {
        console.error(`Error fetching event ${id}:`, error);
        throw error;
      }
    }
  
    static isValidFileType(file: File): boolean {
      const allowedTypes = [
        'image/', 'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument',
        'application/vnd.ms-', 'text/plain', 'application/zip'
      ];
      
      return allowedTypes.some(type => file.type.startsWith(type));
    }
  
    static isValidFileSize(file: File, maxSize: number = 100 * 1024 * 1024): boolean {
      return file.size <= maxSize;
    }
  }