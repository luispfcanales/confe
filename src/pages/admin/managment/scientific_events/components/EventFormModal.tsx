// components/event-form-modal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { EventFormModalProps, EventFormData } from '../types';
import { Calendar, MapPin, Users, FileText } from "lucide-react"

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingEvent
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    year: new Date().getFullYear(),
    start_date: '',
    end_date: '',
    location: '',
    is_active: true
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name,
        description: editingEvent.description,
        year: editingEvent.year,
        start_date: editingEvent.start_date || '',
        end_date: editingEvent.end_date || '',
        location: editingEvent.location,
        is_active: editingEvent.is_active
      });
    } else {
      setFormData({
        name: '',
        description: '',
        year: new Date().getFullYear(),
        start_date: '',
        end_date: '',
        location: '',
        is_active: true
      });
    }
    setErrors({});
  }, [editingEvent, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (!formData.start_date.trim()) {
      newErrors.start_date = 'La fecha de inicio es requerida';
    }
    
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const title = editingEvent 
    ? `Editar Evento: ${editingEvent.name}` 
    : 'Crear Nuevo Evento Científico';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Evento */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Nombre del Evento *</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Conferencia Internacional de Investigación"
                className={`${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Año */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Año *</span>
              </Label>
              <Input
                id="year"
                type="number"
                min="2020"
                max="2030"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className={`${errors.year ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.year && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.year}</span>
                </p>
              )}
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Ubicación *</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ej: Lima, Perú"
                className={`${errors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.location && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.location}</span>
                </p>
              )}
            </div>

            {/* Fecha de Inicio */}
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Fecha de Inicio *</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={`${errors.start_date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.start_date && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.start_date}</span>
                </p>
              )}
            </div>

            {/* Fecha de Fin */}
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Fecha de Fin</span>
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={`${errors.end_date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.end_date && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.end_date}</span>
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Descripción</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Describe el evento científico..."
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Estado Activo */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked as boolean)}
                />
                <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Evento activo
                </Label>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-1 rounded">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Información</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Los eventos científicos permiten organizar y gestionar conferencias, simposios y otros encuentros académicos. 
                  Los campos marcados con * son obligatorios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {editingEvent ? 'Actualizar' : 'Crear Evento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormModal;