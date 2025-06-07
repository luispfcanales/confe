import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { DocumentType } from "../types"
import { useEffect, useState } from "react"
import { FileText, File } from "lucide-react"

interface EditDocumentTypeModalProps {
  documentType: DocumentType | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedDocumentType: DocumentType) => void
  title?: string
}

export function EditDocumentTypeModal({ 
  documentType, 
  isOpen, 
  onClose, 
  onSave,
  title = documentType ? `Editar Tipo: ${documentType.name}` : 'Crear Nuevo Tipo de Documento'
}: EditDocumentTypeModalProps) {
  const [description, setDescription] = useState(documentType?.description || "")
  const [name, setName] = useState(documentType?.name || "")
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (documentType) {
      setDescription(documentType.description)
      setName(documentType.name)
    } else {
      setDescription("")
      setName("")
    }
    setErrors({})
  }, [documentType, isOpen])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!name.trim()) {
      newErrors.name = "El nombre del tipo de documento es requerido"
    } else if (name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }
    
    if (!description.trim()) {
      newErrors.description = "La descripción es requerida"
    } else if (description.length < 5) {
      newErrors.description = "La descripción debe tener al menos 5 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const now = new Date().toISOString()
    const updatedDocumentType: DocumentType = {
      ...(documentType || {
        ID: '',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }),
      name: name.trim(),
      description: description.trim(),
      updated_at: now
    }

    onSave(updatedDocumentType)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <File className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Nombre del tipo */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Nombre del Tipo de Documento</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: DNI, Pasaporte, Carnet de Extranjería..."
              className={`${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                disabled={!!documentType?.ID} // Solo deshabilitar si es edición
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Descripción</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe las características y uso de este tipo de documento..."
              rows={4}
              className={`resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Info adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-1 rounded">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Información</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Los tipos de documento se utilizan para categorizar los documentos de identidad de los usuarios en el sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}