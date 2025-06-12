// src/types/events.ts
export interface ApiEvent {
    ID: string;
    year: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    id_path_drive_file: string;
    id_path_drive_file_posters: string;
    id_path_drive_file_gallery: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface ApiResponse {
    data: ApiEvent[];
    success: boolean;
  }
  
  // Interfaz adaptada para el componente (transformada desde la API)
  export interface EventForComponent {
    ID: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    status: 'open' | 'closed' | 'coming_soon';
    isActive: boolean;
    year: number;
    // Datos calculados o por defecto
    deadline: string;
    maxParticipants: number;
    currentParticipants: number;
    image: string;
    categories: string[];
    requirements: Array<{
      text: string;
      link?: {
        url: string;
        label: string;
      };
    }>;
  }