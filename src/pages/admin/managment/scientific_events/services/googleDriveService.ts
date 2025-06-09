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
  
  const API_BASE_URL = 'http://localhost:3000'; // Ajusta según tu configuración
  
  export class GoogleDriveService {
    private static baseUrl = `${API_BASE_URL}/api/drive`;
  
    // ========== MÉTODOS EXISTENTES (sin cambios) ==========
  
    // Obtener archivos de una carpeta específica de Google Drive
    static async getDriveFiles(folderId: string): Promise<GoogleDriveFile[]> {
      try {
        // DATOS MOCK TEMPORALES - Quitar cuando tengas el backend listo
        const USE_MOCK_DATA = false; // Cambiar a false cuando el backend esté listo
        
        if (USE_MOCK_DATA) {
          // Simular delay de API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Datos mock para probar la interfaz
          const mockFiles: GoogleDriveFile[] = [
            {
              ID: '2',
              name: 'Presentaciones',
              mimeType: 'application/vnd.google-apps.folder',
              createdTime: '2024-01-16T08:00:00Z',
              modifiedTime: '2024-01-16T08:00:00Z'
            },
          ];
          
          return mockFiles;
        }
        const response = await fetch(`${this.baseUrl}/files?parentID=${folderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DriveFilesResponse = await response.json();
        // Validar que la respuesta contenga un array válido
        return normalizeFilesResponse(data);
      } catch (error) {
        console.error('Error fetching Drive files:', error);
        return []; // Siempre retornar un array, incluso en caso de error
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
            console.log()
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
      }
    }
  
    // ========== NUEVOS MÉTODOS DE ELIMINACIÓN ==========
  
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
  
    // Método de eliminación original (para compatibilidad)
    static async deleteFile(fileId: string): Promise<void> {
      try {
        // Usar estrategia segura por defecto
        await this.deleteFileWithStrategy(fileId, 'safe');
      } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error);
        throw error;
      }
    }
  
    // ========== UTILIDADES (existentes) ==========
  
    // Descargar archivo desde Google Drive
    static async downloadFile(file: GoogleDriveFile): Promise<void> {
      try {
        if (file.downloadLink) {
          window.open(file.downloadLink, '_blank');
        } else if (file.webviewLink) {
          window.open(file.webviewLink, '_blank');
        } else {
          // Fallback: usar endpoint del backend
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
        return false; // Por seguridad, asumir que no se puede eliminar
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
  
    // Si no tienes el método getEventById, agrégalo:
    static async getEventById(id: string): Promise<ScientificEvent> {
      try {
        // DATOS MOCK TEMPORALES - Reemplazar cuando tengas el backend
        const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté listo
        
        if (USE_MOCK_DATA) {
          // Simular delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Evento mock con Google Drive
          const mockEvent: ScientificEvent = {
            ID: id,
            name: 'Conferencia Internacional de Investigación Científica',
            description: 'Evento anual que reúne a investigadores de todo el mundo para compartir avances en ciencia y tecnología.',
            year: 2024,
            start_date: '2024-06-15',
            end_date: '2024-06-18',
            location: 'Lima, Perú',
            is_active: true,
            created_at: '2024-01-15T08:00:00Z',
            updated_at: '2024-01-15T08:00:00Z',
            id_path_drive_file: '1BzGTP82ybSi-vhz1Y3_X3xqzsvXZ85y' // ID de Google Drive
          };
          
          return mockEvent;
        }
  
        // Implementación real del API
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