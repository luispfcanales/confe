import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { InvestigatorType } from "../types"
import { useEffect, useState } from "react"
import { Search, FileText, Shield } from "lucide-react"

interface EditInvestigatorTypeModalProps {
  investigatorType: InvestigatorType | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedInvestigatorType: InvestigatorType) => void
  title?: string
}

export function EditInvestigatorTypeModal({ 
  investigatorType, 
  isOpen, 
  onClose, 
  onSave,
  title = investigatorType ? `Editar Tipo: ${investigatorType.name}` : 'Crear Nuevo Tipo de Investigador'
}: EditInvestigatorTypeModalProps) {
  const [name, setName] = useState(investigatorType?.name || "")
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (investigatorType) {
      setName(investigatorType.name)
    } else {
      setName("")
    }
    setErrors({})
  }, [investigatorType, isOpen])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!name.trim()) {
      newErrors.name = "El nombre del tipo de investigador es requerido"
    } else if (name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const now = new Date().toISOString()
    const updatedInvestigatorType: InvestigatorType = {
      ...(investigatorType || {
        ID: '',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }),
      name: name.trim(),
      updated_at: now
    }

    onSave(updatedInvestigatorType)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Search className="h-5 w-5" />
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
              <Search className="h-4 w-4" />
              <span>Nombre del Tipo de Investigador</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Investigador Principal, Co-investigador, Asistente..."
              className={`${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'}`}
              // disabled={!!investigatorType?.ID} // Solo deshabilitar si es edición
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}