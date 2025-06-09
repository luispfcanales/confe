// src/components/investigator/PostulationModal.tsx
import { useState } from 'react';
import { X, Download, ExternalLink, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  deadline: string;
}

interface PostulationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Información del póster
  posterTitle: string;
  abstractText: string;
  keywords: string;
  researchArea: string;
  
  // Información del investigador principal
  principalInvestigator: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    academicDegree: string;
    investigatorType: string;
  };
  
  // Co-investigadores
  coInvestigators: Array<{
    fullName: string;
    email: string;
    institution: string;
    role: string;
  }>;
  
  // Archivos
  posterFile: File | null;
  authorizationFile: File | null;
  additionalDocuments: File[];
  
  // Aceptación de términos
  acceptsTerms: boolean;
  acceptsDataProcessing: boolean;
}

export const PostulationModal: React.FC<PostulationModalProps> = ({
  event,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    posterTitle: '',
    abstractText: '',
    keywords: '',
    researchArea: '',
    principalInvestigator: {
      fullName: user ? `${user.first_name} ${user.last_name}` : '',
      email: user?.email || '',
      phone: '',
      institution: '',
      academicDegree: '',
      investigatorType: ''
    },
    coInvestigators: [],
    posterFile: null,
    authorizationFile: null,
    additionalDocuments: [],
    acceptsTerms: false,
    acceptsDataProcessing: false
  });

  const documents = [
    {
      title: 'Formato de póster científico',
      url: 'https://bit.ly/confericis2024-poster-unamad',
      icon: Download,
      description: 'Plantilla oficial para la elaboración del póster'
    },
    {
      title: 'Instructivo para elaboración de póster',
      url: 'https://bit.ly/confrecis2024unamad-instructivo',
      icon: ExternalLink,
      description: 'Guía detallada para crear tu póster científico'
    },
    {
      title: 'Formato de autorización para publicación',
      url: 'https://bit.ly/confrecis2024unamad-autorizacion',
      icon: Download,
      description: 'Documento de autorización requerido'
    },
    {
      title: 'Criterios de evaluación',
      url: 'https://bit.ly/confrecis2024unamad-criterios',
      icon: ExternalLink,
      description: 'Conoce los criterios con los que será evaluado tu póster'
    }
  ];

  const researchAreas = [
    'Ciencias de la Salud',
    'Ciencias Ambientales',
    'Ciencias Sociales',
    'Ingeniería y Tecnología',
    'Ciencias Agrarias',
    'Educación',
    'Economía y Administración',
    'Otro'
  ];

  const investigatorTypes = [
    'Investigador Principal',
    'Investigador Asociado',
    'Investigador Junior',
    'Estudiante de Pregrado',
    'Estudiante de Postgrado',
    'Docente Investigador'
  ];

  const academicDegrees = [
    'Bachiller',
    'Licenciado/a',
    'Ingeniero/a',
    'Magíster',
    'Doctor/a',
    'Otro'
  ];

  if (!isOpen || !event) return null;

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addCoInvestigator = () => {
    setFormData(prev => ({
      ...prev,
      coInvestigators: [
        ...prev.coInvestigators,
        {
          fullName: '',
          email: '',
          institution: '',
          role: ''
        }
      ]
    }));
  };

  const removeCoInvestigator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coInvestigators: prev.coInvestigators.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('¡Postulación enviada exitosamente!');
      onClose();
    } catch (error) {
      toast.error('Error al enviar la postulación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="font-medium text-red-800">
            CIERRE DE POSTULACIONES: LUNES 17 DE JUNIO DE 2024 (23:59 horas)
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Documentos Obligatorios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <doc.icon className="h-5 w-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    Descargar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Instrucciones Importantes:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Descarga y revisa todos los documentos antes de continuar</li>
          <li>• El póster debe seguir estrictamente el formato proporcionado</li>
          <li>• Todos los archivos deben estar en formato PDF</li>
          <li>• Completa el formulario de autorización y súbelo firmado</li>
        </ul>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Información del Póster</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Póster *
            </label>
            <input
              type="text"
              value={formData.posterTitle}
              onChange={(e) => handleInputChange('posterTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el título completo de su investigación"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área de Investigación *
            </label>
            <select
              value={formData.researchArea}
              onChange={(e) => handleInputChange('researchArea', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un área</option>
              {researchAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen/Abstract *
            </label>
            <textarea
              value={formData.abstractText}
              onChange={(e) => handleInputChange('abstractText', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escriba el resumen de su investigación (máximo 300 palabras)"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.abstractText.length}/300 palabras
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palabras Clave *
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Separe las palabras clave con comas (ej: investigación, ciencia, impacto social)"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Investigador Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.principalInvestigator.fullName}
              onChange={(e) => handleInputChange('principalInvestigator.fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.principalInvestigator.email}
              onChange={(e) => handleInputChange('principalInvestigator.email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.principalInvestigator.phone}
              onChange={(e) => handleInputChange('principalInvestigator.phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institución *
            </label>
            <input
              type="text"
              value={formData.principalInvestigator.institution}
              onChange={(e) => handleInputChange('principalInvestigator.institution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grado Académico *
            </label>
            <select
              value={formData.principalInvestigator.academicDegree}
              onChange={(e) => handleInputChange('principalInvestigator.academicDegree', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione</option>
              {academicDegrees.map(degree => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Investigador *
            </label>
            <select
              value={formData.principalInvestigator.investigatorType}
              onChange={(e) => handleInputChange('principalInvestigator.investigatorType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione</option>
              {investigatorTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Co-investigadores */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Co-investigadores</h3>
          <Button
            type="button"
            onClick={addCoInvestigator}
            className="bg-green-600 hover:bg-green-700"
          >
            Agregar Co-investigador
          </Button>
        </div>

        {formData.coInvestigators.map((coInvestigator, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Co-investigador {index + 1}</h4>
              <Button
                type="button"
                onClick={() => removeCoInvestigator(index)}
                className="bg-red-600 hover:bg-red-700 text-sm px-2 py-1"
              >
                Eliminar
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={coInvestigator.fullName}
                onChange={(e) => {
                  const newCoInvestigators = [...formData.coInvestigators];
                  newCoInvestigators[index].fullName = e.target.value;
                  setFormData(prev => ({ ...prev, coInvestigators: newCoInvestigators }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={coInvestigator.email}
                onChange={(e) => {
                  const newCoInvestigators = [...formData.coInvestigators];
                  newCoInvestigators[index].email = e.target.value;
                  setFormData(prev => ({ ...prev, coInvestigators: newCoInvestigators }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Institución"
                value={coInvestigator.institution}
                onChange={(e) => {
                  const newCoInvestigators = [...formData.coInvestigators];
                  newCoInvestigators[index].institution = e.target.value;
                  setFormData(prev => ({ ...prev, coInvestigators: newCoInvestigators }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Rol en la investigación"
                value={coInvestigator.role}
                onChange={(e) => {
                  const newCoInvestigators = [...formData.coInvestigators];
                  newCoInvestigators[index].role = e.target.value;
                  setFormData(prev => ({ ...prev, coInvestigators: newCoInvestigators }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Archivos Requeridos</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Póster Científico (PDF) *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('posterFile', e.target.files?.[0] || null)}
                className="hidden"
                id="poster-file"
              />
              <label htmlFor="poster-file" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.posterFile 
                      ? formData.posterFile.name 
                      : 'Haga clic para seleccionar el archivo PDF del póster'
                    }
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Autorización Firmado (PDF) *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('authorizationFile', e.target.files?.[0] || null)}
                className="hidden"
                id="authorization-file"
              />
              <label htmlFor="authorization-file" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.authorizationFile 
                      ? formData.authorizationFile.name 
                      : 'Haga clic para seleccionar el formato de autorización firmado'
                    }
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Aceptación de Términos</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptsTerms}
              onChange={(e) => handleInputChange('acceptsTerms', e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              Acepto los términos y condiciones del evento. Confirmo que la información 
              proporcionada es veraz y que el póster es trabajo original de los autores listados.
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptsDataProcessing}
              onChange={(e) => handleInputChange('acceptsDataProcessing', e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              Autorizo el tratamiento de mis datos personales de acuerdo con la política 
              de privacidad de la Universidad Nacional Amazónica de Madre de Dios.
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const isFormValid = () => {
    if (currentStep === 4) {
      return formData.acceptsTerms && 
             formData.acceptsDataProcessing && 
             formData.posterFile && 
             formData.authorizationFile;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-xl font-bold">
              FORMULARIO DE POSTULACIÓN
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              «{event.title}»
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                <span className="ml-2 text-sm font-medium">
                  {step === 1 && 'Documentos'}
                  {step === 2 && 'Póster'}
                  {step === 3 && 'Investigadores'}
                  {step === 4 && 'Archivos'}
                </span>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Paso {currentStep} de 4
          </div>
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
              >
                Anterior
              </Button>
            )}
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Postulación'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};