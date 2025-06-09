// src/pages/investigator/EventsPage.tsx
import { useState } from 'react';
import { CalendarDays, MapPin, Clock, Users, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostulationModal } from '@/components/investigator/PostulationModal';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  deadline: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  isOpen: boolean;
  image: string;
}

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de ejemplo - en tu app vendrán del backend
  const events: Event[] = [
    {
      id: '1',
      title: 'IV CONFERENCIA DE INVESTIGACIÓN CIENTÍFICA CON IMPACTO SOCIAL (CONFERICIS 2024)',
      description: 'Conferencia dedicada a la presentación de investigaciones científicas con impacto social. Los investigadores podrán presentar sus pósters científicos y compartir sus hallazgos con la comunidad académica.',
      date: '2024-07-15',
      deadline: '2024-06-17',
      location: 'Universidad Nacional Amazónica de Madre de Dios',
      maxParticipants: 100,
      currentParticipants: 45,
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'V SIMPOSIO DE INVESTIGACIÓN AMAZÓNICA',
      description: 'Evento enfocado en la investigación sobre la biodiversidad y sostenibilidad de la región amazónica.',
      date: '2024-09-20',
      deadline: '2024-08-15',
      location: 'Auditorio Principal UNAMAD',
      maxParticipants: 80,
      currentParticipants: 12,
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=400&h=200&fit=crop'
    }
  ];

  const handlePostulate = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-72">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Eventos Científicos</h1>
              <p className="text-gray-600 mt-2">
                Postula a eventos científicos y presenta tus investigaciones
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                {events.filter(e => e.isOpen).length} eventos disponibles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => {
            const daysUntilDeadline = getDaysUntilDeadline(event.deadline);
            const isExpired = isDeadlinePassed(event.deadline);
            
            return (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-4 right-4">
                    {isExpired ? (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Cerrado
                      </span>
                    ) : (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Abierto
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4 text-blue-500" />
                      <span>Fecha del evento: {formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>
                        Cierre de postulaciones: {formatDate(event.deadline)}
                        {!isExpired && (
                          <span className={`ml-2 font-medium ${
                            daysUntilDeadline <= 3 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ({daysUntilDeadline} días restantes)
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>
                        {event.currentParticipants}/{event.maxParticipants} participantes
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deadline Warning */}
                  {!isExpired && daysUntilDeadline <= 7 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 font-medium">
                          ¡Quedan pocos días para postular!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => handlePostulate(event)}
                    disabled={isExpired || event.currentParticipants >= event.maxParticipants}
                    className={`w-full flex items-center gap-2 ${
                      isExpired || event.currentParticipants >= event.maxParticipants
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    {isExpired 
                      ? 'Postulaciones Cerradas'
                      : event.currentParticipants >= event.maxParticipants
                      ? 'Cupos Agotados'
                      : 'Postular al Evento'
                    }
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No hay eventos disponibles
            </h3>
            <p className="text-gray-600">
              Los eventos aparecerán aquí cuando estén disponibles para postulación.
            </p>
          </div>
        )}
      </div>

      {/* Postulation Modal */}
      <PostulationModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};

export default EventsPage;