import { DocumentType } from './types'

export const DOCUMENT_TYPES: DocumentType[] = [
  { id: '1', name: 'DNI' },
  { id: '2', name: 'Pasaporte' },
  { id: '3', name: 'Carnet de Extranjería' }
]

export const INITIAL_FORM_DATA = {
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
  isInternal: true
}

export const PASSWORD_MIN_LENGTH = 6