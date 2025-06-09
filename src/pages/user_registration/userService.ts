// userService.ts
import { API_URL } from '@/constants/api'
import { UserFormData } from './types'
import { toast } from 'sonner'

export const registerUser = async (formData: UserFormData): Promise<void> => {
  // Simular llamada a API
  const userData = {
    document_type_id: formData.documentTypeId,
    first_name: formData.firtsName,
    last_name: formData.lastName,
    identity_document: formData.identityDocument,
    address: formData.address,
    email: formData.email,
    // phone_number: formData.phoneNumber,
    sex: formData.sex,
    password: formData.password, // En producción, hashear antes de enviar
    // is_active: formData.isActive,
    is_internal: formData.isInternal,
    investigator_type_id: formData.id_investigator_types,
    academic_grade_id: formData.id_academic_grade,
    type_participation: formData.type_participation,
    academic_departament: formData.academic_department,
    faculty: formData.faculty,
  }

  // Aquí harías la llamada real a tu API
  const response = await fetch(`${API_URL}/api/users/create-investigator`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })

  if (!response.ok) {
    throw new Error('Error al registrar usuario')
  }
  toast.error('Usuario registrado existosamente')

  console.log('Datos a enviar:', userData)
}