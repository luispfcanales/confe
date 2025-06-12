// validation.ts
import { UserFormData, FormErrors } from './types'
import { PASSWORD_MIN_LENGTH } from './constants'

export const validateForm = (formData: UserFormData): FormErrors => {
  const errors: FormErrors = {}

  // Validación de campos requeridos
  if (!formData.firstName.trim()) {
    errors.firstName = 'Nombres es requerido'
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Apellidos es requerido'
  }

  if (!formData.identityDocument.trim()) {
    errors.identityDocument = 'Documento de identidad es requerido'
  } else if (!isValidIdentityDocument(formData.identityDocument)) {
    errors.identityDocument = 'Documento de identidad debe ser válido'
  }

  if (!formData.email.trim()) {
    errors.email = 'Email es requerido'
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email debe ser válido'
  }

  if (!formData.phoneNumber.trim()) {
    errors.phoneNumber = 'Número de teléfono es requerido'
  } else if (!isValidPhoneNumber(formData.phoneNumber)) {
    errors.phoneNumber = 'Número de teléfono debe ser válido'
  }

  if (!formData.address.trim()) {
    errors.address = 'Dirección es requerida'
  }

  if (!formData.documentTypeId) {
    errors.documentTypeId = 'Tipo de documento es requerido'
  }

  if (!formData.id_investigator_types) {
    errors.id_investigator_types = 'Tipo de investigador es requerido'
  }

  if (!formData.type_participation) {
    errors.type_participation = 'Tipo de participante es requerido'
  }

  if (!formData.faculty) {
    errors.faculty = 'Facultad es requerida'
  }

  if (!formData.academic_department) {
    errors.academic_department = 'Departamento académico es requerido'
  }

  if (!formData.password) {
    errors.password = 'Contraseña es requerida'
  } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Contraseña debe contener al menos una letra y un número'
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirmación de contraseña es requerida'
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  return errors
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhoneNumber = (phone: string): boolean => {
  // Validación para números de teléfono peruanos (9 dígitos)
  const phoneRegex = /^[0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

const isValidIdentityDocument = (document: string): boolean => {
  // Validación para DNI peruano (8 dígitos)
  const dniRegex = /^[0-9]{8}$/
  return dniRegex.test(document.replace(/\s/g, ''))
}

const isValidPassword = (password: string): boolean => {
  // Al menos una letra y un número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/
  return passwordRegex.test(password)
}