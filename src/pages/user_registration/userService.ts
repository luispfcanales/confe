// userService.ts
import { API_URL } from '@/constants/api'
import { UserFormData } from './types'
import { API_ENDPOINTS } from './constants'
import { toast } from 'sonner'

export const registerUser = async (formData: UserFormData): Promise<void> => {
  try {
    const userData = {
      document_type_id: formData.documentTypeId,
      first_name: formData.firtsName,
      last_name: formData.lastName,
      identity_document: formData.identityDocument,
      address: formData.address,
      email: formData.email,
      sex: formData.sex,
      password: formData.password,
      is_internal: formData.isInternal,
      investigator_type_id: formData.id_investigator_types,
      academic_grade_id: formData.id_academic_grade,
      type_participation: formData.type_participation,
      academic_departament_id: formData.academic_department,
      faculty_id: formData.faculty,
    }

    const response = await fetch(`${API_URL}${API_ENDPOINTS.CREATE_USER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al registrar usuario')
    }

    const result = await response.json()
    toast.success('Usuario registrado exitosamente')
    console.log('Usuario registrado:', result)
    
    return result
  } catch (error) {
    console.error('Error en registro:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario'
    toast.error(errorMessage)
    throw error
  }
}