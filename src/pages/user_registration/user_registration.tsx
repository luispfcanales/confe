// user_registration.tsx (Componente principal)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { UserIcon, ArrowLeft } from 'lucide-react'
import { UserFormData, FormErrors } from './types'
import { INITIAL_FORM_DATA } from './constants'
import { validateForm } from './validation'
import { registerUser } from './userService'
import UserConfigSection from './components/UserConfigSection'
import PersonalInfoSection from './components/PersonalInfoSection'
import AccessConfigSection from './components/AccessConfigSection'

const UserRegistration = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar formulario
    const validationErrors = validateForm(formData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    
    try {
      await registerUser(formData)
      
      // Resetear formulario después del registro exitoso
      setFormData(INITIAL_FORM_DATA)
      setErrors({})
      
      // Mostrar mensaje de éxito y redirigir al login
      console.log('Registro exitoso')
      
      // Redirigir al login después del registro exitoso
      navigate('/login')
      
    } catch (error) {
      console.error('Error en el registro:', error)
      // El error ya se muestra en el toast desde userService
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData(INITIAL_FORM_DATA)
    setErrors({})
  }

  const handleGoBack = () => {
    navigate("/") // Regresa a la página anterior
  }
// <div className="min-h-screen bg-gray-500 py-8">
  return (
    // <div className="min-h-screen bg-gray-50 py-8">
    
    <div className="min-h-screen py-8" style={{
      backgroundColor: 'white',
      backgroundImage: 'radial-gradient(circle,rgb(25, 34, 53) 0.9px, transparent 0.9px)',
      backgroundSize: '12px 12px'
    }}>
    
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserIcon className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Registro de Usuario</h1>
              </div>
              
              {/* Botón para regresar */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleGoBack}
                className="text-white hover:bg-blue-700 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Regresar</span>
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Configuración de Usuario */}
            <UserConfigSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            {/* Información Personal */}
            <PersonalInfoSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            {/* Configuración de Acceso */}
            <AccessConfigSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            {/* Botones de acción */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8"
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registrando...</span>
                  </div>
                ) : (
                  'Registrar Usuario'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserRegistration