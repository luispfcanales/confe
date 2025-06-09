// src/pages/investigator/events/InvestigatorEventsPage.tsx
import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { EventRegistrationCard } from '@/components/investigator/EventRegistrationCard';
import { Calendar, Users, MapPin } from 'lucide-react';

const InvestigatorEventsPage: React.FC = () => {
  const { user } = useAuth();

  // Datos mock del evento - en el futuro estos vendrán de la API
  const mockEvent: {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    deadline: string;
    status: 'open' | 'closed' | 'coming_soon';
    maxParticipants: number;
    currentParticipants: number;
    image: string;
    categories: string[];
    requirements: Array<{
      text: string;
      link?: {
        url: string;
        label: string;
      };
    }>;
  } = {
    id: 1,
    title: "V CONFERENCIA DE INVESTIGACIÓN CIENTÍFICA CON IMPACTO SOCIAL (CONFERICIS 2025)",
    description: "Dirigido a investigadores RENACYT, docentes investigadores, investigadores en formación (estudiantes y egresados), grupos de investigación e investigadores del ecosistema de I+D+i+e de Madre de Dios, que ejecutaron investigaciones (financiada o autofinanciada) en sus diferentes modalidades durante los últimos seis años (2020-2025).",
    date: "19-26 de Junio, 2025",
    location: "Universidad Nacional Amazónica de Madre de Dios",
    deadline: "19 de Junio, 2025 (23:59 horas)",
    status: "closed" as const, // open, closed, coming_soon
    maxParticipants: 200,
    currentParticipants: 87,
    image: "/CONFERICIS.png",
    categories: ["Biodiversidad", "Sostenibilidad", "Desarrollo Sostenible", "Impacto Social"],
    requirements: [
      {
        text: "Ser investigador activo en instituciones académicas (investigadores RENACYT, docentes investigadores, investigadores en formación)",
      },
      {
        text: "Formato de póster científico:",
        link: {
          url: "https://bit.ly/confericis2025-poster-unamad",
          label: "Descargar formato de póster científico"
        }
      },
      {
        text: "Instructivo para elaboración de póster:",
        link: {
          url: "https://bit.ly/confericis2025unamad-instructivo",
          label: "Ver instructivo de registro"
        }
      },
      {
        text: "Formato de autorización para publicación:",
        link: {
          url: "https://bit.ly/confericis2025unamad-autorizacion",
          label: "Descargar formato de autorización"
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eventos Científicos</h1>
            <p className="text-gray-600">
              Bienvenido/a, {user?.first_name}. Aquí puedes ver y registrarte a los eventos científicos disponibles.
            </p>
          </div>
        </div>
        
        {/* Stats rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">Eventos Activos</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">1</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-900">Participantes</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">87/200</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-900">Modalidad</span>
            </div>
            <p className="text-lg font-semibold text-orange-600 mt-1">Presencial</p>
          </div>
        </div>
      </div>

      {/* Sección principal - Evento disponible */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Eventos Disponibles</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Registro Abierto</span>
          </div>
        </div>

        {/* Card del evento */}
        <EventRegistrationCard event={mockEvent} />

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Información
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Agradecemos su interés en postular a la «V CONFERENCIA EN INVESTIGACIÓN CIENTÍFICA CON IMPACTO SOCIAL (CONFERICIS 2025)» a desarrollarse de forma presencial el próximo jueves 26 de junio de 2025 en el marco del XXV Aniversario Institucional de la UNAMAD.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigatorEventsPage;