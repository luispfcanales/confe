import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Importar tipos y componentes
import { 
  PostulationModalProps,
  PostulationFormData,
  UserFromStorage,
  ResearchLine,
  ResearchLinesResponse,
  CoInvestigator,
  CoInvestigatorFromAPI
} from './postulation/types';
import { DocumentsStep } from './postulation/DocumentsStep';
import { PosterInfoStep } from './postulation/PosterInfoStep';
import { InvestigatorsStep } from './postulation/InvestigatorsStep';
import { FilesStep } from './postulation/FilesStep';

export const PostulationModal: React.FC<PostulationModalProps> = ({
  event,
  isOpen,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [principalInvestigator, setPrincipalInvestigator] = useState<UserFromStorage | null>(null);
  const [researchLines, setResearchLines] = useState<ResearchLine[]>([]);
  const [isLoadingResearchLines, setIsLoadingResearchLines] = useState(false);
  
  const [formData, setFormData] = useState<PostulationFormData>({
    posterTitle: '',
    researchArea: '',
    coInvestigators: [],
    posterFile: null,
    authorizationFile: null,
    acceptsTerms: false,
    acceptsDataProcessing: false
  });

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
        console.error('Error al cargar datos del usuario:', error);
        toast.error('Error al cargar los datos del usuario');
      }
    }
  }, [isOpen]);

  // Cargar líneas de investigación desde la API
  useEffect(() => {
    const loadResearchLines = async () => {
      setIsLoadingResearchLines(true);
      try {
        const response = await fetch('http://localhost:3000/api/general/line-investigation');
        
        if (response.ok) {
          const data: ResearchLinesResponse = await response.json();
          
          if (data.success && data.data) {
            setResearchLines(data.data);
          } else {
            toast.error('Error al cargar las líneas de investigación');
          }
        } else {
          toast.error('Error al conectar con el servidor para cargar las líneas de investigación');
        }
      } catch (error) {
        console.error('Error cargando líneas de investigación:', error);
        toast.error('Error al cargar las líneas de investigación');
      } finally {
        setIsLoadingResearchLines(false);
      }
    };

    if (isOpen) {
      loadResearchLines();
    }
  }, [isOpen]);

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

  // Buscar co-investigador por DNI
  const searchCoInvestigatorByDNI = async (dni: string, index: number) => {
    if (!dni.trim()) return;

    updateCoInvestigator(index, { isLoading: true, notFound: false });

    try {
      const response = await fetch(`http://localhost:3000/api/users/search/dni/${dni}`);
      
      if (response.ok) {
        const userData: CoInvestigatorFromAPI = await response.json();
        
        updateCoInvestigator(index, {
          id: userData.ID,
          fullName: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          institution: `${userData.investigator.academic_departament.name} - ${userData.investigator.academic_departament.faculty.name}`,
          academicGrade: userData.investigator.academic_grade.name,
          investigatorType: userData.investigator.investigator_type.name,
          isLoading: false,
          notFound: false
        });
        
        toast.success('Investigador encontrado');
      } else {
        updateCoInvestigator(index, {
          isLoading: false,
          notFound: true,
          fullName: '',
          email: '',
          institution: '',
          academicGrade: '',
          investigatorType: ''
        });
        toast.error('Investigador no encontrado');
      }
    } catch (error) {
      console.error('Error buscando investigador:', error);
      updateCoInvestigator(index, {
        isLoading: false,
        notFound: true
      });
      toast.error('Error al buscar el investigador');
    }
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
        toast.info('Se eliminaron los co-investigadores sin datos');
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

      console.log('Datos del formulario:', {
        ...formData,
        coInvestigators: cleanedCoInvestigators
      });
      console.log('Línea de investigación seleccionada:', formData.researchArea);
      console.log('Co-investigadores válidos:', cleanedCoInvestigators.length);
      
      // Crear FormData para envío con archivos
      const submitFormData = new globalThis.FormData();
      
      // Agregar datos del formulario
      submitFormData.append('eventId', event.id);
      submitFormData.append('posterTitle', formData.posterTitle);
      submitFormData.append('researchArea', formData.researchArea);
      submitFormData.append('coInvestigators', JSON.stringify(cleanedCoInvestigators));
      
      // Agregar archivos
      if (formData.posterFile) {
        submitFormData.append('posterFile', formData.posterFile);
      }
      if (formData.authorizationFile) {
        submitFormData.append('authorizationFile', formData.authorizationFile);
      }

      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('¡Postulación enviada exitosamente!');
      
      // Resetear formulario
      setFormData({
        posterTitle: '',
        researchArea: '',
        coInvestigators: [],
        posterFile: null,
        authorizationFile: null,
        acceptsTerms: false,
        acceptsDataProcessing: false
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      toast.error('Error al enviar la postulación');
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
        return true; // Investigador principal es automático
      case 4:
        return formData.acceptsTerms && 
               formData.acceptsDataProcessing && 
               formData.posterFile && 
               formData.authorizationFile;
      default:
        return true;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DocumentsStep event={event} />;
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
            formData={formData}
            principalInvestigator={principalInvestigator}
            onAddCoInvestigator={addCoInvestigator}
            onRemoveCoInvestigator={removeCoInvestigator}
            onUpdateCoInvestigator={updateCoInvestigator}
            onSearchCoInvestigator={searchCoInvestigatorByDNI}
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
                disabled={!isFormValid()}
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