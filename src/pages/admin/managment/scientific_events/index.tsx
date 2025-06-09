// index.tsx - Archivo principal modificado
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Agregar esta importación
import { Plus, Calendar } from 'lucide-react';
import { ScientificEvent, EventFormData, FilterStatus } from './types';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import EventFormModal from './components/EventFormModal';
import { ScientificEventsService } from './services/scientificEventService';

// Mock data para desarrollo/testing
const mockEvents: ScientificEvent[] = [
  {
    ID: '1',
    name: 'Conferencia Internacional de Investigación Científica',
    description: 'Evento anual que reúne a investigadores de todo el mundo para compartir avances en ciencia y tecnología.',
    year: 2024,
    start_date: '2024-06-15',
    end_date: '2024-06-18',
    location: 'Lima, Perú',
    is_active: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
    id_path_drive_file: '1BzGTP82ybSi-vhz1Y3_X3xqzsvXZ85y' // Agregar este campo
  },
  {
    ID: '2',
    name: 'Simposio de Biotecnología Avanzada',
    description: 'Encuentro especializado en biotecnología y sus aplicaciones en medicina y agricultura.',
    year: 2024,
    start_date: '2024-08-20',
    end_date: '2024-08-22',
    location: 'Arequipa, Perú',
    is_active: false,
    created_at: '2024-02-01T10:30:00Z',
    updated_at: '2024-02-01T10:30:00Z',
    id_path_drive_file: '1CzHTP92ybSi-whz2Y4_X4xqztvXZ95z' // Agregar este campo
  }
];



const ScientificEventsPage: React.FC = () => {
  const navigate = useNavigate(); // Agregar esta línea
  const [events, setEvents] = useState<ScientificEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScientificEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents();
  }, []);


  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // En desarrollo, puedes cambiar entre datos mock y API real
      const USE_MOCK_DATA = false; // Cambiar a false cuando la API esté lista
      
      if (USE_MOCK_DATA) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        setEvents(mockEvents);
      } else {
        const eventsData = await ScientificEventsService.getAllEvents();
        setEvents(eventsData);
      }
    } catch (err) {
      setError('Error al cargar los eventos');
      console.error('Error loading events:', err);
      // Fallback a datos mock en caso de error
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      const USE_MOCK_DATA = false; // Cambiar a false cuando la API esté lista
      
      if (USE_MOCK_DATA) {
        // Mock create
        const newEvent: ScientificEvent = {
          ID: Date.now().toString(),
          ...eventData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setEvents(prev => [...prev, newEvent]);
      } else {
        const newEvent = await ScientificEventsService.createEvent(eventData);
        setEvents(prev => [...prev, newEvent]);
      }
      
      setShowModal(false);
      setEditingEvent(null);
    } catch (err) {
      setError('Error al crear el evento');
      console.error('Error creating event:', err);
    }
  };

  const handleUpdateEvent = async (eventData: EventFormData) => {
    if (!editingEvent) return;

    try {
      const USE_MOCK_DATA = false; // Cambiar a false cuando la API esté lista
      
      if (USE_MOCK_DATA) {
        // Mock update
        setEvents(prev => prev.map(event => 
          event.ID === editingEvent.ID 
            ? { ...event, ...eventData, updated_at: new Date().toISOString() }
            : event
        ));
      } else {
        const updatedEvent = await ScientificEventsService.updateEvent(editingEvent.ID, eventData);
        setEvents(prev => prev.map(event => 
          event.ID === editingEvent.ID ? updatedEvent : event
        ));
      }
      
      setShowModal(false);
      setEditingEvent(null);
    } catch (err) {
      setError('Error al actualizar el evento');
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const USE_MOCK_DATA = false; // Cambiar a false cuando la API esté lista
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setEvents(prev => prev.filter(event => event.ID !== id));
      } else {
        await ScientificEventsService.deleteEvent(id);
        setEvents(prev => prev.filter(event => event.ID !== id));
      }
    } catch (err) {
      setError('Error al eliminar el evento');
      console.error('Error deleting event:', err);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event: ScientificEvent) => {
    setEditingEvent(event);
    setShowModal(true);
  };

// Modificar handleViewEvent para navegar a Google Drive
const handleViewEvent = (id: string) => {
  const event = events.find(e => e.ID === id);
  
  if (event && event.id_path_drive_file) {
    navigate(`/admin/scientific-events/${id}/drive`);
  } else {
    alert('Este evento no tiene una carpeta de Google Drive asociada');
  }
};

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && event.is_active) ||
                         (filterStatus === 'inactive' && !event.is_active);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos Científicos</h1>
            <p className="text-gray-600 mt-2">Administra los eventos científicos y conferencias</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Plus size={20} />
            Nuevo Evento
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters */}
        <EventFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.ID}
              event={event}
              onEdit={openEditModal}
              onDelete={handleDeleteEvent}
              onView={handleViewEvent} // Esta función ahora navega a Google Drive
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron eventos</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer evento científico'
              }
            </p>
          </div>
        )}

        {/* Form Modal */}
        <EventFormModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          editingEvent={editingEvent}
        />
      </div>
    </div>
  );
};

export default ScientificEventsPage;