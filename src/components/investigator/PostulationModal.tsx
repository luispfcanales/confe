import { useState, useEffect } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importar tipos y componentes
import { 
  PostulationModalProps,
  PostulationFormData,
  UserFromStorage,
  ResearchLine,
  ResearchLinesResponse,
  CoInvestigator,
  ParticipationType
} from './postulation/types';
import { DocumentsStep } from './postulation/DocumentsStep';
import { PosterInfoStep } from './postulation/PosterInfoStep';
import { InvestigatorsStep } from './postulation/InvestigatorsStep';
import { FilesStep } from './postulation/FilesStep';
import { showToast } from '@/utils/toast';
import { API_URL } from '@/constants/api';
import { fetchParticipationTypes, isUserCollaborator } from './postulation/utils';

export const PostulationModal: React.FC<PostulationModalProps> = ({
  event,
  isOpen,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [principalInvestigator, setPrincipalInvestigator] = useState<UserFromStorage | null>(null);
  const [participationTypes, setParticipationTypes] = useState<ParticipationType[]>([]);
  const [researchLines, setResearchLines] = useState<ResearchLine[]>([]);
  const [isLoadingResearchLines, setIsLoadingResearchLines] = useState(false);
  
  // Cambios principales: estado de carga y valor inicial null
  const [isCollaborator, setIsCollaborator] = useState<boolean | null>(null);
  const [isCheckingCollaborator, setIsCheckingCollaborator] = useState(false);
  
  const [formData, setFormData] = useState<PostulationFormData>({
    posterTitle: '',
    researchArea: '',
    investigatorPrincipal: '',
    investigatorPrincipalParticipationTypeID: '',
    idUploadDirFile: '',
    coInvestigators: [],
    posterFile: null,
    posterFilePPT: null,
    authorizationFile: null,
    acceptsTerms: false,
    acceptsDataProcessing: false
  });

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await fetchParticipationTypes();
        setParticipationTypes(types);
      } catch (error) {
        console.error('Error loading participation types:', error);
      }
    };
    
    if (isOpen) {
      loadTypes();
    }
  }, [isOpen]);

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const userData: UserFromStorage = JSON.parse(userDataString);
          setPrincipalInvestigator(userData);
        }
      } catch (error) {
        console.error('Error al cargar datos de Sesion:', error);
        showToast.error({
          title: 'Error',
          description: 'No se pudieron cargar los datos del usuario',
          duration: 3000
        });
      }
    }
  }, [isOpen]);

  // Cargar líneas de investigación desde la API
  useEffect(() => {
    const loadResearchLines = async () => {
      setIsLoadingResearchLines(true);
      try {
        const response = await fetch(`${API_URL}/api/general/line-investigation`);
        if (response.ok) {
          const data: ResearchLinesResponse = await response.json();
          
          if (data.success && data.data) {
            setResearchLines(data.data);
          } else {
            showToast.error({
              title: 'Error',
              description: 'No se pudieron cargar las líneas de investigación',
              duration: 3000
            });
          }
        } else {
          showToast.error({
            title: 'Error',
            description: 'No se pudieron cargar las líneas de investigación',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('Error cargando líneas de investigación:', error);
        showToast.error({
          title: 'Error',
          description: 'Error al cargar las líneas de investigación',
          duration: 3000
        });
      } finally {
        setIsLoadingResearchLines(false);
      }
    };

    if (isOpen) {
      loadResearchLines();
    }
  }, [isOpen]);

  // Efecto para resetear estados y re-verificar cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      // Resetear estados al abrir
      setIsCollaborator(null);
      setIsCheckingCollaborator(false);
      setCurrentStep(1);
      
      // Re-verificar el estado de colaborador cuando se abre el modal
      if (principalInvestigator && event) {
        const checkCollaboratorStatus = async () => {
          setIsCheckingCollaborator(true);
          try {
            const response = await isUserCollaborator(principalInvestigator.ID, event.id);
            setIsCollaborator(!!response?.data.has_role);
          } catch (error) {
            console.error('Error checking collaborator status:', error);
            setIsCollaborator(false);
          } finally {
            setIsCheckingCollaborator(false);
          }
        };
        
        checkCollaboratorStatus();
      }
    }
  }, [isOpen, principalInvestigator?.ID, event?.id]);

  if (!isOpen || !event) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const addCoInvestigator = () => {
    setFormData(prev => ({
      ...prev,
      coInvestigators: [
        {
          id: '',
          dni: '',
          fullName: '',
          email: '',
          institution: '',
          academicGrade: '',
          investigatorType: '',
          participant_type_id: "",
          isLoading: false,
          notFound: false
        },
        ...prev.coInvestigators
      ]
    }));
  };

  const removeCoInvestigator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coInvestigators: prev.coInvestigators.filter((_, i) => i !== index)
    }));
  };

  const updateCoInvestigator = (index: number, updatedData: Partial<CoInvestigator>) => {
    const updatedCoInvestigators = [...formData.coInvestigators];
    updatedCoInvestigators[index] = {
      ...updatedCoInvestigators[index],
      ...updatedData
    };
    setFormData(prev => ({ ...prev, coInvestigators: updatedCoInvestigators }));
  };

  const handleNextStep = () => {
    // Limpiar co-investigadores vacíos al avanzar desde el paso 3
    if (currentStep === 3) {
      const cleanedCoInvestigators = formData.coInvestigators.filter(coInvestigator => 
        // Mantener si tiene datos completos
        (coInvestigator.id && 
         coInvestigator.id.trim() !== '' &&
         coInvestigator.dni && 
         coInvestigator.dni.trim() !== '' &&
         coInvestigator.fullName && 
         coInvestigator.fullName.trim() !== '' &&
         !coInvestigator.notFound) ||
        // O mantener si está siendo editado (tiene DNI pero aún no se ha buscado)
        (coInvestigator.dni && 
         coInvestigator.dni.trim() !== '' && 
         coInvestigator.fullName === '' && 
         !coInvestigator.notFound)
      );
      
      if (cleanedCoInvestigators.length !== formData.coInvestigators.length) {
        setFormData(prev => ({
          ...prev,
          coInvestigators: cleanedCoInvestigators
        }));
        showToast.info({
          title: 'Info',
          description: 'Se eliminaron los co-investigadores sin datos',
          duration: 3000
        });
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Limpiar co-investigadores vacíos antes del envío
      const cleanedCoInvestigators = formData.coInvestigators.filter(coInvestigator => 
        coInvestigator.id && 
        coInvestigator.id.trim() !== '' &&
        coInvestigator.dni && 
        coInvestigator.dni.trim() !== '' &&
        coInvestigator.fullName && 
        coInvestigator.fullName.trim() !== '' &&
        coInvestigator.email && 
        coInvestigator.email.trim() !== '' &&
        !coInvestigator.notFound &&
        !coInvestigator.isLoading
      );
  
      // Crear FormData para envío con archivos
      const submitFormData = new globalThis.FormData();
      
      // Agregar datos del formulario
      submitFormData.append('eventId', event.id);
      submitFormData.append('posterTitle', formData.posterTitle);
      submitFormData.append('research_line', formData.researchArea);
      submitFormData.append('id_path_drive_file_posters', event.id_path_drive_file_posters);
      submitFormData.append('coInvestigators', JSON.stringify(cleanedCoInvestigators));
      submitFormData.append('acceptsTerms', formData.acceptsTerms.toString());
      submitFormData.append('acceptsDataProcessing', formData.acceptsDataProcessing.toString());
      
      // Agregar archivos
      if (formData.posterFile) {
        submitFormData.append('posterFile', formData.posterFile);
      }
      if (formData.posterFilePPT) {
        submitFormData.append('posterPPTFile', formData.posterFilePPT);
      } 
      if (formData.authorizationFile) {
        submitFormData.append('authorizationFile', formData.authorizationFile);
      }
      
      // Hacer el POST real
      const response = await fetch(`${API_URL}/api/investigators/register/${principalInvestigator?.investigator_id}/poster-collaborators`, {
        method: 'POST',
        body: submitFormData,
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      
      // IMPORTANTE: Actualizar el estado para reflejar que ahora es colaborador
      setIsCollaborator(true);
      
      showToast.success({
        title: 'Datos registrados',
        description: 'Se realizó el registro al evento.',
        duration: 4000
      });
      
      // Resetear formulario
      setFormData({
        posterTitle: '',
        researchArea: '',
        investigatorPrincipal: '',
        investigatorPrincipalParticipationTypeID: '',
        idUploadDirFile: '',
        coInvestigators: [],
        posterFile: null,
        posterFilePPT: null,
        authorizationFile: null,
        acceptsTerms: false,
        acceptsDataProcessing: false
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error al enviar:', error);
      showToast.error({
        title: 'Error',
        description: 'Error al enviar la postulación',
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Solo lectura de documentos
      case 2:
        return formData.posterTitle.trim() && formData.researchArea;
      case 3:
        // Validar:
        // 1. Que el investigador principal tenga tipo de participación
        // 2. Que haya al menos un co-investigador
        // 3. Que todos los co-investigadores tengan tipo de participación
        const principalHasParticipationType = 
          formData.investigatorPrincipalParticipationTypeID && 
          formData.investigatorPrincipalParticipationTypeID.trim() !== '';
        
        const hasAtLeastOneCoInvestigator = formData.coInvestigators.length > 0;
        
        const allCoInvestigatorsHaveParticipationType = formData.coInvestigators.every(
          coInv => coInv.participant_type_id && coInv.participant_type_id.trim() !== ''
        );
        
        return principalHasParticipationType && 
               hasAtLeastOneCoInvestigator && 
               allCoInvestigatorsHaveParticipationType;
      case 4:
        return formData.acceptsTerms && 
               formData.acceptsDataProcessing && 
               formData.posterFile && 
               formData.posterFilePPT &&
               formData.authorizationFile;
      default:
        return true;
    }
  };

  // Función para determinar si se debe mostrar el botón de siguiente/enviar deshabilitado
  const shouldDisableNextButton = () => {
    // Si aún se está verificando el estado de colaborador, deshabilitar
    if (isCheckingCollaborator) return true;
    
    // Si ya es colaborador, deshabilitar
    if (isCollaborator === true) return true;
    
    // Si el formulario no es válido, deshabilitar
    if (!isFormValid()) return true;
    
    return false;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DocumentsStep
            event={event}
            isCollaborator={isCollaborator ?? false}
          />
        );
      case 2:
        return (
          <PosterInfoStep
            formData={formData}
            researchLines={researchLines}
            isLoadingResearchLines={isLoadingResearchLines}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <InvestigatorsStep
            evento={event}
            formData={formData}
            participationTypes={participationTypes}
            principalInvestigator={principalInvestigator}
            onAddCoInvestigator={addCoInvestigator}
            onRemoveCoInvestigator={removeCoInvestigator}
            onUpdateCoInvestigator={updateCoInvestigator}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <FilesStep
            formData={formData}
            onFileChange={handleFileChange}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
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
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Paso {currentStep} de 4
            {isCheckingCollaborator && (
              <span className="ml-2 flex items-center">
                <Loader className="h-3 w-3 animate-spin mr-1" />
                Verificando...
              </span>
            )}
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
                onClick={handleNextStep}
                disabled={shouldDisableNextButton()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCheckingCollaborator ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Verificando...
                  </>
                ) : (
                  'Siguiente'
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={shouldDisableNextButton() || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Postulación'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};