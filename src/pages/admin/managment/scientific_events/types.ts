
// types.ts
export interface ScientificEvent {
  ID: string;
  name: string;
  description: string;
  location: string;
  year: number;
  start_date?: string;
  end_date?: string;
  submission_deadline?: string;
  id_path_drive_file?: string;
  id_path_drive_file_poster?: string;
  id_path_drive_file_gallery?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  name: string;
  description: string;
  location: string;
  year: number;
  start_date: string;
  end_date: string;
  submission_deadline: string;
  id_path_drive_file?: string;
  id_path_drive_file_poster?: string;
  id_path_drive_file_gallery?: string;
  is_active: boolean;
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