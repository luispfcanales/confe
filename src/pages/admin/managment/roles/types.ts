export interface Role {
  ID: string
  name: string
  status: boolean
  description: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateRoleRequest {
  name: string
  description: string
  status: boolean
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  status?: boolean
}

export interface RoleApiResponse {
  data: Role[]
  message?: string
  success: boolean
}

export interface SingleRoleApiResponse {
  data: Role
  message?: string
  success: boolean
}