// components/UserConfigSection.tsx
import { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserFormData, FormErrors } from '../types'

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
  const [documentTypes, setDocumentTypes] = useState<any[]>([])
  const [investigatorType, setInvestigatorType] = useState<any[]>([])
  const [grade, setGrade] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/document-types/all`);
        const responseInvestigator = await fetch(`${API_URL}/api/investigator-types`);
        const responseGrade = await fetch(`${API_URL}/api/academic-grades`);

        if (!response.ok || !responseInvestigator || !responseGrade) {
          throw new Error('Error al obtener los datos')
        }
        const data = await response.json()
        const dataInvestigator = await responseInvestigator.json()
        const dataGrade = await responseGrade.json()

        setDocumentTypes(data.data)
        setInvestigatorType(dataInvestigator.data)
        setGrade(dataGrade.data)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching types:', err)
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
                <SelectItem key={type.ID} value={type.ID}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label>Grado acádemico</Label>
          <Select
            value={formData.id_academic_grade}
            onValueChange={(value) => onInputChange('id_academic_grade', value)}
          >
            <SelectTrigger className={errors.id_academic_grade ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione su grado acádemico" />
            </SelectTrigger>
            <SelectContent>
              {grade.map((type) => (
                <SelectItem key={type.ID} value={type.ID}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_academic_grade && (
            <p className="text-red-500 text-sm">{errors.id_academic_grade}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tipo de investigador</Label>
        <Select
          value={formData.id_investigator_types}
          onValueChange={(value) => onInputChange('id_investigator_types', value)}
        >
          <SelectTrigger className={errors.id_investigator_types ? 'border-red-500' : ''}>
            <SelectValue placeholder="Seleccione tipo de investigador" />
          </SelectTrigger>
          <SelectContent>
            {investigatorType.map((type) => (
              <SelectItem key={type.ID} value={type.ID}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.id_investigator_types && (
          <p className="text-red-500 text-sm">{errors.id_investigator_types}</p>
        )}
      </div>
    </div>
  )
}

export default UserConfigSection