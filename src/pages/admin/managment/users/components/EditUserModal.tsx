// components/EditUserModal.tsx
import React, { useState, useEffect } from 'react';
import { User, Role, DocumentType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { UserService } from '../services/userService';
import { toast } from 'sonner';

// Tipos adicionales para los nuevos campos
interface ResearcherType {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
}

interface AcademicGrade {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
}

interface Faculty {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
  academic_department?: AcademicDepartment[]; // Agregar array de departamentos
}

interface AcademicDepartment {
  ID: string;
  name: string;
  faculty_id: string;
  description?: string;
  status?: boolean;
}

interface ParticipationType {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    first_name: '',
    last_name: '',
    identity_document: '',
    address: '',
    email: '',
    role_id: '',
    document_type_id: '',
    sex: 1, // 1 = Masculino por defecto
    password: '',
    is_active: true,
    is_internal: false,
    // Campos adicionales para investigador
    researcher_type_id: '',
    academic_grade_id: '',
    participation_type_id: '',
    faculty_id: '',
    academic_department_id: '',
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [researcherTypes, setResearcherTypes] = useState<ResearcherType[]>([]);
  const [academicGrades, setAcademicGrades] = useState<AcademicGrade[]>([]);
  const [participationTypes, setParticipationTypes] = useState<ParticipationType[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<AcademicDepartment[]>([]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isEditMode = Boolean(user?.ID);
  
  // Verificar si el rol seleccionado es "INVESTIGADOR" O si ya tiene datos de investigador
  const selectedRole = roles.find(role => role.ID === formData.role_id);
  const isResearcherRole = selectedRole?.name === 'INVESTIGADOR';
  const hasResearcherData = Boolean(
    user?.researcher_type_id || 
    user?.academic_grade_id || 
    user?.participation_type_id || 
    user?.faculty_id || 
    user?.academic_department_id
  );
  const showResearcherFields = isResearcherRole || hasResearcherData;

  useEffect(() => {
    if (isOpen) {
      setIsDataLoaded(false);
      loadRolesAndDocumentTypes();
      loadResearcherData();
    } else {
      setIsDataLoaded(false);
    }
  }, [isOpen]);

  // Cargar datos del formulario después de que se carguen los roles y tipos de documento
  useEffect(() => {
    if (isOpen && roles.length > 0 && documentTypes.length > 0) {
      console.log('=== DEBUG: Ready to load form data ===');
      console.log('Roles loaded:', roles.length);
      console.log('Document types loaded:', documentTypes.length);
      console.log('User to load:', user);
      loadFormData();
      setIsDataLoaded(true);
    }
  }, [isOpen, user, roles, documentTypes]);

  // Filtrar departamentos cuando cambie la facultad
  useEffect(() => {
    if (formData.faculty_id) {
      console.log('=== DEBUG: Faculty changed ===');
      console.log('Selected faculty ID:', formData.faculty_id);
      console.log('Available faculties:', faculties);
      
      // Buscar la facultad seleccionada y obtener sus departamentos
      const selectedFaculty = faculties.find(faculty => faculty.ID === formData.faculty_id);
      console.log('Selected faculty object:', selectedFaculty);
      
      if (selectedFaculty && selectedFaculty.academic_department && selectedFaculty.academic_department.length > 0) {
        console.log('Setting departments from faculty:', selectedFaculty.academic_department);
        setFilteredDepartments(selectedFaculty.academic_department);
      } else {
        console.log('No departments found in faculty, fetching all departments...');
        // Si no hay departamentos en la facultad, cargar todos los departamentos
        // y filtrar por faculty_id
        UserService.getAllAcademicDepartments().then(allDepartments => {
          const filtered = allDepartments.filter((dept: AcademicDepartment) => dept.faculty_id === formData.faculty_id);
          console.log('Filtered departments:', filtered);
          setFilteredDepartments(filtered);
        }).catch(console.error);
      }
      
      // Limpiar departamento si no está en la nueva facultad
      if (formData.academic_department_id) {
        const isValidDepartment = selectedFaculty?.academic_department?.some(
          (dept: AcademicDepartment) => dept.ID === formData.academic_department_id
        );
        if (!isValidDepartment) {
          handleInputChange('academic_department_id', '');
        }
      }
    } else {
      console.log('No faculty selected, loading all departments for selection');
      // Si no hay facultad seleccionada pero el usuario tiene datos de investigador,
      // cargar todos los departamentos para que pueda seleccionar
      if (showResearcherFields) {
        UserService.getAllAcademicDepartments().then(allDepartments => {
          console.log('Loading all departments:', allDepartments);
          setFilteredDepartments(allDepartments);
        }).catch(console.error);
      } else {
        setFilteredDepartments([]);
        handleInputChange('academic_department_id', '');
      }
    }
  }, [formData.faculty_id, faculties, showResearcherFields]);

  const loadFormData = () => {
    if (user) {
      console.log('=== DEBUG: Loading user data ===');
      console.log('Raw user object:', user);
      console.log('user.role_id:', user.role_id, 'Type:', typeof user.role_id);
      console.log('user.document_type_id:', user.document_type_id, 'Type:', typeof user.document_type_id);
      console.log('Available roles:', roles.map(r => ({ ID: r.ID, name: r.name })));
      console.log('Available document types:', documentTypes.map(dt => ({ ID: dt.ID, name: dt.name })));
      
      const newFormData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        identity_document: user.identity_document || '',
        address: user.address || '',
        // Asegurar que los IDs sean strings y coincidan con las opciones
        role_id: user.role_id?.toString() || '',
        document_type_id: user.document_type_id?.toString() || '',
        sex: user.sex || 1,
        password: '',
        is_active: user.is_active ?? true,
        is_internal: user.is_internal ?? false,
        // Campos adicionales para investigador
        researcher_type_id: user.researcher_type_id?.toString() || '',
        academic_grade_id: user.academic_grade_id?.toString() || '',
        participation_type_id: user.participation_type_id?.toString() || '',
        faculty_id: user.faculty_id?.toString() || '',
        academic_department_id: user.academic_department_id?.toString() || '',
      };
      
      console.log('Setting form data to:', newFormData);
      setFormData(newFormData);
    } else {
      console.log('=== DEBUG: Creating new user ===');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        identity_document: '',
        address: '',
        role_id: '',
        document_type_id: '',
        sex: 1,
        password: '',
        is_active: true,
        is_internal: false,
        researcher_type_id: '',
        academic_grade_id: '',
        participation_type_id: '',
        faculty_id: '',
        academic_department_id: '',
      });
    }
    setErrors({});
  };

  const loadRolesAndDocumentTypes = async () => {
    try {
      const [rolesData, documentTypesData] = await Promise.all([
        UserService.getAllRoles(),
        UserService.getAllDocumentTypes()
      ]);
      
      console.log('Loaded roles:', rolesData); // Debug log
      console.log('Loaded document types:', documentTypesData); // Debug log
      
      setRoles(rolesData);
      setDocumentTypes(documentTypesData);
    } catch (error) {
      toast.error('Error al cargar datos', {
        description: 'No se pudieron cargar los roles y tipos de documento',
      });
    }
  };

  const loadResearcherData = async () => {
    try {
      const [
        researcherTypesData,
        academicGradesData,
        participationTypesData,
        facultiesData
      ] = await Promise.all([
        UserService.getAllInvestigatorTypes(),
        UserService.getAllAcademicGrades(),
        UserService.getAllParticipationTypes(),
        UserService.getAllFaculties()
      ]);

      console.log('=== DEBUG: Researcher data loaded ===');
      console.log('Researcher types:', researcherTypesData);
      console.log('Academic grades:', academicGradesData);
      console.log('Participation types:', participationTypesData);
      console.log('Faculties:', facultiesData);

      setResearcherTypes(researcherTypesData);
      setAcademicGrades(academicGradesData);
      setParticipationTypes(participationTypesData);
      setFaculties(facultiesData);
    } catch (error) {
      console.error('Error loading researcher data:', error);
      toast.error('Error al cargar datos de investigador', {
        description: 'No se pudieron cargar los datos adicionales',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.identity_document?.trim()) {
      newErrors.identity_document = 'El documento de identidad es requerido';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'El rol es requerido';
    }

    if (!formData.document_type_id) {
      newErrors.document_type_id = 'El tipo de documento es requerido';
    }

    if (!isEditMode && !formData.password?.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validaciones adicionales para investigador
    if (showResearcherFields && isResearcherRole) {
      if (!formData.researcher_type_id) {
        newErrors.researcher_type_id = 'El tipo de investigador es requerido';
      }
      
      if (!formData.academic_grade_id) {
        newErrors.academic_grade_id = 'El grado académico es requerido';
      }
      
      if (!formData.participation_type_id) {
        newErrors.participation_type_id = 'El tipo de participación es requerido';
      }
      
      if (!formData.faculty_id) {
        newErrors.faculty_id = 'La facultad es requerida';
      }
      
      if (!formData.academic_department_id) {
        newErrors.academic_department_id = 'El departamento académico es requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        ...formData,
        ID: user?.ID,
      } as User;

      onSave(userData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (roleId: string) => {
    console.log('Role changed to:', roleId); // Debug log
    handleInputChange('role_id', roleId);
    
    // Limpiar campos de investigador si se cambia a otro rol
    const newRole = roles.find(role => role.ID === roleId);
    if (newRole?.name !== 'INVESTIGADOR') {
      handleInputChange('researcher_type_id', '');
      handleInputChange('academic_grade_id', '');
      handleInputChange('participation_type_id', '');
      handleInputChange('faculty_id', '');
      handleInputChange('academic_department_id', '');
    }
  };

  const handleDocumentTypeChange = (documentTypeId: string) => {
    console.log('Document type changed to:', documentTypeId); // Debug log
    handleInputChange('document_type_id', documentTypeId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isDataLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Cargando datos del formulario...</p>
              </div>
            </div>
          ) : (
            <>
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document_type_id">Tipo de Documento *</Label>
                <Select
                  value={formData.document_type_id || ''}
                  onValueChange={handleDocumentTypeChange}
                >
                  <SelectTrigger className={errors.document_type_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccione tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.filter(docType => docType.ID).map((docType, index) => (
                      <SelectItem key={docType.ID || `doc-type-${index}`} value={docType.ID?.toString() || ''}>
                        {docType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.document_type_id && (
                  <p className="text-sm text-red-500">{errors.document_type_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="identity_document">Documento de Identidad *</Label>
                <Input
                  id="identity_document"
                  value={formData.identity_document || ''}
                  onChange={(e) => handleInputChange('identity_document', e.target.value)}
                  placeholder="Ingrese el documento"
                  className={errors.identity_document ? 'border-red-500' : ''}
                />
                {errors.identity_document && (
                  <p className="text-sm text-red-500">{errors.identity_document}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Ingrese el nombre"
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Ingrese el apellido"
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sexo</Label>
              <Select
                value={formData.sex?.toString() || '1'}
                onValueChange={(value) => handleInputChange('sex', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Información de Contacto
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="usuario@ejemplo.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Ingrese la dirección"
                rows={3}
              />
            </div>
          </div>

          {/* Configuración del Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Configuración del Sistema
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="role_id">Rol *</Label>
              <Select
                value={formData.role_id || ''}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className={errors.role_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(role => role.ID).map((role, index) => (
                    <SelectItem key={role.ID || `role-${index}`} value={role.ID?.toString() || ''}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role_id && (
                <p className="text-sm text-red-500">{errors.role_id}</p>
              )}
            </div>

            {/* Campos adicionales para investigador */}
            {showResearcherFields && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-md font-semibold text-blue-900">
                  Información Adicional de Investigador
                  {!isResearcherRole && hasResearcherData && (
                    <span className="text-sm font-normal text-blue-700 ml-2">
                      (Usuario tiene datos de investigador previos)
                    </span>
                  )}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="researcher_type_id">
                      Tipo de investigador {isResearcherRole ? '*' : ''}
                    </Label>
                    <Select
                      value={formData.researcher_type_id || ''}
                      onValueChange={(value) => handleInputChange('researcher_type_id', value)}
                    >
                      <SelectTrigger className={errors.researcher_type_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione tipo de investigador" />
                      </SelectTrigger>
                      <SelectContent>
                        {researcherTypes.filter(type => type.ID).map((type, index) => (
                          <SelectItem key={type.ID || `researcher-${index}`} value={type.ID?.toString() || ''}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.researcher_type_id && (
                      <p className="text-sm text-red-500">{errors.researcher_type_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academic_grade_id">
                      Grado Académico {isResearcherRole ? '*' : ''}
                    </Label>
                    <Select
                      value={formData.academic_grade_id || ''}
                      onValueChange={(value) => handleInputChange('academic_grade_id', value)}
                    >
                      <SelectTrigger className={errors.academic_grade_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione grado académico" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicGrades.map((grade) => (
                          <SelectItem key={grade.ID} value={grade.ID?.toString() || ''}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.academic_grade_id && (
                      <p className="text-sm text-red-500">{errors.academic_grade_id}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participation_type_id">
                    Tipo de Participación {isResearcherRole ? '*' : ''}
                  </Label>
                  <Select
                    value={formData.participation_type_id || ''}
                    onValueChange={(value) => handleInputChange('participation_type_id', value)}
                  >
                    <SelectTrigger className={errors.participation_type_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione tipo de participación" />
                    </SelectTrigger>
                    <SelectContent>
                      {participationTypes.filter(type => type.ID).map((type, index) => (
                        <SelectItem key={type.ID || `participation-${index}`} value={type.ID?.toString() || ''}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.participation_type_id && (
                    <p className="text-sm text-red-500">{errors.participation_type_id}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty_id">
                      Facultad {isResearcherRole ? '*' : ''}
                    </Label>
                    <Select
                      value={formData.faculty_id || ''}
                      onValueChange={(value) => handleInputChange('faculty_id', value)}
                    >
                      <SelectTrigger className={errors.faculty_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione una facultad" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties.filter(faculty => faculty.ID).map((faculty, index) => (
                          <SelectItem key={faculty.ID || `faculty-${index}`} value={faculty.ID?.toString() || ''}>
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.faculty_id && (
                      <p className="text-sm text-red-500">{errors.faculty_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academic_department_id">
                      Departamento académico {isResearcherRole ? '*' : ''}
                    </Label>
                    <Select
                      value={formData.academic_department_id || ''}
                      onValueChange={(value) => handleInputChange('academic_department_id', value)}
                    >
                      <SelectTrigger className={errors.academic_department_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione departamento académico" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDepartments.filter(dept => dept.ID).map((department, index) => (
                          <SelectItem key={department.ID || `dept-${index}`} value={department.ID?.toString() || ''}>
                            {department.name}
                            {department.faculty_id && !formData.faculty_id && (
                              <span className="text-xs text-gray-500 ml-1">
                                (Facultad: {faculties.find(f => f.ID === department.faculty_id)?.name || 'N/A'})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.academic_department_id && (
                      <p className="text-sm text-red-500">{errors.academic_department_id}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(!isEditMode) && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Ingrese contraseña"
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Dejar vacío para mantener actual"
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active">Usuario Activo</Label>
                    <p className="text-sm text-gray-600">
                      El usuario puede acceder al sistema
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active ?? true}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_internal">Usuario Interno</Label>
                    <p className="text-sm text-gray-600">
                      Usuario pertenece a la organización
                    </p>
                  </div>
                  <Switch
                    id="is_internal"
                    checked={formData.is_internal ?? false}
                    onCheckedChange={(checked) => handleInputChange('is_internal', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          <DialogFooter>
            {isDataLoaded && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};