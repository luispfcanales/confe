// userService.ts
import { API_URL } from '@/constants/api'
import { UserFormData } from './types'
import { API_ENDPOINTS } from './constants'
import { toast } from 'sonner'

export const registerUser = async (formData: UserFormData): Promise<void> => {
  try {
    // Mapear los datos del formulario al formato esperado por el backend
    const userData = {
      // Datos del usuario
      first_name: formData.firstName, // ✅ Corregido: era 'firtsName'
      last_name: formData.lastName,
      identity_document: formData.identityDocument,
      address: formData.address,
      email: formData.email,
      sex: formData.sex,
      password: formData.password,
      is_internal: formData.isInternal,
      
      // IDs de referencia (asegurate que estos campos existan en tu UserFormData)
      document_type_id: formData.documentTypeId,
      investigator_type_id: formData.id_investigator_types,
      academic_grade_id: formData.id_academic_grade,
      
      // Campos adicionales
      type_participation: formData.type_participation,
      academic_departament_id: formData.academic_department,
      
      // ❌ Removido: faculty_id no está en el modelo de Go
      // faculty_id: formData.faculty,
    }

    // Validar que todos los campos requeridos estén presentes
    console.log('Datos a enviar:', userData)

    const response = await fetch(`${API_URL}${API_ENDPOINTS.CREATE_USER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error del servidor:', errorData.data)
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
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