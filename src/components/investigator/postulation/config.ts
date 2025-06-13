// src/components/investigator/postulation/config.ts
export const POSTULATION_CONFIG = {
  // URLs de documentos
  DOCUMENTS: {
    POSTER_FORMAT: 'https://bit.ly/confericis2025-poster-unamad',
    INSTRUCTIONS: 'https://bit.ly/confericis2025unamad-instructivo',
    AUTHORIZATION_FORMAT: 'https://bit.ly/confericis2025unamad-autorizacion',
    EVALUATION_CRITERIA: 'https://bit.ly/confericis2025unamad-criterios'
  },

  // Configuración de API
  API: {
    BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
      SEARCH_BY_DNI: '/users/dni/search',
      RESEARCH_LINES: '/general/line-investigation',
      SUBMIT_POSTULATION: '/postulations'
    },
    TIMEOUT: 30000, // 30 segundos
    RETRY_ATTEMPTS: 3
  },

  // Validaciones
  VALIDATION: {
    MAX_POSTER_TITLE_LENGTH: 200,
    MIN_POSTER_TITLE_LENGTH: 10,
    ACCEPTED_FILE_TYPES: ['.pdf'],
    MAX_FILE_SIZE_MB: 10,
    MIN_FILE_SIZE_KB: 50,
    DNI_LENGTH: 8,
    MAX_CO_INVESTIGATORS: 5
  },

  // Pasos del formulario
  STEPS: {
    DOCUMENTS: 1,
    POSTER_INFO: 2,
    INVESTIGATORS: 3,
    FILES: 4
  },

  // Configuración de archivos
  FILES: {
    POSTER: {
      NAME: 'posterFile',
      ACCEPT: '.pdf',
      MAX_SIZE_MB: 10,
      REQUIRED: true,
      DESCRIPTION: 'Archivo PDF del póster científico'
    },
    AUTHORIZATION: {
      NAME: 'authorizationFile',
      ACCEPT: '.pdf',
      MAX_SIZE_MB: 5,
      REQUIRED: true,
      DESCRIPTION: 'Formato de autorización firmado'
    }
  },

  // Mensajes del sistema
  MESSAGES: {
    SUCCESS: {
      POSTULATION_SENT: '¡Postulación enviada exitosamente!',
      INVESTIGATOR_FOUND: 'Investigador encontrado',
      FILE_UPLOADED: 'Archivo cargado correctamente',
      DATA_SAVED: 'Datos guardados correctamente'
    },
    ERROR: {
      POSTULATION_FAILED: 'Error al enviar la postulación',
      INVESTIGATOR_NOT_FOUND: 'Investigador no encontrado',
      INVALID_DNI: 'DNI inválido o no encontrado',
      FILE_TOO_LARGE: 'El archivo es demasiado grande',
      INVALID_FILE_TYPE: 'Tipo de archivo no válido',
      NETWORK_ERROR: 'Error de conexión. Intente nuevamente.',
      LOADING_USER_DATA: 'Error al cargar los datos del usuario',
      LOADING_RESEARCH_LINES: 'Error al cargar las líneas de investigación',
      VALIDATION_FAILED: 'Por favor, complete todos los campos requeridos',
      SERVER_ERROR: 'Error del servidor. Intente más tarde.'
    },
    INFO: {
      LOADING_USER_DATA: 'Cargando datos del investigador principal...',
      LOADING_RESEARCH_LINES: 'Cargando líneas de investigación...',
      SEARCHING_INVESTIGATOR: 'Buscando investigador...',
      UPLOADING_FILES: 'Subiendo archivos...',
      PROCESSING: 'Procesando postulación...'
    },
    WARNING: {
      UNSAVED_CHANGES: 'Tiene cambios sin guardar. ¿Está seguro de que desea cerrar?',
      FILE_REPLACE: 'Esto reemplazará el archivo anterior. ¿Continuar?',
      REMOVE_INVESTIGATOR: '¿Está seguro de que desea eliminar este co-investigador?',
      LARGE_FILE: 'El archivo es grande y puede tardar en subirse',
      DEADLINE_APPROACHING: 'La fecha límite está próxima'
    }
  },

  // Configuración de UI
  UI: {
    DEBOUNCE_DELAY: 500, // ms para búsquedas
    ANIMATION_DURATION: 300, // ms para transiciones
    TOAST_DURATION: 5000, // ms para notificaciones
    MODAL_TRANSITION: 200, // ms para modal
    LOADING_MIN_TIME: 1000, // ms mínimo para mostrar loading
    COLORS: {
      PRIMARY: 'blue',
      SUCCESS: 'green',
      ERROR: 'red',
      WARNING: 'yellow',
      INFO: 'blue'
    }
  },

  // Textos de la interfaz
  LABELS: {
    FORM_FIELDS: {
      POSTER_TITLE: 'Título del Póster',
      RESEARCH_AREA: 'Línea de Investigación',
      CO_INVESTIGATOR_DNI: 'DNI del Co-investigador',
      POSTER_FILE: 'Póster Científico (PDF)',
      AUTHORIZATION_FILE: 'Formato de Autorización Firmado (PDF)',
      ACCEPTS_TERMS: 'Acepto los términos y condiciones',
      ACCEPTS_DATA_PROCESSING: 'Autorizo el tratamiento de datos personales'
    },
    PLACEHOLDERS: {
      POSTER_TITLE: 'Ingrese el título completo de su investigación',
      CO_INVESTIGATOR_DNI: 'Ingrese el DNI del co-investigador',
      SELECT_RESEARCH_AREA: 'Seleccione una línea de investigación'
    },
    BUTTONS: {
      NEXT: 'Siguiente',
      PREVIOUS: 'Anterior',
      SUBMIT: 'Enviar Postulación',
      CANCEL: 'Cancelar',
      CLOSE: 'Cerrar',
      ADD_CO_INVESTIGATOR: 'Agregar Co-investigador',
      REMOVE_CO_INVESTIGATOR: 'Eliminar',
      SEARCH: 'Buscar',
      UPLOAD_FILE: 'Seleccionar Archivo',
      DOWNLOAD: 'Descargar',
      VIEW: 'Ver'
    }
  },

  // Instrucciones y ayuda
  INSTRUCTIONS: {
    DOCUMENTS_STEP: [
      'Descarga y revisa todos los documentos antes de continuar',
      'El póster debe seguir estrictamente el formato proporcionado',
      'Todos los archivos deben estar en formato PDF',
      'Completa el formulario de autorización y súbelo firmado'
    ],
    POSTER_INFO_STEP: [
      'El título debe ser descriptivo y específico',
      'Selecciona la línea de investigación más apropiada'
    ],
    INVESTIGATORS_STEP: [
      'El investigador principal se carga automáticamente de tu perfil',
      'Los co-investigadores deben estar registrados en el sistema',
      'Busca co-investigadores por su número de DNI',
      'Puedes agregar hasta 5 co-investigadores'
    ],
    FILES_STEP: [
      'Sube el póster en formato PDF según la plantilla oficial',
      'El formato de autorización debe estar completamente firmado',
      'Verifica que ambos archivos se suban correctamente',
      'Lee y acepta los términos antes de enviar'
    ]
  },

  // Criterios de evaluación
  EVALUATION_CRITERIA: {
    POSTER_DESIGN: {
      name: 'Diseño del Póster',
      weight: 20,
      description: 'Claridad visual, organización y estética'
    },
    SCIENTIFIC_CONTENT: {
      name: 'Contenido Científico',
      weight: 40,
      description: 'Rigor metodológico y validez científica'
    },
    INNOVATION: {
      name: 'Innovación',
      weight: 25,
      description: 'Originalidad y aporte al conocimiento'
    },
    SOCIAL_IMPACT: {
      name: 'Impacto Social',
      weight: 15,
      description: 'Relevancia y aplicabilidad social'
    }
  },

  // Configuración de localStorage
  STORAGE: {
    KEYS: {
      DRAFT_DATA: 'postulation_draft',
      USER_PREFERENCES: 'user_preferences',
      LAST_RESEARCH_LINES: 'last_research_lines'
    },
    EXPIRY_DAYS: 7 // días antes de limpiar drafts
  }
} as const;

