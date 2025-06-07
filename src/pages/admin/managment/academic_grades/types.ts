export interface AcademicGrade {
    ID: string
    name: string
    created_at: string
    updated_at: string
    deleted_at: string | null
  }
  
  export interface CreateAcademicGradeRequest {
    name: string
  }
  
  export interface UpdateAcademicGradeRequest {
    name?: string
  }
  
  export interface AcademicGradeApiResponse {
    data: AcademicGrade[]
    message?: string
    success: boolean
  }
  
  export interface SingleAcademicGradeApiResponse {
    data: AcademicGrade
    message?: string
    success: boolean
  }
  
  export const INITIAL_ACADEMIC_GRADE_FORM_DATA = {
    name: '',
  }
  
  export const ACADEMIC_LEVELS = [
    { value: 'superior', label: 'Superior' },
    { value: 'universitario', label: 'Universitario' },
    { value: 'postgrado', label: 'Postgrado' }
  ] as const;