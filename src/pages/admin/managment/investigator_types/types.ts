export interface InvestigatorType {
    ID: string
    name: string
    created_at: string
    updated_at: string
    deleted_at: string | null
  }
  
  export interface CreateInvestigatorTypeRequest {
    name: string
  }
  
  export interface UpdateInvestigatorTypeRequest {
    name?: string
  }
  
  export interface InvestigatorTypeApiResponse {
    data: InvestigatorType[]
    message?: string
    success: boolean
  }
  
  export interface SingleInvestigatorTypeApiResponse {
    data: InvestigatorType
    message?: string
    success: boolean
  }
  
  export const INITIAL_INVESTIGATOR_TYPE_FORM_DATA = {
    name: '',
    status: true,
  }