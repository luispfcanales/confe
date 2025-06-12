// types/driveFiles.ts (actualización)
export interface GoogleDriveFile {
  ID: string;
  name: string;
  mimeType: string;
  size?: number;
  createdTime?: string;
  modifiedTime?: string;
  description?: string;
  webviewLink?: string;
  downloadLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  ownedByMe?: boolean;
  capabilities?: DriveCapabilities;
}

export interface DriveCapabilities {
  canEdit?: boolean;
  canDelete?: boolean;
  canShare?: boolean;
  canCopy?: boolean;
  canDownload?: boolean;
}

export interface DriveFolder {
  ID: string;
  name: string;
  description: string;
  parent_id: string;
}

// Extender tu tipo existente para incluir el id_path_drive_file y campos de galería/posters
export interface ScientificEventWithDrive {
  ID: string;
  year: number;
  name: string;
  description: string;
  start_date?: string;
  end_date?: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  id_path_drive_file?: string; // Campo de Google Drive principal
  gallery_folder_id?: string; // Campo para carpeta de galería
  posters_folder_id?: string; // Campo para carpeta de posters
  parents?: string[];
}

// Tipo base del evento científico (para el servicio)
export interface ScientificEvent {
  ID: string;
  year: number;
  name: string;
  description: string;
  start_date?: string;
  end_date?: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  id_path_drive_file?: string;
  gallery_folder_id?: string; // Nuevo campo
  posters_folder_id?: string; // Nuevo campo
}

export interface DriveFilesResponse {
  data: GoogleDriveFile[] | GoogleDriveFile | null; 
  success: boolean;
  message?: string;
}

export interface DriveFolderResponse {
  data: DriveFolder; 
  success: boolean;
}

export interface CreateFolderRequest {
  name: string;
  parent_id: string;
}

export interface UploadFileRequest {
  parent_id: string;
  files: File[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'folder' | 'root';
}

// Interfaces para manejo de permisos y eliminación
export interface FilePermissionInfo {
  fileId: string;
  fileName: string;
  mimeType: string;
  ownedByMe: boolean;
  canDelete: boolean;
  canEdit: boolean;
  canView: boolean;
}

export interface DeleteResult {
  success: boolean;
  action: string; // "deleted", "moved_to_trash", "failed"
  message: string;
  fileId: string;
  fileName: string;
}

// Nuevo interface para la respuesta de asignación de carpetas
export interface FolderAssignmentResult {
  success: boolean;
  message: string;
  event_id: string;
  folder_id: string;
  section_type: 'gallery' | 'posters';
  updated_at: string;
}

// Función helper para normalizar la respuesta
export function normalizeFilesResponse(response: DriveFilesResponse): GoogleDriveFile[] {
  if (!response.success || !response.data) {
    return [];
  }
  // Si es array, retornarlo directamente
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // Si es objeto, convertir a array
  if (typeof response.data === 'object') {
    return [response.data];
  }
  return [];
}

// Tipos MIME comunes para iconos
export const MIME_TYPE_ICONS = {
  'application/vnd.google-apps.folder': '📁',
  'application/vnd.google-apps.document': '📝',
  'application/vnd.google-apps.spreadsheet': '📊',
  'application/vnd.google-apps.presentation': '📊',
  'application/pdf': '📋',
  'image/jpeg': '🖼️',
  'image/png': '🖼️',
  'image/gif': '🖼️',
  'text/plain': '📄',
  'application/zip': '🗜️',
  'video/mp4': '🎥',
  'audio/mpeg': '🎵',
} as const;

export const GOOGLE_DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';
export const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB