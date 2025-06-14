// types.ts
export interface DocumentType {
  ID: string
  name: string
}

export interface Faculty {
  ID: string
  name: string
  description?: string
  is_active: boolean
  academic_departament?: AcademicDepartment[]
}

export interface AcademicDepartment {
  ID: string
  name: string
  description?: string
  is_active: boolean
}

export interface InvestigatorType {
  ID: string
  name: string
}

export interface AcademicGrade {
  ID: string
  name: string
}

export interface ParticipationType {
  ID: string
  name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ApiResponseParticipationTypes {
  success: boolean
  message: string
  data: {
    participation_Types: ParticipationType[],
    count: number
  }
}

export interface UserFormData {
  documentTypeId: string
  firstName: string
  lastName: string
  identityDocument: string
  address: string
  email: string
  phoneNumber: string
  sex: number
  password: string
  confirmPassword: string
  isActive: boolean
  isInternal: boolean
  url_orcid: string
  id_investigator_types: string
  id_academic_grade: string
  faculty: string
  academic_department: string
}

export type FormErrors = {
  [key in keyof UserFormData]?: string
}