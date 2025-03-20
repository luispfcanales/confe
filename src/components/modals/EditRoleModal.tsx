import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Role } from "@/pages/admin/users/columns"
import { useEffect, useState } from "react"

interface EditRoleModalProps {
  role: Role | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedRole: Role) => void
}

export function EditRoleModal({ role, isOpen, onClose, onSave }: EditRoleModalProps) {
  const [status, setStatus] = useState(role?.Status || false)
  const [description, setDescription] = useState(role?.Description || "")

  useEffect(() => {
    if (role) {
      setStatus(role.Status)
      setDescription(role.Description)
    }
  }, [role])

  const handleSave = () => {
    if (role) {
      onSave({
        ...role,
        Status: status,
        Description: description
      })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Rol: {role?.Name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="status">Estado</Label>
            <Switch
              id="status"
              checked={status}
              onCheckedChange={setStatus}
            />
          </div>
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
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}