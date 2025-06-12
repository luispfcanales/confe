// components/EventFilters.tsx
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventFiltersProps, FilterStatus } from '../types';

const EventFilters: React.FC<EventFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange
}) => {
  const handleStatusChange = (value: string) => {
    onFilterChange(value as FilterStatus);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">Filtros de Búsqueda</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Buscar eventos
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
            Estado del evento
          </Label>
          <Select value={filterStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los eventos</SelectItem>
              <SelectItem value="active">Solo eventos activos</SelectItem>
              <SelectItem value="inactive">Solo eventos inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      {(searchTerm || filterStatus !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Filtros aplicados
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onFilterChange('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Búsqueda: "{searchTerm}"
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Estado: {filterStatus === 'active' ? 'Activos' : 'Inactivos'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;