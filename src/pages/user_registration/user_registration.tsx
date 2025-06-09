// user_registration.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ArrowLeft, User } from 'lucide-react'

// Importar componentes y utilidades
import UserConfigSection from './components/UserConfigSection'
import PersonalInfoSection from './components/PersonalInfoSection'
import AccessConfigSection from './components/AccessConfigSection'
import { UserFormData, FormErrors } from './types'
import { INITIAL_FORM_DATA } from './constants'
import { validateForm } from './validation'
import { registerUser } from './userService'

const UserRegistration = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Por favor corrija los errores en el formulario')
      return
    }

    setLoading(true)
    
    try {
      await registerUser(formData)
      toast.success('Usuario registrado exitosamente')
      
      // Reset form
      setFormData(INITIAL_FORM_DATA)
      setErrors({})
      navigate('/login')
    } catch (error) {
      toast.error('Error al registrar usuario')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    // Aquí navegarías de vuelta
    navigate('/')
    console.log('Navegando hacia atrás...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-3xl flex items-center">
              <User className="w-8 h-8 mr-3" />
              Registro de Usuario
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              
              {/* Sección de Configuración de Usuario */}
              <UserConfigSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              {/* Sección de Información Personal */}
              <PersonalInfoSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              {/* Sección de Configuración de Acceso */}
              <AccessConfigSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Registrando...
                    </>
                  ) : (
                    'Registrar Usuario'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserRegistration