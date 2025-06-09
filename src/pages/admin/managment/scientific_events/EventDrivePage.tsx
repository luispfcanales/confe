// EventDrivePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EventDriveView } from './components/EventDriveView';
import { ScientificEventWithDrive } from './driveFiles';
import { ScientificEventsService } from './services/scientificEventService';

const LoadingPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Cargando evento científico...</p>
    </div>
  </div>
);

const ErrorPage = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const EventDrivePage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [event, setEvent] = useState<ScientificEventWithDrive | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!uuid) {
        setError('ID del evento científico no encontrado');
        setIsLoading(false);
        return;
      }

      try {
        // Usando tu servicio existente
        const eventData = await ScientificEventsService.getEventById(uuid);
        
        // Verificar que el evento tenga un ID de Google Drive
        if (!eventData.id_path_drive_file) {
          setError('Este evento no tiene una carpeta de Google Drive asociada');
          setIsLoading(false);
          return;
        }

        setEvent(eventData as ScientificEventWithDrive);
      } catch (error) {
        console.error('Error fetching scientific event:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar el evento científico');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [uuid]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (!event) {
    return <ErrorPage message="Evento científico no encontrado" />;
  }

  return <EventDriveView event={event} />;
};

export default EventDrivePage;