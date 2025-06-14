// components/UserConfigSection.tsx
import { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { UserFormData, FormErrors, DocumentType, Faculty, AcademicDepartment, InvestigatorType, AcademicGrade } from '../types'
import { API_URL } from '@/constants/api'
import { API_ENDPOINTS } from '../constants'

interface UserConfigSectionProps {
  formData: UserFormData
  errors: FormErrors
  onInputChange: (field: keyof UserFormData, value: any) => void
}

const UserConfigSection = ({
  formData,
  errors,
  onInputChange
}: UserConfigSectionProps) => {
  // Estados para los datos de los selects
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [investigatorTypes, setInvestigatorTypes] = useState<InvestigatorType[]>([])
  const [departments, setDepartments] = useState<AcademicDepartment[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [academicGrades, setAcademicGrades] = useState<AcademicGrade[]>([])

  // Estados de carga y error
  const [loading, setLoading] = useState(true)
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [
          responseDocTypes,
          responseInvestigator,
          responseGrade,
          responseFaculties
        ] = await Promise.all([
          fetch(`${API_URL}${API_ENDPOINTS.DOCUMENT_TYPES}`),
          fetch(`${API_URL}${API_ENDPOINTS.INVESTIGATOR_TYPES}`),
          fetch(`${API_URL}${API_ENDPOINTS.ACADEMIC_GRADES}`),
          fetch(`${API_URL}${API_ENDPOINTS.FACULTIES}`)
        ])

        if (!responseDocTypes.ok || !responseInvestigator.ok || !responseGrade.ok || 
            !responseFaculties.ok ) {
          throw new Error('Error al obtener los datos iniciales')
        }

        const [
          dataDocTypes,
          dataInvestigator,
          dataGrade,
          dataFaculties
        ] = await Promise.all([
          responseDocTypes.json(),
          responseInvestigator.json(),
          responseGrade.json(),
          responseFaculties.json()
        ])

        setDocumentTypes(dataDocTypes.data || [])
        setInvestigatorTypes(dataInvestigator.data || [])
        setFaculties(dataFaculties.data || [])
        setAcademicGrades(dataGrade.data || [])

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        console.error('Error fetching initial data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Cargar departamentos cuando cambie la facultad
  useEffect(() => {
    const fetchDepartmentsByFaculty = async () => {
      if (!formData.faculty) {
        setDepartments([])
        return
      }

      try {
        setLoadingDepartments(true)
        const response = await fetch(`${API_URL}${API_ENDPOINTS.FACULTIES}/${formData.faculty}`)
        
        if (!response.ok) {
          throw new Error('Error al obtener los departamentos de la facultad')
        }

        const data = await response.json()
        const departmentsData = data.data?.academic_departament || []
        setDepartments(departmentsData)
        
        // Limpiar el departamento seleccionado cuando cambie la facultad
        if (formData.academic_department) {
          onInputChange('academic_department', '')
        }

      } catch (err) {
        console.error('Error fetching departments:', err)
        setDepartments([])
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartmentsByFaculty()
  }, [formData.faculty])

  // Función para manejar cambio de facultad
  const handleFacultyChange = (value: string) => {
    onInputChange('faculty', value)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Configuración de Usuario
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Configuración de Usuario
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-800 underline hover:no-underline"
          >
            Recargar página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Configuración de Usuario
      </h3>

      {/* Primera fila: Tipo de documento y Sexo */}
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

      {/* Segunda fila: Procedencia y Grado académico */}
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
          <Label>Grado académico</Label>
          <Select
            value={formData.id_academic_grade}
            onValueChange={(value) => onInputChange('id_academic_grade', value)}
          >
            <SelectTrigger className={errors.id_academic_grade ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione su grado académico" />
            </SelectTrigger>
            <SelectContent>
              {academicGrades.map((grade) => (
                <SelectItem key={grade.ID} value={grade.ID}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_academic_grade && (
            <p className="text-red-500 text-sm">{errors.id_academic_grade}</p>
          )}
        </div>
      </div>

      {/* Tercera fila: Tipo de investigador y Tipo de participante */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tipo de investigador *</Label>
          <Select
            value={formData.id_investigator_types}
            onValueChange={(value) => onInputChange('id_investigator_types', value)}
          >
            <SelectTrigger className={errors.id_investigator_types ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione tipo de investigador" />
            </SelectTrigger>
            <SelectContent>
              {investigatorTypes.map((type) => (
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

        <div className="space-y-2">
          <Label htmlFor="url_orcid">URL orcid</Label>
          <Input
            id="url_orcid"
            value={formData.url_orcid}
            onChange={(e) => onInputChange('url_orcid', e.target.value)}
            placeholder="https://orcid.org/"
          />
        </div>
      </div>

      {/* Cuarta fila: Facultad y Departamento académico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Facultad *</Label>
          <Select
            value={formData.faculty}
            onValueChange={handleFacultyChange}
          >
            <SelectTrigger className={errors.faculty ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione una facultad" />
            </SelectTrigger>
            <SelectContent>
              {faculties.map((faculty) => (
                <SelectItem key={faculty.ID} value={faculty.ID}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.faculty && (
            <p className="text-red-500 text-sm">{errors.faculty}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Departamento académico *</Label>
          <Select
            value={formData.academic_department}
            onValueChange={(value) => onInputChange('academic_department', value)}
            disabled={!formData.faculty || loadingDepartments}
          >
            <SelectTrigger className={errors.academic_department ? 'border-red-500' : ''}>
              <SelectValue 
                placeholder={
                  !formData.faculty 
                    ? "Primero seleccione una facultad" 
                    : loadingDepartments 
                      ? "Cargando departamentos..." 
                      : "Seleccione departamento académico"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.ID} value={department.ID}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.academic_department && (
            <p className="text-red-500 text-sm">{errors.academic_department}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserConfigSection