// src/services/postulationApi.ts
import { CoInvestigatorFromAPI, ResearchLinesResponse } from '@/components/investigator/postulation/types';

const API_BASE_URL = 'http://localhost:3000/api';

export const postulationApi = {
  // Buscar co-investigador por DNI
  searchCoInvestigatorByDNI: async (dni: string): Promise<CoInvestigatorFromAPI> => {
    const response = await fetch(`${API_BASE_URL}/users/search-by-dni/${dni}`);
    
    if (!response.ok) {
      throw new Error('Investigador no encontrado');
    }
    
    return await response.json();
  },

  // Obtener líneas de investigación
  getResearchLines: async (): Promise<ResearchLinesResponse> => {
    const response = await fetch(`${API_BASE_URL}/general/line-investigation`);
    
    if (!response.ok) {
      throw new Error('Error al cargar las líneas de investigación');
    }
    
    return await response.json();
  },

  // Enviar postulación
  submitPostulation: async (formData: globalThis.FormData): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/postulations`, {
      method: 'POST',
      body: formData, // FormData nativo de JavaScript para archivos
    });
    
    if (!response.ok) {
      throw new Error('Error al enviar la postulación');
    }
    
    return await response.json();
  }
};