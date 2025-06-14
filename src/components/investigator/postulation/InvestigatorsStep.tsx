// src/components/investigator/postulation/InvestigatorsStep.tsx
import { useState } from 'react';
import { Loader2, Search, UserPlus, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoInvestigatorCard } from './CoInvestigatorCard';
import { PostulationFormData, UserFromStorage, CoInvestigator, Event, CoInvestigatorFromAPI } from './types';
import { toast } from 'sonner';
import { API_URL } from '@/constants/api';
import { isUserCollaborator } from './utils';

interface InvestigatorsStepProps {
  evento: Event;
  formData: PostulationFormData;
  principalInvestigator: UserFromStorage | null;
  onAddCoInvestigator: () => void;
  onRemoveCoInvestigator: (index: number) => void;
  onUpdateCoInvestigator: (index: number, updatedData: Partial<CoInvestigator>) => void;
  onSearchCoInvestigator: (dni: string, index: number) => Promise<void>;
}

const baseUrl = `${API_URL}/api`;

export const InvestigatorsStep: React.FC<InvestigatorsStepProps> = ({
  evento,
  formData,
  principalInvestigator,
  onRemoveCoInvestigator,
  onUpdateCoInvestigator,
}) => {
  const [searchDNI, setSearchDNI] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CoInvestigatorFromAPI | null>(null);

  // Función para buscar investigador
  const handleSearchInvestigator = async () => {
    if (!searchDNI.trim()) {
      toast.error('Por favor ingrese un DNI válido');
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
        
        if (isCollab) {
          setSearchResult(userData);
          toast.success('Investigador encontrado');
        } else {
          toast.error('El investigador no está registrado como colaborador en este evento');
        }
      } else {
        toast.error('Investigador no encontrado');
      }
    } catch (error) {
      console.error('Error buscando investigador:', error);
      toast.error('Error al buscar el investigador');
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
      toast.error('Este investigador ya ha sido agregado');
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
      isLoading: false,
      notFound: false
    };

    // Agregar al array existente
    const newIndex = formData.coInvestigators.length;
    onUpdateCoInvestigator(newIndex, newCoInvestigator);

    // Limpiar búsqueda
    setSearchDNI('');
    setSearchResult(null);
    toast.success('Co-investigador agregado correctamente');
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setSearchDNI('');
    setSearchResult(null);
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
                  value={principalInvestigator.investigator.investigator_type.name}
                  disabled
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-blue-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div >
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Facultad
                </label>
                <input
                  type="text"
                  value={`${principalInvestigator.investigator.academic_departament.faculty.name}`}
                  disabled
                  className="w-full px-3 py-2 border border-blue-300 rounded-md bg-blue-100 text-gray-600 cursor-not-allowed"
                />
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

      {/* <div className="my-8 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div> */}
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
                    <p className="text-sm text-gray-900">{searchResult.investigator?.academic_grade.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Tipo de Investigador:</span>
                    <p className="text-sm text-gray-900">{searchResult.investigator?.investigator_type.name}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-600">Institución:</span>
                    <p className="text-sm text-gray-900">
                      {`${searchResult.investigator?.academic_departament.name} - ${searchResult.investigator?.academic_departament.faculty.name}`}
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
                onRemove={onRemoveCoInvestigator}
                onUpdate={onUpdateCoInvestigator}
                readOnly={true} // Nueva prop para hacer solo lectura
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