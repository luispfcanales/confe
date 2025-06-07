export interface DocumentType {
    ID: string
    name: string
    description: string
    created_at: string
    updated_at: string
    deleted_at: string | null
  }
  
  export interface CreateDocumentTypeRequest {
    name: string
    description: string
  }
  
  export interface UpdateDocumentTypeRequest {
    name?: string
    description?: string
  }
  
  export interface DocumentTypeApiResponse {
    data: DocumentType[]
    message?: string
    success: boolean
  }
  
  export interface SingleDocumentTypeApiResponse {
    data: DocumentType
    message?: string
    success: boolean
  }
  
  export const INITIAL_DOCUMENT_TYPE_FORM_DATA = {
    name: '',
    description: ''
  }