// src/hooks/usePostulationForm.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  PostulationFormData, 
  UserFromStorage, 
  ResearchLine, 
  CoInvestigator 
} from '@/components/investigator/postulation/types';
import { postulationApi } from '@/services/postulationApi';

export const usePostulationForm = (isOpen: boolean) => {
  const [formData, setFormData] = useState<PostulationFormData>({
    posterTitle: '',
    abstractText: '',
    keywords: '',
    researchArea: '',
    coInvestigators: [],
    posterFile: null,
    authorizationFile: null,
    acceptsTerms: false,
    acceptsDataProcessing: false
  });

  const [principalInvestigator, setPrincipalInvestigator] = useState<UserFromStorage | null>(null);
  const [researchLines, setResearchLines] = useState<ResearchLine[]>([]);
  const [isLoadingResearchLines, setIsLoadingResearchLines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Cargar líneas de investigación
  useEffect(() => {
    const loadResearchLines = async () => {
      if (!isOpen) return;

      setIsLoadingResearchLines(true);
      try {
        const data = await postulationApi.getResearchLines();
        
        if (data.success && data.data) {
          setResearchLines(data.data);
        } else {
          toast.error('Error al cargar las líneas de investigación');
        }
      } catch (error) {
        console.error('Error cargando líneas de investigación:', error);
        toast.error('Error al cargar las líneas de investigación');
      } finally {
        setIsLoadingResearchLines(false);
      }
    };

    loadResearchLines();
  }, [isOpen]);

  // Manejar cambios en el formulario
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

  // Manejar co-investigadores
  const addCoInvestigator = () => {
    setFormData(prev => ({
      ...prev,
      coInvestigators: [
        ...prev.coInvestigators,
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
      const userData = await postulationApi.searchCoInvestigatorByDNI(dni);
      
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
    } catch (error) {
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
  };

  // Enviar postulación
  const submitPostulation = async () => {
    setIsSubmitting(true);
    try {
      // Crear FormData para archivos (usando el tipo nativo de JavaScript)
      const submitFormData = new globalThis.FormData();
      
      // Agregar datos del formulario
      submitFormData.append('posterTitle', formData.posterTitle);
      submitFormData.append('abstractText', formData.abstractText);
      submitFormData.append('keywords', formData.keywords);
      submitFormData.append('researchArea', formData.researchArea);
      submitFormData.append('coInvestigators', JSON.stringify(formData.coInvestigators));
      
      // Agregar archivos
      if (formData.posterFile) {
        submitFormData.append('posterFile', formData.posterFile);
      }
      if (formData.authorizationFile) {
        submitFormData.append('authorizationFile', formData.authorizationFile);
      }

      await postulationApi.submitPostulation(submitFormData);
      
      toast.success('¡Postulación enviada exitosamente!');
      return true;
    } catch (error) {
      console.error('Error al enviar postulación:', error);
      toast.error('Error al enviar la postulación');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validar formulario
  const isFormValid = (currentStep: number) => {
    switch (currentStep) {
      case 2:
        return formData.posterTitle.trim() && formData.researchArea;
      case 4:
        return formData.acceptsTerms && 
               formData.acceptsDataProcessing && 
               formData.posterFile && 
               formData.authorizationFile;
      default:
        return true;
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      posterTitle: '',
      abstractText: '',
      keywords: '',
      researchArea: '',
      coInvestigators: [],
      posterFile: null,
      authorizationFile: null,
      acceptsTerms: false,
      acceptsDataProcessing: false
    });
    setPrincipalInvestigator(null);
    setResearchLines([]);
  };

  return {
    formData,
    principalInvestigator,
    researchLines,
    isLoadingResearchLines,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    addCoInvestigator,
    removeCoInvestigator,
    updateCoInvestigator,
    searchCoInvestigatorByDNI,
    submitPostulation,
    isFormValid,
    resetForm
  };
};