// src/components/investigator/postulation/DocumentsStep.tsx
import { AlertCircle, Download, ExternalLink } from 'lucide-react';
import { Event } from './types';

interface DocumentsStepProps {
  event: Event;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ event }) => {
  const documents = [
    {
      title: 'Formato de póster científico',
      url: 'https://bit.ly/confericis2025-poster-unamad',
      icon: Download,
      description: 'Plantilla oficial para la elaboración del póster'
    },
    {
      title: 'Instructivo para elaboración de póster',
      url: 'https://bit.ly/confericis2025unamad-instructivo',
      icon: ExternalLink,
      description: 'Guía detallada para crear tu póster científico'
    },
    {
      title: 'Formato de autorización para publicación',
      url: 'https://bit.ly/confericis2025unamad-autorizacion',
      icon: Download,
      description: 'Documento de autorización requerido'
    },
    {
      title: 'Criterios de evaluación',
      url: 'https://bit.ly/confericis2025unamad-criterios',
      icon: ExternalLink,
      description: 'Conoce los criterios con los que será evaluado tu póster'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="font-medium text-red-800">
            CIERRE DE POSTULACIONES: {event.deadline}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Documentos Obligatorios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <doc.icon className="h-5 w-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    Descargar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Instrucciones Importantes:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Descarga y revisa todos los documentos antes de continuar</li>
          <li>• El póster debe seguir estrictamente el formato proporcionado</li>
          <li>• Todos los archivos deben estar en formato PDF</li>
          <li>• Completa el formulario de autorización y súbelo firmado</li>
        </ul>
      </div>
    </div>
  );
};