// src/pages/investigator/events/InvestigatorEventsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { EventRegistrationCard } from '@/components/investigator/EventRegistrationCard';
import { Calendar, Users, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { ApiEvent, ApiResponse, EventForComponent } from '@/types/events';

const InvestigatorEventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventForComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para transformar datos de la API al formato del componente
  const transformApiEventToComponent = (apiEvent: ApiEvent): EventForComponent => {
    // Determinar el estado basado en fechas y is_active
    const now = new Date();
    const startDate = new Date(apiEvent.start_date);
    const endDate = new Date(apiEvent.end_date);
    
    let status: 'open' | 'closed' | 'coming_soon' = 'closed';
    if (apiEvent.is_active) {
      if (now < startDate) {
        status = 'coming_soon';
      } else if (now >= startDate && now <= endDate) {
        status = 'open';
      } else {
        status = 'closed';
      }
    }

    // Formatear fechas
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };

    const formatDateRange = (start: string, end: string) => {
      const startFormatted = new Date(start).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long'
      });
      const endFormatted = new Date(end).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      return `${startFormatted} - ${endFormatted}`;
    };

    return {
      ID: apiEvent.ID,
      title: apiEvent.name,
      description: apiEvent.description,
      startDate: formatDate(apiEvent.start_date),
      endDate: formatDate(apiEvent.end_date),
      location: apiEvent.location,
      status,
      isActive: apiEvent.is_active,
      year: apiEvent.year,
      // Datos calculados - aquí puedes ajustar según necesites
      deadline: formatDate(apiEvent.submission_deadline), // Por ahora usar la fecha de inicio
      maxParticipants: 200, // Valor por defecto
      currentParticipants: 87, // Valor por defecto
      image: "/CONFERICIS.png", // Imagen por defecto
      categories: ["Investigación Científica", "Impacto Social", "Académico"], // Por defecto
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
  };

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/scientific-events');
        
        if (!response.ok) {
          throw new Error('Error al cargar los eventos');
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.success && data.data) {
          const transformedEvents = data.data.map(transformApiEventToComponent);
          setEvents(transformedEvents);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Calcular estadísticas
  const activeEvents = events.filter(event => event.isActive).length;
  const totalParticipants = events.reduce((sum, event) => sum + event.currentParticipants, 0);
  const maxParticipants = events.reduce((sum, event) => sum + event.maxParticipants, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando eventos científicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error al cargar eventos</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* Stats dinámicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">Eventos Activos</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">{activeEvents}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-900">Participantes</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">{totalParticipants}/{maxParticipants}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-900">Total Eventos</span>
            </div>
            <p className="text-lg font-semibold text-orange-600 mt-1">{events.length}</p>
          </div>
        </div>
      </div>

      {/* Sección principal - Eventos disponibles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Eventos Disponibles ({events.length})
          </h2>
          {events.some(event => event.status === 'open') && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span><b>Hay eventos con registro abierto</b></span>
            </div>
          )}
        </div>

        {/* Lista de eventos */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay eventos disponibles
            </h3>
            <p className="text-gray-600">
              Actualmente no hay eventos científicos programados. Vuelve a consultar pronto.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <EventRegistrationCard key={event.ID} event={event} />
            ))}
          </div>
        )}

        {/* Información adicional */}
        {events.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">!</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  Información Importante
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Los eventos científicos están organizados por la Universidad Nacional Amazónica de Madre de Dios.</p>
                  <p>• Asegúrate de cumplir con todos los requisitos antes de postular.</p>
                  <p>• Los cupos son limitados y se asignan por orden de postulación.</p>
                  <p>• Revisa las fechas límite de cada evento cuidadosamente.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigatorEventsPage;