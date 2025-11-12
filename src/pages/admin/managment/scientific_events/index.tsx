import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { ScientificEvent, EventFormData, FilterStatus } from './types';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import EventFormModal from './components/EventFormModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { ScientificEventsService } from './services/scientificEventService';

const ScientificEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ScientificEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScientificEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  
  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ScientificEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eventsData = await ScientificEventsService.getAllEvents();
      setEvents(eventsData);
    } catch (err) {
      setError('Error al cargar los eventos científicos');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      const newEvent = await ScientificEventsService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
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
      const updatedEvent = await ScientificEventsService.updateEvent(editingEvent.ID, eventData);
      setEvents(prev => prev.map(event => 
        event.ID === editingEvent.ID ? updatedEvent : event
      ));
      setShowModal(false);
      setEditingEvent(null);
      // Opcional: recargar eventos para asegurar sincronización
      await loadEvents();
    } catch (err) {
      setError('Error al actualizar el evento');
      console.error('Error updating event:', err);
    }
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteEventRequest = (id: string) => {
    const event = events.find(e => e.ID === id);
    if (event) {
      setEventToDelete(event);
      setShowDeleteModal(true);
    }
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);
      
      await ScientificEventsService.deleteEvent(eventToDelete.ID);
      setEvents(prev => prev.filter(event => event.ID !== eventToDelete.ID));

      // Cerrar modal y limpiar estado
      setShowDeleteModal(false);
      setEventToDelete(null);
      setError(null);
      
    } catch (err) {
      setError('Error al eliminar el evento');
      console.error('Error deleting event:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
    setIsDeleting(false);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event: ScientificEvent) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleViewEvent = (id: string) => {
    const event = events.find(e => e.ID === id);
    
    if (event && event.id_path_drive_file) {
      // Navegar a la página interna de gestión de Drive
      navigate(`/admin/scientific-events/${id}/drive`);
    } else {
      setError('Este evento no tiene una carpeta de Google Drive asociada');
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
          <p className="text-gray-600">Cargando eventos científicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos Científicos</h1>
            <p className="text-gray-600 mt-2">Administra los eventos científicos y conferencias</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="bg-white px-3 py-1 rounded-full border">
                <span className="text-sm text-gray-600">Total: {events.length}</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full border border-green-200">
                <span className="text-sm text-green-700">
                  Activos: {events.filter(e => e.is_active).length}
                </span>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                <span className="text-sm text-gray-700">
                  Inactivos: {events.filter(e => !e.is_active).length}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            Nuevo Evento
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-xl font-bold"
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
              onDelete={handleDeleteEventRequest}
              onView={handleViewEvent}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {events.length === 0 ? 'No hay eventos científicos' : 'No se encontraron eventos'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer evento científico'
              }
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            )}
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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          event={eventToDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default ScientificEventsPage;