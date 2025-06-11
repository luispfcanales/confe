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
  value: string
}

export interface UserFormData {
  documentTypeId: string
  firtsName: string
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
  id_investigator_types: string
  id_academic_grade: string
  type_participation: string
  faculty: string
  academic_department: string
}

export type FormErrors = {
  [key in keyof UserFormData]?: string
}