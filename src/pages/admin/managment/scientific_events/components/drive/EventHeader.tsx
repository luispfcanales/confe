// components/drive/EventHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FolderPlus, 
  Upload,
  Grid3X3,
  List,
  Home,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScientificEventWithDrive, BreadcrumbItem } from '../../driveFiles';

interface EventHeaderProps {
  event: ScientificEventWithDrive;
  breadcrumbs: BreadcrumbItem[];
  viewMode: 'grid' | 'list';
  onBreadcrumbClick: (index: number) => void;
  onCreateFolderClick: () => void;
  onUploadFilesClick: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  breadcrumbs,
  viewMode,
  onBreadcrumbClick,
  onCreateFolderClick,
  onUploadFilesClick,
  onViewModeChange
}) => {
  const navigate = useNavigate();

  const formatEventDate = (start?: string, end?: string) => {
    if (!start && !end) return 'Fechas no especificadas';
    
    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    if (start && end) {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    return start ? `Desde: ${formatDate(start)}` : `Hasta: ${formatDate(end!)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/scientific-events')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Eventos
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <Badge variant={event.is_active ? "default" : "secondary"}>
                {event.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            
            {/* Información del evento */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{event.year}</span>
              </div>
              {event.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <ExternalLink className="h-4 w-4" />
                <span>Google Drive</span>
              </div>
            </div>
            
            {/* Fechas del evento */}
            <div className="text-sm text-gray-600 mt-1">
              {formatEventDate(event.start_date, event.end_date)}
            </div>
            
            {/* Descripción del evento */}
            {event.description && (
              <p className="text-gray-600 mt-2 max-w-2xl">{event.description}</p>
            )}
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
            title={`Cambiar a vista ${viewMode === 'grid' ? 'de lista' : 'de grilla'}`}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline"
            onClick={onCreateFolderClick}
            className="gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            Nueva Carpeta
          </Button>
          <Button 
            onClick={onUploadFilesClick}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Upload className="h-4 w-4" />
            Subir Archivos
          </Button>
        </div>
      </div>

      {/* Breadcrumbs de navegación */}
      <div className="flex items-center space-x-2 mt-4 text-sm text-gray-600">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBreadcrumbClick(-1)}
          className="h-auto p-1 gap-1 text-gray-600 hover:text-blue-600"
        >
          <Home className="h-4 w-4" />
          <span>Raíz del Evento</span>
        </Button>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.id}>
            <span className="text-gray-400">/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBreadcrumbClick(index)}
              className="h-auto p-1 text-gray-600 hover:text-blue-600 truncate max-w-32"
              title={breadcrumb.name}
            >
              {breadcrumb.name}
            </Button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};