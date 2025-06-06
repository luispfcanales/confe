export interface DocumentType {
    id: string
    name: string
  }
  
  export interface UserFormData {
    documentTypeId: string
    firstName: string
    lastName: string
    identityDocument: string
    address: string
    email: string
    phoneNumber: string
    sex: number
    password: string
    confirmPassword: string
    isActive: boolean
    isInternal: boolean
  }
  
//   export interface FormErrors {
//     documentTypeId?: string
//     firstName?: string
//     lastName?: string
//     identityDocument?: string
//     address?: string
//     email?: string
//     phoneNumber?: string
//     password?: string
//     confirmPassword?: string
//   }
export type FormErrors = {
    [key in keyof UserFormData]?: string
  }