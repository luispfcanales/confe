// types.ts
export interface User {
  ID: string;
  role_id: string;
  document_type_id: string;
  first_name: string;
  last_name: string;
  identity_document: string;
  address: string;
  email: string;
  sex: number;
  password?: string;
  is_active: boolean;
  is_internal: boolean;
  
  // Campos adicionales para investigadores
  researcher_type_id?: string;
  academic_grade_id?: string;
  participation_type_id?: string;
  faculty_id?: string;
  academic_department_id?: string;
  
  created_at?: string;
  updated_at?: string;
  role: Role;  // Agrega esta propiedad para el objeto anidado
  document_type: DocumentType; // Opcional: si también viene en la respuesta
}

export interface Role {
  ID: string;
  name: string;
  description: string;
  status: boolean;  // Cambiado de string a boolean para coincidir con la API
  created_at?: string;
  updated_at?: string;
}

export interface DocumentType {
  ID: string;
  name: string;
  description: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

// Nuevos tipos para investigadores
export interface ResearcherType {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicGrade {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ParticipationType {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

// En tu archivo types.ts principal, actualiza:
export interface Faculty {
  ID: string;
  name: string;
  description?: string;
  status?: boolean;
  academic_department?: AcademicDepartment[]; // Agregar esta línea
  created_at?: string;
  updated_at?: string;
}

export interface AcademicDepartment {
  ID: string;
  name: string;
  faculty_id: string;
  description?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  RoleID: string;
  DocumentTypeID: string;
  FirstName: string;
  LastName: string;
  IdentityDocument: string;
  Address: string;
  Email: string;
  Sex: number;
  Password: string;
  IsActive: boolean;
  IsInternal: boolean;
  
  // Campos adicionales para investigadores
  ResearcherTypeID?: string;
  AcademicGradeID?: string;
  ParticipationTypeID?: string;
  FacultyID?: string;
  AcademicDepartmentID?: string;
}

export interface UpdateUserRequest {
  RoleID: string;
  DocumentTypeID: string;
  FirstName: string;
  LastName: string;
  IdentityDocument: string;
  Address: string;
  Email: string;
  Sex: number;
  IsActive: boolean;
  IsInternal: boolean;
  Password?: string; // Opcional en actualizaciones
  
  // Campos adicionales para investigadores
  ResearcherTypeID?: string;
  AcademicGradeID?: string;
  ParticipationTypeID?: string;
  FacultyID?: string;
  AcademicDepartmentID?: string;
}

export enum UserType {
  ALL = 'all',
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum SexType {
  MALE = 1,
  FEMALE = 2
}