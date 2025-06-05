export interface DocumentType {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface User {
  id: string;
  role_id: string;
  document_type_id: string;
  password: string;
  first_name: string;
  last_name: string;
  dni: string;
  address?: string;
  email?: string;
  phone?: string;
  sex: number;
  is_active: boolean;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AcademicGrade {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InvestigatorType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Investigator {
  id: string;
  id_user: string;
  is_principal: boolean;
  url_orcid: string;
  id_investigator_types: string;
  id_academic_grade: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InvestigatorGroup {
  id: string;
  id_user: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SubmissionStatus {
  id: string;
  name: string;
  description?: string;
  order_sequence: number;
  color_code?: string;
  created_at: string;
  updated_at: string;
}

export interface ScientificEvent {
  id: string;
  year: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Poster {
  id: string;
  id_investigator_group: string;
  title: string;
  materials_and_methods: string;
  result_and_discussions: string;
  conclusions: string;
  bibliographic_references: string;
  filepath_url: string;
  id_submission_status: string;
  id_scientific_events: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SubmissionDeadline {
  id: string;
  template_id: string;
  submission_start_date: string;
  submission_deadline: string;
  results_date: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  photo_url: string;
  description?: string;
  is_cover_photo: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
