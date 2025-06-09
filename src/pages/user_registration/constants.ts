import { DocumentType } from './types'

export const DOCUMENT_TYPES: DocumentType[] = [
  { ID: '1', name: 'DNI' },
  { ID: '2', name: 'Pasaporte' },
  { ID: '3', name: 'Carnet de Extranjería' }
]

export const INITIAL_FORM_DATA = {
  documentTypeId: '',
  roleId: '',
  firtsName: '',
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
  type_participation:  '',     
	faculty: '',  
	academic_department: '' 
}

export const PASSWORD_MIN_LENGTH = 6