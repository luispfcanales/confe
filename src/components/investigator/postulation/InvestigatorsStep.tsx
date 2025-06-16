// src/components/investigator/postulation/InvestigatorsStep.tsx
import { useState } from 'react';
import { Loader2, Search, UserPlus, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoInvestigatorCard } from './CoInvestigatorCard';
import { PostulationFormData, UserFromStorage, CoInvestigator, Event, CoInvestigatorFromAPI, ParticipationType } from './types';
import { showToast } from '@/utils/toast';
import { API_URL } from '@/constants/api';
import { isUserCollaborator } from './utils';

interface InvestigatorsStepProps {
  evento: Event;
  formData: PostulationFormData;
  participationTypes: ParticipationType[];
  principalInvestigator: UserFromStorage | null;
  onAddCoInvestigator: () => void;
  onRemoveCoInvestigator: (index: number) => void;
  onUpdateCoInvestigator: (index: number, updatedData: Partial<CoInvestigator>) => void;
  // onSearchCoInvestigator: (dni: string, index: number) => Promise<void>;
  onInputChange: (field: string, value: any) => void; // AGREGADO: Esta prop es necesaria
}

const baseUrl = `${API_URL}/api`;

export const InvestigatorsStep: React.FC<InvestigatorsStepProps> = ({
  evento,
  formData,
  participationTypes,
  principalInvestigator,
  onRemoveCoInvestigator,
  onUpdateCoInvestigator,
  onInputChange, // AGREGADO: Recibimos la función
}) => {
  const [searchDNI, setSearchDNI] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CoInvestigatorFromAPI | null>(null);

  // Función para buscar investigador
  const handleSearchInvestigator = async () => {
    if (!searchDNI.trim()) {
      return;
    }
    if (searchDNI === principalInvestigator?.identity_document) {
      showToast.error({
        title: 'Error al agregar co-investigador',
        description: 'Usted no puede registrarse como co-investigador.',
        duration: 4000
      });
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const response = await fetch(`${baseUrl}/users/dni/search/${searchDNI}`);
      
      if (response.ok) {
        const apiResponse = await response.json();
        const userData: CoInvestigatorFromAPI = apiResponse.data;
        
        // Verificar si es colaborador
        const isCollab = await isUserCollaborator(userData.ID, evento.id);
        console.log()

        if (!isCollab?.data.has_role) {
          setSearchResult(userData);
        } else {
          showToast.error({
            title: 'Investigador registrado',
            description: 'El investigador ya se encuentra registrado en el evento',
            duration: 4000
          });
        }
      } else {
        showToast.error({
          title: 'Error',
          description: 'Investigador no encontrado',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error buscando investigador:', error);
      showToast.error({
        title: 'Error',
        description: 'Error al buscar el investigador',
        duration: 4000
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Función para agregar el investigador encontrado
  const handleAddInvestigator = () => {
    if (!searchResult) return;

    // Verificar si ya está agregado
    const alreadyExists = formData.coInvestigators.some(
      coInv => coInv.dni === searchDNI || coInv.id === searchResult.ID
    );

    if (alreadyExists) {
      showToast.error({
        title: 'Error al agregar co-investigador',
        description: 'El co-investigador ya se encuentra en tu lista.',
        duration: 4000
      });
      return;
    }

    // Crear nuevo co-investigador
    const newCoInvestigator: CoInvestigator = {
      id: searchResult.ID,
      dni: searchDNI,
      fullName: `${searchResult.first_name} ${searchResult.last_name}`,
      email: searchResult.email,
      institution: `${searchResult.investigator.academic_departament.name} - ${searchResult.investigator.academic_departament.faculty.name}`,
      academicGrade: searchResult.investigator.academic_grade.name,
      investigatorType: searchResult.investigator.investigator_type.name,
      participant_type_id: "",
      isLoading: false,
      notFound: false
    };

    // CORREGIDO: Usar onInputChange para agregar al array
    const newCoInvestigators = [...formData.coInvestigators, newCoInvestigator];
    onInputChange('coInvestigators', newCoInvestigators);

    // Limpiar búsqueda
    setSearchDNI('');
    setSearchResult(null);
    showToast.success({
      title: 'Co-investigador agregado correctamente',
      description: 'El colaborador ya aparece en tu lista de coinvestigadores',
      duration: 4000
    });
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setSearchDNI('');
    setSearchResult(null);
  };

  // CORREGIDO: Función para manejar cambio de tipo de participación del investigador principal
  const handleParticipationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTypeID = e.target.value;
    onInputChange('investigatorPrincipalParticipationTypeID', selectedTypeID);
  };

  // AGREGADO: Función para manejar cambio de tipo de participación de co-investigadores
  const handleCoInvestigatorParticipationChange = (index: number, participantTypeID: string) => {
    const updatedCoInvestigators = [...formData.coInvestigators];
    updatedCoInvestigators[index] = {
      ...updatedCoInvestigators[index],
      participant_type_id: participantTypeID
    };
    onInputChange('coInvestigators', updatedCoInvestigators);
  };

  return (
    <div className="space-y-6">
      {/* Investigador Principal */}
      <div>
        <h3 className="text-lg text-blue-700 font-semibold mb-4">Investigador Principal</h3>
        {principalInvestigator ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={`${principalInvestigator.first_name} ${principalInvestigator.last_name}`}
                  disabled
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-blue-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Tipo de Investigador
                </label>
                <input
                  type="text"
                  value={principalInvestigator.investigator?.investigator_type?.name || 'No disponible'}
                  disabled
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-blue-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Grado Académico
                </label>
                <input
                  type="text"
                  value={principalInvestigator.investigator?.academic_grade?.name || 'No disponible'}
                  disabled
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-blue-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Tipo de Participación <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.investigatorPrincipalParticipationTypeID || ''}
                  onChange={handleParticipationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Seleccione un tipo de participación</option>
                  {participationTypes.map((type) => (
                    <option key={type.ID} value={type.ID}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {!formData.investigatorPrincipalParticipationTypeID && (
                  <p className="text-sm text-red-600 mt-1">Este campo es obligatorio</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Cargando datos del investigador principal...</p>
          </div>
        )}
      </div>

      <div className="border-t-2 border-dashed border-blue-500 my-6"></div>

      {/* Co-investigadores */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Co-investigadores</h3>
        
        {/* Buscador único */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
            Agregar Co-investigador
          </h4>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI del Co-investigador *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchDNI}
                    onChange={(e) => setSearchDNI(e.target.value)}
                    placeholder="Ingrese el DNI del investigador"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchInvestigator()}
                  />
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  {searchDNI && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleSearchInvestigator}
                  disabled={!searchDNI.trim() || isSearching}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Resultado de búsqueda */}
            {searchResult && (
              <div className="bg-white border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-green-800 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Investigador encontrado
                  </h5>
                  <button
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nombre Completo:</span>
                    <p className="text-sm text-gray-900">{`${searchResult.first_name} ${searchResult.last_name}`}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-sm text-gray-900">{searchResult.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Grado Académico:</span>
                    <p className="text-sm text-gray-900">{searchResult.investigator?.academic_grade?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Tipo de Investigador:</span>
                    <p className="text-sm text-gray-900">{searchResult.investigator?.investigator_type?.name}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-600">Institución:</span>
                    <p className="text-sm text-gray-900">
                      {`${searchResult.investigator?.academic_departament?.name} - ${searchResult.investigator?.academic_departament?.faculty?.name}`}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={handleAddInvestigator}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar como Co-investigador
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Co-investigadores agregados */}
        <div className="space-y-4">
          {formData.coInvestigators.length > 0 ? (
            formData.coInvestigators.map((coInvestigator, index) => (
              <CoInvestigatorCard
                eventID={evento.id}
                key={index}
                coInvestigator={coInvestigator}
                index={index}
                participationTypes={participationTypes} // AGREGADO: Pasamos los tipos de participación
                onRemove={onRemoveCoInvestigator}
                onUpdate={onUpdateCoInvestigator}
                onParticipationChange={handleCoInvestigatorParticipationChange} // AGREGADO: Función para cambiar participación
                readOnly={true}
              />
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No hay co-investigadores agregados</p>
              <p className="text-sm text-gray-500 mt-1">
                Utiliza el buscador para agregar colaboradores a tu investigación
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};