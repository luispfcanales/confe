import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Role } from "../columns"
import { useEffect, useState } from "react"
import { User, FileText, Shield } from "lucide-react"

interface EditRoleModalProps {
  role: Role | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedRole: Role) => void
  title?: string
}

export function EditRoleModal({ 
  role, 
  isOpen, 
  onClose, 
  onSave,
  title = role ? `Editar Rol: ${role.name}` : 'Crear Nuevo Rol'
}: EditRoleModalProps) {
    const [status, setStatus] = useState<boolean>(role?.status || true)
  const [description, setDescription] = useState(role?.description || "")
  const [name, setName] = useState(role?.name || "")
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (role) {
      setStatus(role.status)
      setDescription(role.description)
      setName(role.name)
    } else {
      setStatus(true)
      setDescription("")
      setName("")
    }
    setErrors({})
  }, [role, isOpen])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!name.trim()) {
      newErrors.name = "El nombre del rol es requerido"
    } else if (name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }
    
    if (!description.trim()) {
      newErrors.description = "La descripción es requerida"
    } else if (description.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const now = new Date().toISOString()
    const updatedRole: Role = {
      ...(role || {
        ID: '',
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      }),
      name: name.trim(),
      status: status,
      description: description.trim(),
      updatedAt: now
    }

    onSave(updatedRole)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Nombre del rol */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Nombre del Rol</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Administrador, Editor, Moderador..."
              className={`${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              disabled={!!role?.ID} // Solo deshabilitar si es edición
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Estado del Rol
                </Label>
                <p className="text-xs text-gray-500">
                  {status ? 'El rol está activo y disponible' : 'El rol está desactivado'}
                </p>
              </div>
            </div>
            <Switch
              id="status"
              checked={status}
              onCheckedChange={setStatus}
              className="data-[state=checked]:bg-green-600"
            />
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
              placeholder="Describe las responsabilidades y permisos de este rol..."
              rows={4}
              className={`resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.description}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}