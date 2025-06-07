import { API_URL } from '@/constants/api';
import { 
  AcademicGrade, 
  CreateAcademicGradeRequest, 
  UpdateAcademicGradeRequest, 
  AcademicGradeApiResponse, 
  SingleAcademicGradeApiResponse 
} from '../types';

export class AcademicGradeService {
  private static baseUrl = `${API_URL}/api/academic-grades`;

  static async getAllAcademicGrades(): Promise<AcademicGrade[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AcademicGradeApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching academic grades:', error);
      throw error;
    }
  }

  static async getAcademicGradeById(id: string): Promise<AcademicGrade> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SingleAcademicGradeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching academic grade ${id}:`, error);
      throw error;
    }
  }

  static async createAcademicGrade(academicGradeData: CreateAcademicGradeRequest): Promise<AcademicGrade> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(academicGradeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleAcademicGradeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating academic grade:', error);
      throw error;
    }
  }

  static async updateAcademicGrade(id: string, academicGradeData: UpdateAcademicGradeRequest): Promise<AcademicGrade> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(academicGradeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleAcademicGradeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error updating academic grade ${id}:`, error);
      throw error;
    }
  }

  static async deleteAcademicGrade(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting academic grade ${id}:`, error);
      throw error;
    }
  }
}

export const INITIAL_ACADEMIC_GRADE_FORM_DATA = {
  name: '',
  description: '',
  level: ''
}