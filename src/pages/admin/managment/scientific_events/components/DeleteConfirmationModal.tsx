// components/DeleteConfirmationModal.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScientificEvent } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  event: ScientificEvent | null;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  event,
  isDeleting = false
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  // Verificar si el texto de confirmación coincide con el nombre del evento
  useEffect(() => {
    if (event) {
      setIsConfirmDisabled(confirmationText.trim() !== event.name);
    }
  }, [confirmationText, event]);

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setConfirmationText('');
      setIsConfirmDisabled(true);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!isConfirmDisabled && !isDeleting) {
      onConfirm();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isConfirmDisabled && !isDeleting) {
      handleConfirm();
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-left">
            ¿Estás seguro de que quieres eliminar este evento científico?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del evento */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">{event.name}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Año:</strong> {event.year}</p>
              <p><strong>Ubicación:</strong> {event.location}</p>
              <p><strong>Estado:</strong> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  event.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </p>
              {event.start_date && (
                <p><strong>Fecha de inicio:</strong> {new Date(event.start_date).toLocaleDateString('es-ES')}</p>
              )}
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-red-800 font-medium mb-1">Esta acción no se puede deshacer</p>
                <ul className="text-red-700 space-y-1">
                  <li>• Se eliminará permanentemente el evento</li>
                  <li>• Se perderán todos los datos asociados</li>
                  <li>• Los archivos de Google Drive se verán afectados</li>
                  <li>• Las referencias en bases de datos relacionadas se mantendrán</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Campo de verificación */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Para confirmar, escribe el nombre del evento:
            </label>
            <input
              type="text"
              placeholder={event.name}
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isDeleting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoComplete="off"
            />
            {confirmationText && confirmationText !== event.name && (
              <p className="text-xs text-red-600">
                El nombre no coincide. Debe escribir exactamente: "{event.name}"
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isConfirmDisabled || isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              'Eliminar Evento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};