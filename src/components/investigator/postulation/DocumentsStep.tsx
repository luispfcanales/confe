// src/components/investigator/postulation/DocumentsStep.tsx
import { AlertCircle, Download, ExternalLink } from 'lucide-react';
import { Event } from './types';

interface DocumentsStepProps {
  event: Event;
  isCollaborator: boolean;
  // formData: PostulationFormData;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ 
  event,
  isCollaborator,
 }) => {
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
      {/* Alerta de fecha límite */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="font-medium text-red-800">
            CIERRE DE POSTULACIONES: {event.deadline}
          </span>
        </div>
      </div>

      {isCollaborator ? (
        <div className="text-center py-8 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="mb-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-blue-800 mb-2">
            Ya estás inscrito en este evento
          </h4>
          <p className="text-blue-600 mb-1">
            Tu participación ha sido confirmada
          </p>
          <p className="text-sm text-blue-500">
            No necesitas registrarte nuevamente
          </p>
        </div>
      ) : null}

      {/* Documentos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Documentos Obligatorios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <doc.icon className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    {doc.icon === Download ? 'Descargar' : 'Ver'} 
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instrucciones */}
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