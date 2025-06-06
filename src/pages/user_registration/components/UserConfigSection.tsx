// components/UserConfigSection.tsx
import { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserFormData, FormErrors, DocumentType } from '../types'

import { API_URL } from '@/constants/api'

interface UserConfigSectionProps {
  formData: UserFormData
  errors: FormErrors
  //documentTypes: DocumentType[]
  onInputChange: (field: keyof UserFormData, value: any) => void
}

const UserConfigSection = ({ 
  formData, 
  errors, 
  onInputChange 
}: UserConfigSectionProps) => {
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDocumentTypes = async () => {
          try {
            setLoading(true)
            const response = await fetch(`${API_URL}/api/document-types/all`);
            if (!response.ok) {
              throw new Error('Error al obtener los tipos de documento')
            }
            const data = await response.json()
            setDocumentTypes(data.data)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
            console.error('Error fetching document types:', err)
          } finally {
            setLoading(false)
          }
        }
    
        fetchDocumentTypes()
      }, [])
    
      if (loading) {
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Configuración de Usuario
            </h3>
            <p>Cargando tipos de documento...</p>
          </div>
        )
      }
    
      if (error) {
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Configuración de Usuario
            </h3>
            <p className="text-red-500">{error}</p>
          </div>
        )
      }
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Configuración de Usuario
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo de Documento *</Label>
          <Select 
            value={formData.documentTypeId} 
            onValueChange={(value) => onInputChange('documentTypeId', value)}
          >
            <SelectTrigger className={errors.documentTypeId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.documentTypeId && (
            <p className="text-red-500 text-sm">{errors.documentTypeId}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Sexo</Label>
          <RadioGroup
            value={formData.sex.toString()}
            onValueChange={(value) => onInputChange('sex', parseInt(value))}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="male" />
              <Label htmlFor="male">Masculino</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="female" />
              <Label htmlFor="female">Femenino</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Procedencia</Label>
        <RadioGroup
          value={formData.isInternal.toString()}
          onValueChange={(value) => onInputChange('isInternal', value === 'true')}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="internal" />
            <Label htmlFor="internal">Interno</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="external" />
            <Label htmlFor="external">Externo</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default UserConfigSection