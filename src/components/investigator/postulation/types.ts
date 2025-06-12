// src/components/investigator/postulation/types.ts
export interface Event {
  id: string;
  title: string;
  deadline: string;
}

export interface UserFromStorage {
  ID: string;
  first_name: string;
  last_name: string;
  email: string;
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

export interface CoInvestigator {
  id: string;
  dni: string;
  fullName: string;
  email: string;
  institution: string;
  academicGrade: string;
  investigatorType: string;
  isLoading: boolean;
  notFound: boolean;
}

export interface PostulationFormData {
  posterTitle: string;
  abstractText: string;
  keywords: string;
  researchArea: string;
  coInvestigators: CoInvestigator[];
  posterFile: File | null;
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