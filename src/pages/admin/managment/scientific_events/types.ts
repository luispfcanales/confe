// types.ts
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
  }
  
  export interface EventFormData {
    name: string;
    description: string;
    year: number;
    start_date: string;
    end_date: string;
    location: string;
    is_active: boolean;
    id_path_drive_file?: string;
  }
  
  export type FilterStatus = 'all' | 'active' | 'inactive';
  
  export interface EventCardProps {
    event: ScientificEvent;
    onEdit: (event: ScientificEvent) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
  }
  
  export interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormData) => void;
    editingEvent?: ScientificEvent | null;
  }
  
  export interface EventFiltersProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterStatus: FilterStatus;
    onFilterChange: (status: FilterStatus) => void;
  }

  export interface ScientificEventApiResponse {
    success: boolean;
    data: ScientificEvent[];
    message?: string;
  }
  
  export interface SingleScientificEventApiResponse {
    success: boolean;
    data: ScientificEvent;
    message?: string;
  }