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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Póster *
            </label>
            <input
              type="text"
              value={formData.posterTitle}
              onChange={(e) => onInputChange('posterTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el título completo de su investigación"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Línea de Investigación *
            </label>
            {isLoadingResearchLines ? (
              <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Cargando líneas de investigación...</span>
              </div>
            ) : (
              <select
                value={formData.researchArea}
                onChange={(e) => onInputChange('researchArea', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una línea de investigación</option>
                {researchLines.map(line => (
                  <option key={line.key} value={line.value}>
                    {line.value}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen/Abstract *
            </label>
            <textarea
              value={formData.abstractText}
              onChange={(e) => onInputChange('abstractText', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el resumen de su investigación (máximo 250 palabras)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palabras Clave *
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => onInputChange('keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese palabras clave separadas por comas (máximo 5)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};