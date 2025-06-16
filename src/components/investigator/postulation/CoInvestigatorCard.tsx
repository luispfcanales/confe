import { Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoInvestigator, ParticipationType } from './types';

interface CoInvestigatorCardProps {
  eventID: string;
  coInvestigator: CoInvestigator;
  index: number;
  participationTypes?: ParticipationType[]; // AGREGADO: Tipos de participación
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedData: Partial<CoInvestigator>) => void;
  onParticipationChange?: (index: number, participantTypeID: string) => void; // AGREGADO: Función para cambiar participación
  readOnly?: boolean;
}

export const CoInvestigatorCard: React.FC<CoInvestigatorCardProps> = ({
  coInvestigator,
  index,
  participationTypes = [],
  onRemove,
  onParticipationChange,
  readOnly = false
}) => {
  // Si es modo solo lectura, mostrar solo la información con select de participación
  if (readOnly) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Co-investigador {index + 1}
          </h4>
          <Button
            type="button"
            onClick={() => onRemove(index)}
            className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.fullName}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Investigador
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.investigatorType}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grado Académico
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
              {coInvestigator.academicGrade}
            </div>
          </div>
          {/* AGREGADO: Select para tipo de participación */}
          <div >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Participación <span className="text-red-500">*</span>
            </label>
            <select
              value={coInvestigator.participant_type_id || ''}
              onChange={(e) => onParticipationChange && onParticipationChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Seleccione tipo de participación</option>
              {participationTypes.map((type) => (
                <option key={type.ID} value={type.ID}>
                  {type.name}
                </option>
              ))}
            </select>
            {!coInvestigator.participant_type_id && (
              <p className="text-sm text-red-600 mt-1">Este campo es obligatorio</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Versión original para casos donde no sea solo lectura
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Co-investigador {index + 1}</h4>
        <Button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-600 hover:bg-red-700 text-sm px-2 py-1"
        >
          Eliminar
        </Button>
      </div>

      {/* Mostrar datos encontrados */}
      {coInvestigator.fullName && !coInvestigator.notFound && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grado Académico
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.academicGrade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Investigador
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.investigatorType}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institución
            </label>
            <p className="text-sm text-gray-900">{coInvestigator.institution}</p>
          </div>
          {/* AGREGADO: Select para tipo de participación en modo no readOnly */}
          {participationTypes.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Participación
              </label>
              <select
                value={coInvestigator.participant_type_id || ''}
                onChange={(e) => onParticipationChange && onParticipationChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione tipo de participación</option>
                {participationTypes.map((type) => (
                  <option key={type.ID} value={type.ID}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};