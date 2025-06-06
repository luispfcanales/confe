import { API_URL } from '@/constants/api';
import { Role, CreateRoleRequest, UpdateRoleRequest, RoleApiResponse, SingleRoleApiResponse } from '../types';

export class RoleService {
  private static baseUrl = `${API_URL}/api/roles`;

  static async getAllRoles(): Promise<Role[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: RoleApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  static async getRoleById(id: string): Promise<Role> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SingleRoleApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching role ${id}:`, error);
      throw error;
    }
  }

  static async createRole(roleData: CreateRoleRequest): Promise<Role> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleRoleApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  static async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleRoleApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error updating role ${id}:`, error);
      throw error;
    }
  }

  static async deleteRole(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting role ${id}:`, error);
      throw error;
    }
  }

  static async toggleRoleStatus(id: string, status: boolean): Promise<Role> {
    return this.updateRole(id, { status });
  }
}