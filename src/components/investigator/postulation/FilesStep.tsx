// src/components/investigator/postulation/FilesStep.tsx
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
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
  const handleFileUpload = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(field, file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'doc':
      case 'docx':
        return '📝';
      default:
        return '📁';
    }
  };

  const FileUploadCard = ({ 
    title, 
    description, 
    field, 
    file, 
    acceptedTypes,
    acceptAttribute,
    required = true 
  }: {
    title: string;
    description: string;
    field: string;
    file: File | null;
    acceptedTypes: string;
    acceptAttribute: string;
    required?: boolean;
  }) => (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <FileText className="h-6 w-6 text-gray-500 mt-1" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">
            {title} {required && <span className="text-red-500">*</span>}
          </h4>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-2">
                Haz clic para seleccionar el archivo o arrástralo aquí
              </div>
              <input
                type="file"
                accept={acceptAttribute}
                onChange={handleFileUpload(field)}
                className="hidden"
                id={`file-${field}`}
              />
              <label
                htmlFor={`file-${field}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Seleccionar Archivo {acceptedTypes}
              </label>
              <div className="text-xs text-gray-500 mt-2">
                Máximo 10MB • Solo archivos {acceptedTypes}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Archivo cargado</span>
              </div>
              <div className="text-sm text-green-700">
                <div>{getFileIcon(file.name)} {file.name}</div>
                <div className="text-xs text-green-600 mt-1">
                  {formatFileSize(file.size)} • {file.type}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onFileChange(field, null)}
                className="text-sm text-red-600 hover:text-red-800 mt-2"
              >
                Eliminar archivo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Subir Archivos</h3>
        
        {/* Póster Científico - PDF */}
        <div className="mb-6">
          <FileUploadCard
            title="Póster Científico (PDF)"
            description="Sube tu póster en formato PDF siguiendo la plantilla oficial descargada en el paso 1"
            field="posterFile"
            file={formData.posterFile}
            acceptedTypes="PDF"
            acceptAttribute=".pdf"
            required={true}
          />
        </div>

        {/* Póster Científico - PPT */}
        <div className="mb-6">
          <FileUploadCard
            title="Póster Científico (PowerPoint)"
            description="Sube tu póster en formato PowerPoint (.ppt o .pptx) como archivo editable"
            field="posterFilePPT"
            file={formData.posterFilePPT}
            acceptedTypes="PPT/PPTX"
            acceptAttribute=".ppt,.pptx"
            required={true}
          />
        </div>

        {/* Formato de Autorización - Word */}
        <div className="mb-6">
          <FileUploadCard
            title="Formato de Autorización (Word)"
            description="Sube el formato de autorización completamente firmado en formato Word (.doc o .docx)"
            field="authorizationFile"
            file={formData.authorizationFile}
            acceptedTypes="DOC/DOCX"
            acceptAttribute=".doc,.docx"
            required={true}
          />
        </div>
      </div>

      {/* Términos y Condiciones */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Términos y Condiciones</h4>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptsTerms}
              onChange={(e) => onInputChange('acceptsTerms', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              <span className="font-medium">Acepto los términos y condiciones</span> del evento científico. 
              He leído y entiendo todas las bases, requisitos y criterios de evaluación.
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptsDataProcessing}
              onChange={(e) => onInputChange('acceptsDataProcessing', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              <span className="font-medium">Autorizo el tratamiento de datos personales</span> conforme 
              a la Ley de Protección de Datos Personales, para fines académicos y de investigación.
            </span>
          </label>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800 mb-2">Verificación Final</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• <strong>Póster PDF:</strong> Debe seguir exactamente la plantilla oficial</li>
              <li>• <strong>Póster PPT:</strong> Archivo editable en PowerPoint (.ppt o .pptx)</li>
              <li>• <strong>Autorización:</strong> Documento Word completamente firmado (.doc o .docx)</li>
              <li>• Todos los archivos deben ser menores a 10MB</li>
              <li>• Una vez enviada, la postulación no podrá ser modificada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};