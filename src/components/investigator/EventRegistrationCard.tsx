// src/components/investigator/EventRegistrationCard.tsx
import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  ExternalLink
} from 'lucide-react';
import { EventForComponent } from '@/types/events';
import { PostulationModal } from './PostulationModal';

interface EventRegistrationCardProps {
  event: EventForComponent;
}

export const EventRegistrationCard: React.FC<EventRegistrationCardProps> = ({ event }) => {
  const [showRequirements, setShowRequirements] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRegisterClick = () => {
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'coming_soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Registro Abierto';
      case 'closed':
        return 'Registro Cerrado';
      case 'coming_soon':
        return 'Próximamente';
      default:
        return 'No Disponible';
    }
  };

  const participationPercentage = (event.currentParticipants / event.maxParticipants) * 100;

  // Formatear fecha para mostrar
  const formatDisplayDate = () => {
    if (event.startDate === event.endDate) {
      return event.startDate;
    }
    return `${event.startDate} - ${event.endDate}`;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        {/* Header con imagen de fondo */}
        {/* <div className="relative h-48 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(/${event.image})` }}> */}
        <div className="relative h-48 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("/CONFERECIS.png")` }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
              {event.status === 'open' && <CheckCircle className="w-4 h-4 mr-1" />}
              {event.status === 'closed' && <AlertCircle className="w-4 h-4 mr-1" />}
              {event.status === 'coming_soon' && <Clock className="w-4 h-4 mr-1" />}
              {getStatusText(event.status)}
            </span>
          </div>
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
              {event.year}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
              {event.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30"
                >
                  {category}
                </span>
              ))}
              {event.categories.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
                  +{event.categories.length - 3} más
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          {/* Descripción */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {event.description}
          </p>

          {/* Información del evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha del Evento</p>
                <p className="text-sm text-gray-600">{formatDisplayDate()}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ubicación</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha Límite</p>
                <p className="text-sm text-gray-600">{event.deadline}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Participantes</p>
                <p className="text-sm text-gray-600">
                  {event.currentParticipants} de {event.maxParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Estado de actividad */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${event.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className={`font-medium ${event.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                {event.isActive ? 'Evento Activo' : 'Evento Inactivo'}
              </span>
            </div>
          </div>

          {/* Barra de progreso de participación */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Cupos Disponibles</span>
              <span className="text-sm text-gray-600">
                {participationPercentage.toFixed(0)}% ocupado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  participationPercentage > 80 
                    ? 'bg-red-500' 
                    : participationPercentage > 60 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${participationPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Requisitos */}
          <div className="mb-6">
            <button
              onClick={() => setShowRequirements(!showRequirements)}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Requisitos para participar</span>
              </div>
              <ChevronRight 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  showRequirements ? 'rotate-90' : ''
                }`} 
              />
            </button>
            
            {showRequirements && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <ul className="space-y-3">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-sm text-blue-800">{requirement.text}</span>
                        {requirement.link && (
                          <div className="mt-1">
                            <a
                              href={requirement.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              {requirement.link.label}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Botón de registro */}
          <div className="flex flex-col sm:flex-row gap-3">
            {event.status === 'open' && event.isActive ? (
              <button
                onClick={handleRegisterClick}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <User className="w-5 h-5" />
                <span>Registrarse al Evento</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : event.status === 'closed' || !event.isActive ? (
              <button
                disabled
                className="flex-1 bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{!event.isActive ? 'Evento Inactivo' : 'Registro Cerrado'}</span>
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-yellow-100 text-yellow-700 px-6 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2 border border-yellow-200"
              >
                <Clock className="w-5 h-5" />
                <span>Próximamente</span>
              </button>
            )}
            
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Más Información</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de postulación */}
      <PostulationModal
        event={event.status === 'open' && event.isActive ? {
          id: event.ID,
          title: event.title,
          deadline: event.deadline
        } : null}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};