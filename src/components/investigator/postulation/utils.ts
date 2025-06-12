// src/components/investigator/postulation/utils.ts
import { PostulationFormData } from './types';
import { POSTULATION_CONFIG } from './config';

export const validateForm = {
  // Validar paso específico
  step: (stepNumber: number, formData: PostulationFormData): boolean => {
    switch (stepNumber) {
      case POSTULATION_CONFIG.STEPS.DOCUMENTS:
        return true; // Solo lectura de documentos
      
      case POSTULATION_CONFIG.STEPS.POSTER_INFO:
        return Boolean(
          formData.posterTitle.trim() && 
          formData.researchArea &&
          formData.abstractText.trim() &&
          formData.keywords.trim()
        );
      
      case POSTULATION_CONFIG.STEPS.INVESTIGATORS:
        return true; // Investigador principal es automático, co-investigadores opcionales
      
      case POSTULATION_CONFIG.STEPS.FILES:
        return Boolean(
          formData.acceptsTerms && 
          formData.acceptsDataProcessing && 
          formData.posterFile && 
          formData.authorizationFile
        );
      
      default:
        return true;
    }
  },

  // Validar campo específico
  field: {
    posterTitle: (value: string): string | null => {
      if (!value.trim()) return 'El título del póster es requerido';
      if (value.length > 200) return 'El título no puede exceder 200 caracteres';
      return null;
    },

    abstractText: (value: string): string | null => {
      if (!value.trim()) return 'El resumen es requerido';
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > POSTULATION_CONFIG.VALIDATION.MAX_ABSTRACT_WORDS) {
        return `El resumen no puede exceder ${POSTULATION_CONFIG.VALIDATION.MAX_ABSTRACT_WORDS} palabras (actual: ${wordCount})`;
      }
      return null;
    },

    keywords: (value: string): string | null => {
      if (!value.trim()) return 'Las palabras clave son requeridas';
      const keywords = value.split(',').map(k => k.trim()).filter(k => k);
      if (keywords.length > POSTULATION_CONFIG.VALIDATION.MAX_KEYWORDS) {
        return `Máximo ${POSTULATION_CONFIG.VALIDATION.MAX_KEYWORDS} palabras clave permitidas`;
      }
      if (keywords.length === 0) return 'Al menos una palabra clave es requerida';
      return null;
    },

    researchArea: (value: string): string | null => {
      if (!value) return 'La línea de investigación es requerida';
      return null;
    },

    file: (file: File | null, required: boolean = true): string | null => {
      if (required && !file) return 'El archivo es requerido';
      if (file && !file.type.includes('pdf')) return 'Solo se permiten archivos PDF';
      if (file && file.size > POSTULATION_CONFIG.VALIDATION.MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `El archivo no puede exceder ${POSTULATION_CONFIG.VALIDATION.MAX_FILE_SIZE_MB}MB`;
      }
      return null;
    },

    dni: (value: string): string | null => {
      if (!value.trim()) return 'El DNI es requerido';
      if (!/^\d{8}$/.test(value.trim())) return 'El DNI debe tener 8 dígitos';
      return null;
    }
  }
};

export const formatters = {
  // Formatear palabras clave
  keywords: (value: string): string => {
    return value
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0)
      .join(', ');
  },

  // Formatear DNI
  dni: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 8);
  },

  // Contar palabras en texto
  wordCount: (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
};

export const helpers = {
  // Generar ID único para co-investigadores
  generateCoInvestigatorId: (): string => {
    return `coinv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Preparar datos para envío
  prepareSubmissionData: (formData: PostulationFormData, eventId: string, principalInvestigatorId: string) => {
    const submissionData = new globalThis.FormData();
    
    // Datos básicos
    submissionData.append('eventId', eventId);
    submissionData.append('principalInvestigatorId', principalInvestigatorId);
    submissionData.append('posterTitle', formData.posterTitle);
    submissionData.append('abstractText', formData.abstractText);
    submissionData.append('keywords', formatters.keywords(formData.keywords));
    submissionData.append('researchArea', formData.researchArea);
    
    // Co-investigadores
    const validCoInvestigators = formData.coInvestigators.filter(ci => ci.id && !ci.notFound);
    submissionData.append('coInvestigators', JSON.stringify(validCoInvestigators));
    
    // Archivos
    if (formData.posterFile) {
      submissionData.append('posterFile', formData.posterFile);
    }
    if (formData.authorizationFile) {
      submissionData.append('authorizationFile', formData.authorizationFile);
    }
    
    // Metadatos
    submissionData.append('submissionDate', new Date().toISOString());
    submissionData.append('acceptsTerms', formData.acceptsTerms.toString());
    submissionData.append('acceptsDataProcessing', formData.acceptsDataProcessing.toString());
    
    return submissionData;
  }
};