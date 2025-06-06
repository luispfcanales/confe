// components/PersonalInfoSection.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CreditCard, MapPin, Phone } from 'lucide-react'
import { UserFormData, FormErrors } from '../types'

interface PersonalInfoSectionProps {
  formData: UserFormData
  errors: FormErrors
  onInputChange: (field: keyof UserFormData, value: any) => void
}

const PersonalInfoSection = ({ 
  formData, 
  errors, 
  onInputChange 
}: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Información Personal
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="identityDocument">Documento de Identidad *</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="identityDocument"
              value={formData.identityDocument}
              onChange={(e) => onInputChange('identityDocument', e.target.value)}
              placeholder="Número de documento"
              className={`pl-10 ${errors.identityDocument ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.identityDocument && (
            <p className="text-red-500 text-sm">{errors.identityDocument}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Número de Teléfono *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              placeholder="987654321"
              className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Nombres *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Ingrese sus nombres"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Ingrese sus apellidos"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="ejemplo@correo.com"
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              placeholder="Ingrese su dirección completa"
              className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoSection