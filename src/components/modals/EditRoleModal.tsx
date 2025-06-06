import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Role } from "@/pages/admin/users/columns"
import { useEffect, useState } from "react"

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
  const [status, setStatus] = useState(role?.status || false)
  const [description, setDescription] = useState(role?.description || "")
  const [name, setName] = useState(role?.name || "")

  useEffect(() => {
    if (role) {
      setStatus(role.status)
      setDescription(role.description)
      setName(role.name)
    } else {
      // Resetear valores para creación
      setStatus(true)
      setDescription("")
      setName("")
    }
  }, [role])

  const handleSave = () => {
    if (!name) {
      alert("El nombre del rol es requerido")
      return
    }

    const now = new Date().toISOString()
    const updatedRole: Role = {
      ...(role || {
        ID: '', // El backend debería generar esto
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      }),
      name: name,
      status: status,
      description: description
    }

    onSave(updatedRole)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Nombre del rol - solo editable en creación */}
          {!role?.ID && (
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Rol</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del rol..."
              />
            </div>
          )}

          {/* Estado */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="status">Estado</Label>
            <Switch
              id="status"
              checked={status}
              onCheckedChange={setStatus}
            />
          </div>

          {/* Descripción */}
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del rol..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>
            {role ? 'Guardar cambios' : 'Crear rol'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}