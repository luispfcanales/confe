import { API_URL } from '@/constants/api';
import { 
  InvestigatorType, 
  CreateInvestigatorTypeRequest, 
  UpdateInvestigatorTypeRequest, 
  InvestigatorTypeApiResponse, 
  SingleInvestigatorTypeApiResponse 
} from '../types';

export class InvestigatorTypeService {
  private static baseUrl = `${API_URL}/api/investigator-types`;

  static async getAllInvestigatorTypes(): Promise<InvestigatorType[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: InvestigatorTypeApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching investigator types:', error);
      throw error;
    }
  }

  static async getInvestigatorTypeById(id: string): Promise<InvestigatorType> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SingleInvestigatorTypeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching investigator type ${id}:`, error);
      throw error;
    }
  }

  static async createInvestigatorType(investigatorTypeData: CreateInvestigatorTypeRequest): Promise<InvestigatorType> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investigatorTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleInvestigatorTypeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating investigator type:', error);
      throw error;
    }
  }

  static async updateInvestigatorType(id: string, investigatorTypeData: UpdateInvestigatorTypeRequest): Promise<InvestigatorType> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investigatorTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleInvestigatorTypeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error updating investigator type ${id}:`, error);
      throw error;
    }
  }

  static async deleteInvestigatorType(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting investigator type ${id}:`, error);
      throw error;
    }
  }
}

export const INITIAL_INVESTIGATOR_TYPE_FORM_DATA = {
  name: '',
  status: true,
  description: ''
}