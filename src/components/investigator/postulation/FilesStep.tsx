// src/components/investigator/postulation/FilesStep.tsx
import { Upload } from 'lucide-react';
import { PostulationFormData } from './types';

interface FilesStepProps {
  formData: PostulationFormData;
  onFileChange: (field: string, file: File | null) => void;
  onInputChange: (field: string, value: any) => void;
}

export const FilesStep: React.FC<FilesStepProps> = ({
  formData,
  onFileChange,
  onInputChange
}) => {
  return (
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
                onChange={(e) => onFileChange('posterFile', e.target.files?.[0] || null)}
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
                onChange={(e) => onFileChange('authorizationFile', e.target.files?.[0] || null)}
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
              onChange={(e) => onInputChange('acceptsTerms', e.target.checked)}
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
              onChange={(e) => onInputChange('acceptsDataProcessing', e.target.checked)}
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
};