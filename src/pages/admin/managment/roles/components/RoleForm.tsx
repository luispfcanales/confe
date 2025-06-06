import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RoleFormData, FormErrors } from '../types'

interface RoleFormProps {
  formData: RoleFormData
  errors: FormErrors
  onInputChange: (field: keyof RoleFormData, value: any) => void
  isEditing: boolean
}

const RoleForm = ({ 
  formData, 
  errors, 
  onInputChange,
  isEditing
}: RoleFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      {/* Nombre del rol - solo editable en creación */}
      {!isEditing && (
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre del Rol</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Nombre del rol..."
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>
      )}

      {/* Estado */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="status">Estado</Label>
        <Switch
          id="status"
          checked={formData.status}
          onCheckedChange={(checked) => onInputChange('status', checked)}
        />
      </div>

      {/* Descripción */}
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Descripción del rol..."
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>
    </div>
  )
}

export default RoleForm