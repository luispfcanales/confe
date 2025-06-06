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
  created_at?: string;
  updated_at?: string;
  role?: Role;  // Agrega esta propiedad para el objeto anidado
  document_type?: DocumentType; // Opcional: si también viene en la respuesta
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
    FEMALE = 2,
    OTHER = 3
  }