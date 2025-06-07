// components/EditUserModal.tsx
import React, { useState, useEffect } from 'react';
import { User, Role, DocumentType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, User as UserIcon, Mail, MapPin, IdCard } from 'lucide-react';
import { UserService } from '../services/userService';
import { toast } from 'sonner';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    first_name: '',
    last_name: '',
    identity_document: '',
    address: '',
    email: '',
    role_id: '',
    document_type_id: '',
    sex: 1, // 1 = Masculino por defecto
    password: '',
    is_active: true,
    is_internal: false,
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isEditMode = Boolean(user?.ID);

  useEffect(() => {
    if (isOpen) {
      loadFormData();
      loadRolesAndDocumentTypes();
    }
  }, [isOpen, user]);

  const loadFormData = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        identity_document: user.identity_document || '',
        address: user.address || '',
        role_id: user.role_id || '',
        document_type_id: user.document_type_id || '',
        sex: user.sex || 1,
        password: '',
        is_active: user.is_active ?? true,
        is_internal: user.is_internal ?? false,
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        identity_document: '',
        address: '',
        role_id: '',
        document_type_id: '',
        sex: 1,
        password: '',
        is_active: true,
        is_internal: false,
      });
    }
    setErrors({});
  };

  const loadRolesAndDocumentTypes = async () => {
    try {
      const [rolesData, documentTypesData] = await Promise.all([
        UserService.getAllRoles(),
        UserService.getAllDocumentTypes()
      ]);
      setRoles(rolesData);
      setDocumentTypes(documentTypesData);
    } catch (error) {
      toast.error('Error al cargar datos', {
        description: 'No se pudieron cargar los roles y tipos de documento',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.identity_document?.trim()) {
      newErrors.identity_document = 'El documento de identidad es requerido';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'El rol es requerido';
    }

    if (!formData.document_type_id) {
      newErrors.document_type_id = 'El tipo de documento es requerido';
    }

    if (!isEditMode && !formData.password?.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        ...formData,
        ID: user?.ID,
      } as User;

      onSave(userData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getSexLabel = (sex: number) => {
    switch (sex) {
      case 1: return 'Masculino';
      case 2: return 'Femenino';
      default: return 'Masculino';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Ingrese el nombre"
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Ingrese el apellido"
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document_type_id">Tipo de Documento *</Label>
                <Select
                  value={formData.document_type_id || ''}
                  onValueChange={(value) => handleInputChange('document_type_id', value)}
                >
                  <SelectTrigger className={errors.document_type_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccione tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((docType) => (
                      <SelectItem key={docType.ID} value={docType.ID}>
                        {docType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.document_type_id && (
                  <p className="text-sm text-red-500">{errors.document_type_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="identity_document">Documento de Identidad *</Label>
                <Input
                  id="identity_document"
                  value={formData.identity_document || ''}
                  onChange={(e) => handleInputChange('identity_document', e.target.value)}
                  placeholder="Ingrese el documento"
                  className={errors.identity_document ? 'border-red-500' : ''}
                />
                {errors.identity_document && (
                  <p className="text-sm text-red-500">{errors.identity_document}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sexo</Label>
              <Select
                value={formData.sex?.toString() || '1'}
                onValueChange={(value) => handleInputChange('sex', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Femenino</SelectItem>
                  <SelectItem value="3">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Información de Contacto
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="usuario@ejemplo.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Ingrese la dirección"
                rows={3}
              />
            </div>
          </div>

          {/* Configuración del Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Configuración del Sistema
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="role_id">Rol *</Label>
              <Select
                value={formData.role_id || ''}
                onValueChange={(value) => handleInputChange('role_id', value)}
              >
                <SelectTrigger className={errors.role_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.ID} value={role.ID}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role_id && (
                <p className="text-sm text-red-500">{errors.role_id}</p>
              )}
            </div>

            {(!isEditMode || formData.password) && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={isEditMode ? 'Dejar vacío para mantener actual' : 'Ingrese contraseña'}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active">Usuario Activo</Label>
                    <p className="text-sm text-gray-600">
                      El usuario puede acceder al sistema
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active ?? true}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_internal">Usuario Interno</Label>
                    <p className="text-sm text-gray-600">
                      Usuario pertenece a la organización
                    </p>
                  </div>
                  <Switch
                    id="is_internal"
                    checked={formData.is_internal ?? false}
                    onCheckedChange={(checked) => handleInputChange('is_internal', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};