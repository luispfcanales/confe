// components/event-filters.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from 'lucide-react';
import { EventFiltersProps } from '../types';

const EventFilters: React.FC<EventFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Search Input */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar eventos
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                type="text"
                placeholder="Buscar por nombre, descripción o ubicación..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2 min-w-[200px]">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Estado
            </Label>
            <Select value={filterStatus} onValueChange={onFilterChange}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    Todos los eventos
                  </div>
                </SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Eventos activos
                  </div>
                </SelectItem>
                <SelectItem value="inactive">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    Eventos inactivos
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick stats or info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1 rounded">
                <Search className="h-3 w-3 text-blue-600" />
              </div>
              <span>Utiliza los filtros para encontrar eventos específicos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;