// userService.ts
import { UserFormData } from './types'

export const registerUser = async (formData: UserFormData): Promise<void> => {
  // Simular llamada a API
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const userData = {
    document_type_id: formData.documentTypeId,
    first_name: formData.firstName,
    last_name: formData.lastName,
    identity_document: formData.identityDocument,
    address: formData.address,
    email: formData.email,
    phone_number: formData.phoneNumber,
    sex: formData.sex,
    password: formData.password, // En producción, hashear antes de enviar
    is_active: formData.isActive,
    is_internal: formData.isInternal
  }
  
  // Aquí harías la llamada real a tu API
  // const response = await fetch(`${API_URL}/api/users`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(userData)
  // })
  
  // if (!response.ok) {
  //   throw new Error('Error al registrar usuario')
  // }
  
  console.log('Datos a enviar:', userData)
}