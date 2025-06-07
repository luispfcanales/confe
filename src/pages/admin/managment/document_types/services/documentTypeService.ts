import { API_URL } from '@/constants/api';
import { 
  DocumentType, 
  CreateDocumentTypeRequest, 
  UpdateDocumentTypeRequest, 
  DocumentTypeApiResponse, 
  SingleDocumentTypeApiResponse 
} from '../types';

export class DocumentTypeService {
  private static baseUrl = `${API_URL}/api/document-types`;

  static async getAllDocumentTypes(): Promise<DocumentType[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DocumentTypeApiResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  }

  static async getDocumentTypeById(id: string): Promise<DocumentType> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SingleDocumentTypeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching document type ${id}:`, error);
      throw error;
    }
  }

  static async createDocumentType(documentTypeData: CreateDocumentTypeRequest): Promise<DocumentType> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleDocumentTypeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating document type:', error);
      throw error;
    }
  }

  static async updateDocumentType(id: string, documentTypeData: UpdateDocumentTypeRequest): Promise<DocumentType> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleDocumentTypeApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error updating document type ${id}:`, error);
      throw error;
    }
  }

  static async deleteDocumentType(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting document type ${id}:`, error);
      throw error;
    }
  }
}

export const INITIAL_DOCUMENT_TYPE_FORM_DATA = {
  name: '',
  description: ''
}