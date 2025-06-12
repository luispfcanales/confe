// src/components/investigator/postulation/InvestigatorsStep.tsx
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoInvestigatorCard } from './CoInvestigatorCard';
import { PostulationFormData, UserFromStorage, CoInvestigator } from './types';

interface InvestigatorsStepProps {
  formData: PostulationFormData;
  principalInvestigator: UserFromStorage | null;
  onAddCoInvestigator: () => void;
  onRemoveCoInvestigator: (index: number) => void;
  onUpdateCoInvestigator: (index: number, updatedData: Partial<CoInvestigator>) => void;
  onSearchCoInvestigator: (dni: string, index: number) => Promise<void>;
}

export const InvestigatorsStep: React.FC<InvestigatorsStepProps> = ({
  formData,
  principalInvestigator,
  onAddCoInvestigator,
  onRemoveCoInvestigator,
  onUpdateCoInvestigator,
  onSearchCoInvestigator
}) => {
  return (
    <div className="space-y-6">
      {/* Investigador Principal */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Investigador Principal</h3>
        {principalInvestigator ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={`${principalInvestigator.first_name} ${principalInvestigator.last_name}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={principalInvestigator.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grado Académico
                </label>
                <input
                  type="text"
                  value={principalInvestigator.investigator.academic_grade.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Investigador
                </label>
                <input
                  type="text"
                  value={principalInvestigator.investigator.investigator_type.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                <input
                  type="text"
                  value={`${principalInvestigator.investigator.academic_departament.name} - ${principalInvestigator.investigator.academic_departament.faculty.name}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
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

      {/* Co-investigadores */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Co-investigadores</h3>
          <Button
            type="button"
            onClick={onAddCoInvestigator}
            className="bg-green-600 hover:bg-green-700"
          >
            Agregar Co-investigador
          </Button>
        </div>

        {formData.coInvestigators.map((coInvestigator, index) => (
          <CoInvestigatorCard
            key={index}
            coInvestigator={coInvestigator}
            index={index}
            onRemove={onRemoveCoInvestigator}
            onUpdate={onUpdateCoInvestigator}
            // onSearch={onSearchCoInvestigator}
          />
        ))}

        {formData.coInvestigators.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600">No hay co-investigadores agregados</p>
            <p className="text-sm text-gray-500 mt-1">Haz clic en "Agregar Co-investigador" para añadir colaboradores</p>
          </div>
        )}
      </div>
    </div>
  );
};