// Labels para los pasos
export const STEP_LABELS = {
  [POSTULATION_CONFIG.STEPS.DOCUMENTS]: 'Documentos',
  [POSTULATION_CONFIG.STEPS.POSTER_INFO]: 'Póster',
  [POSTULATION_CONFIG.STEPS.INVESTIGATORS]: 'Investigadores',
  [POSTULATION_CONFIG.STEPS.FILES]: 'Archivos'
} as const;

// Documentos requeridos con metadatos
export const REQUIRED_DOCUMENTS = [
  {
    id: 'poster_format',
    title: 'Formato de póster científico',
    url: POSTULATION_CONFIG.DOCUMENTS.POSTER_FORMAT,
    type: 'download',
    description: 'Plantilla oficial para la elaboración del póster',
    required: true,
    size: '~2MB',
    format: 'PDF'
  },
  {
    id: 'instructions',
    title: 'Instructivo para elaboración de póster',
    url: POSTULATION_CONFIG.DOCUMENTS.INSTRUCTIONS,
    type: 'external',
    description: 'Guía detallada para crear tu póster científico',
    required: true,
    estimated_reading: '10 min'
  },
  {
    id: 'authorization_format',
    title: 'Formato de autorización para publicación',
    url: POSTULATION_CONFIG.DOCUMENTS.AUTHORIZATION_FORMAT,
    type: 'download',
    description: 'Documento de autorización requerido',
    required: true,
    size: '~500KB',
    format: 'PDF'
  },
  {
    id: 'evaluation_criteria',
    title: 'Criterios de evaluación',
    url: POSTULATION_CONFIG.DOCUMENTS.EVALUATION_CRITERIA,
    type: 'external',
    description: 'Conoce los criterios con los que será evaluado tu póster',
    required: false,
    estimated_reading: '5 min'
  }
] as const;

