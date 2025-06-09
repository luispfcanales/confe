// components/event-card.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  MapPin, 
  Edit2, 
  Trash2,
  CalendarDays,
  Images,
} from 'lucide-react';
import { EventCardProps } from '../types';

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onView
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Está seguro de que desea eliminar este evento?')) {
      onDelete(event.ID);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">{event.year}</span>
          </div>
          <Badge 
            variant={event.is_active ? "default" : "secondary"}
            className={event.is_active 
              ? "bg-green-100 text-green-700 hover:bg-green-100" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
            }
          >
            {event.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.name}
        </h3>

        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="space-y-3">
          {event.start_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {formatDate(event.start_date)}
                {event.end_date && ` - ${formatDate(event.end_date)}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100">
        <div className="flex gap-2 w-full">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(event.ID)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <Eye className="h-4 w-4" />
            Ver
          </Button> */}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(event)}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Edit2 className="h-4 w-4" />
            Editar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(event.ID)}
            className="flex items-center gap-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
          >
            <Images className="h-4 w-4" />
            Ver
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;