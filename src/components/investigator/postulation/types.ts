// src/components/investigator/postulation/types.ts
export interface Event {
  id: string;
  title: string;
  deadline: string;
  id_path_drive_file_posters: string;
}

export interface UserFromStorage {
  ID: string;
  first_name: string;
  last_name: string;
  email: string;
  identity_document: string;
  investigator_id: string;
  investigator: {
    academic_grade: {
      name: string;
    };
    investigator_type: {
      name: string;
    };
    academic_departament: {
      name: string;
      faculty: {
        name: string;
      };
    };
  };
}

export interface CoInvestigatorFromAPI {
  ID: string;
  first_name: string;
  last_name: string;
  email: string;
  identity_document: string;
  investigator: {
    academic_grade: {
      name: string;
    };
    investigator_type: {
      name: string;
    };
    academic_departament: {
      name: string;
      faculty: {
        name: string;
      };
    };
  };
}

export interface ResearchLine {
  key: number;
  value: string;
}

export interface ResearchLinesResponse {
  data: ResearchLine[];
  success: boolean;
}

export interface ParticipationType {
  ID: string;
  name: string;
  description: string;
  is_active: boolean;
}
export interface CoInvestigator {
  id: string;
  dni: string;
  fullName: string;
  email: string;
  institution: string;
  academicGrade: string;
  investigatorType: string;
  participant_type_id: string; // Cambiado a string para almacenar el ID
  participantTypeName?: string; // Nuevo campo para mostrar el nombre
  isLoading: boolean;
  notFound: boolean;
}

export interface PostulationFormData {
  posterTitle: string;
  researchArea: string;
  investigatorPrincipal: string;
  investigatorPrincipalParticipationTypeID: string;
  idUploadDirFile: string;
  coInvestigators: CoInvestigator[];
  posterFile: File | null;
  posterFilePPT: File | null;
  authorizationFile: File | null;
  acceptsTerms: boolean;
  acceptsDataProcessing: boolean;
}

export interface PostulationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

// Tipos adicionales para validaciones y estados
export interface ValidationError {
  field: string;
  message: string;
}

export interface StepValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export interface PostulationState {
  currentStep: number;
  isSubmitting: boolean;
  formData: PostulationFormData;
  validationErrors: Record<string, string>;
}

// Tipos para archivos
export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface FileValidation {
  isValid: boolean;
  error: string | null;
  size: number;
  type: string;
}

// Tipos para API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface SubmissionResponse {
  success: boolean;
  postulationId?: string;
  message: string;
  errors?: string[];
}

export interface HasRoleEventData {
  event_id: string;
  has_role: boolean;
  role: string;
  user_id: string;
}

export interface VerificationParticipationEventData {
  data: HasRoleEventData;
  message: string;
  success: boolean;
}