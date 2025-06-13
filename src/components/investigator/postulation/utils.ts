// src/components/investigator/postulation/utils.ts
import { PostulationFormData,VerificationParticipationEventData } from './types';
import { POSTULATION_CONFIG } from './config';
import { API_URL } from '@/constants/api'

export const validateForm = {
  // Validar paso específico
  step: (stepNumber: number, formData: PostulationFormData): boolean => {
    switch (stepNumber) {
      case POSTULATION_CONFIG.STEPS.DOCUMENTS:
        return true; // Solo lectura de documentos
      
      case POSTULATION_CONFIG.STEPS.POSTER_INFO:
        return Boolean(
          formData.posterTitle.trim() && 
          formData.researchArea
        );
      
      case POSTULATION_CONFIG.STEPS.INVESTIGATORS:
        // Validar que haya al menos un co-investigador
        // validar que el mismo usuario no pueda registrarse como co-investigador
        // validar que no se repitan DNI
        return formData.coInvestigators.some(ci =>
          ci.dni.trim()!== '' &&
          ci.fullName.trim()!== '' &&
          ci.email.trim()!== '' &&
          ci.institution.trim()!== '' &&
          ci.academicGrade.trim()!== '' &&
          ci.investigatorType.trim()!== ''
        );
        // return formData.coInvestigators.some(ci => ci.dni.trim() !== '');
      
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
  // Formatear DNI
  dni: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 8);
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
    submissionData.append('researchArea', formData.researchArea);
    
    // Filtrar co-investigadores válidos (que tengan datos completos y no estén en estado de error)
    const validCoInvestigators = formData.coInvestigators.filter(ci => 
      ci.id && 
      ci.id.trim() !== '' &&
      ci.dni && 
      ci.dni.trim() !== '' &&
      ci.fullName && 
      ci.fullName.trim() !== '' &&
      ci.email && 
      ci.email.trim() !== '' &&
      ci.institution && 
      ci.institution.trim() !== '' &&
      ci.academicGrade && 
      ci.academicGrade.trim() !== '' &&
      ci.investigatorType && 
      ci.investigatorType.trim() !== '' &&
      !ci.notFound &&
      !ci.isLoading
    );
    
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


export const isUserCollaborator = async (userId: string, eventId: string): Promise<VerificationParticipationEventData | null> => {
  // Validación de parámetros
  if (!userId?.trim() || !eventId?.trim()) {
    console.error('UserId y EventId son requeridos');
    return null;
  }

  try {
    const url = new URL(`${API_URL}/api/colaborators/has-user-role`);
    url.searchParams.append('userId', userId);
    url.searchParams.append('eventId', eventId);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        // Agregar headers adicionales si son necesarios
        // 'Authorization': `Bearer ${token}`, // Si necesitas autenticación
      },
    });

    if (!response.ok) {
      // Manejar diferentes códigos de error HTTP
      switch (response.status) {
        case 404:
          console.warn(`Usuario ${userId} no encontrado para el evento ${eventId}`);
          break;
        case 403:
          console.error('No tienes permisos para verificar este usuario');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error(`Error HTTP ${response.status}: ${response.statusText}`);
      }
      return null;
    }

    const data: VerificationParticipationEventData = await response.json();
    
    // Validar estructura de respuesta
    if (!data || typeof data.success !== 'boolean') {
      console.error('Respuesta del servidor con formato inválido:', data);
      return null;
    }

    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Error de conexión - verifica tu conexión a internet');
    } else {
      console.error('Error inesperado al verificar colaborador:', error);
    }
    return null;
  }
};