// Configuración de tipos de archivo
export const FILE_CONFIG = {
  POSTER: {
    ...POSTULATION_CONFIG.FILES.POSTER,
    mimeTypes: ['application/pdf'],
    validation: {
      dimensions: { min: { width: 594, height: 841 } }, // A4 mínimo
      pages: { max: 1 } // Solo una página
    }
  },
  AUTHORIZATION: {
    ...POSTULATION_CONFIG.FILES.AUTHORIZATION,
    mimeTypes: ['application/pdf'],
    validation: {
      pages: { max: 3 } // Máximo 3 páginas
    }
  }
} as const;

// Reglas de negocio
export const BUSINESS_RULES = {
  CO_INVESTIGATORS: {
    MAX_ALLOWED: POSTULATION_CONFIG.VALIDATION.MAX_CO_INVESTIGATORS,
    REQUIRED_FIELDS: ['dni', 'fullName', 'email', 'institution'],
    DUPLICATE_DNI_NOT_ALLOWED: true,
    PRINCIPAL_INVESTIGATOR_CANNOT_BE_CO_INVESTIGATOR: true
  },
  SUBMISSION: {
    DRAFT_AUTO_SAVE: true,
    DRAFT_AUTO_SAVE_INTERVAL: 30000, // 30 segundos
    ALLOW_MULTIPLE_SUBMISSIONS: false,
    REQUIRE_ALL_STEPS_COMPLETED: true
  },
  VALIDATION: {
    REAL_TIME_VALIDATION: true,
    SHOW_ERRORS_ON_BLUR: true,
    SHOW_SUCCESS_ON_VALID: true,
    VALIDATE_ON_STEP_CHANGE: true
  }
} as const;