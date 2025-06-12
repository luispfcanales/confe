// constants.ts
import { UserFormData } from './types'
export const INITIAL_FORM_DATA: UserFormData = {
  documentTypeId: '',
  firstName: '',
  lastName: '',
  identityDocument: '',
  address: '',
  email: '',
  phoneNumber: '',
  sex: 1,
  password: '',
  confirmPassword: '',
  isActive: true,
  isInternal: true,
  id_investigator_types: '',
  id_academic_grade: '',
  type_participation: '',
  faculty: '',
  academic_department: ''
}

export const PASSWORD_MIN_LENGTH = 6

export const API_ENDPOINTS = {
  DOCUMENT_TYPES: '/api/document-types/all',
  INVESTIGATOR_TYPES: '/api/investigator-types',
  ACADEMIC_GRADES: '/api/academic-grades',
  FACULTIES: '/api/faculties',
  PARTICIPATION_TYPES: '/api/general/participation-types',
  CREATE_USER: '/api/users/create-investigator'
} as const