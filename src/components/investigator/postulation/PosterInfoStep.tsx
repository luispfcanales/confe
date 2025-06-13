// src/components/investigator/postulation/PosterInfoStep.tsx
import { Loader2 } from 'lucide-react';
import { PostulationFormData, ResearchLine } from './types';

interface PosterInfoStepProps {
  formData: PostulationFormData;
  researchLines: ResearchLine[];
  isLoadingResearchLines: boolean;
  onInputChange: (field: string, value: any) => void;
}

export const PosterInfoStep: React.FC<PosterInfoStepProps> = ({
  formData,
  researchLines,
  isLoadingResearchLines,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Información del Póster</h3>
        
        {/* Título del Póster */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del Póster *
          </label>
          <input
            type="text"
            placeholder="Ingrese el título completo de su investigación"
            value={formData.posterTitle}
            onChange={(e) => onInputChange('posterTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.posterTitle.length}/200 caracteres
          </div>
        </div>

        {/* Línea de Investigación */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Línea de Investigación *
          </label>
          {isLoadingResearchLines ? (
            <div className="flex items-center space-x-2 p-3 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Cargando líneas de investigación...</span>
            </div>
          ) : (
            <select
              value={formData.researchArea}
              onChange={(e) => onInputChange('researchArea', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione una línea de investigación</option>
              {researchLines.map((line) => (
                <option key={line.key} value={line.value}>
                  {line.value}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Instrucciones:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• El título debe ser descriptivo y específico</li>
          <li>• Selecciona la línea de investigación más apropiada para tu trabajo</li>
          <li>• Asegúrate de que el título refleje el contenido de tu póster</li>
        </ul>
      </div>
    </div>
  );
};