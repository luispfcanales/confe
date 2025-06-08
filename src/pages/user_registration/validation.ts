import { UserFormData, FormErrors } from './types'
import { PASSWORD_MIN_LENGTH } from './constants'

export const validateForm = (formData: UserFormData): FormErrors => {
  const errors: FormErrors = {}

  // Validación de campos requeridos
  if (!formData.firtsName.trim()) {
    errors.firtsName = 'Nombres es requerido'
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Apellidos es requerido'
  }

  if (!formData.identityDocument.trim()) {
    errors.identityDocument = 'Documento de identidad es requerido'
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

  if (!formData.password) {
    errors.password = 'Contraseña es requerida'
  } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  return errors
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhoneNumber = (phone: string): boolean => {
  // Validación básica para números de teléfono (9 dígitos para Perú)
  const phoneRegex = /^[0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}