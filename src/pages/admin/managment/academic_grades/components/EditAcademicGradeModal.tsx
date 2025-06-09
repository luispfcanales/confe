import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AcademicGrade } from "../types"
import { useEffect, useState } from "react"
import { GraduationCap, BookOpen } from "lucide-react"

interface EditAcademicGradeModalProps {
  academicGrade: AcademicGrade | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedAcademicGrade: AcademicGrade) => void
  title?: string
}

export function EditAcademicGradeModal({ 
  academicGrade, 
  isOpen, 
  onClose, 
  onSave,
  title = academicGrade ? `Editar Grado: ${academicGrade.name}` : 'Crear Nuevo Grado Académico'
}: EditAcademicGradeModalProps) {
  const [name, setName] = useState(academicGrade?.name || "")
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (academicGrade) {
      setName(academicGrade.name)
    } else {
      setName("")
    }
    setErrors({})
  }, [academicGrade, isOpen])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!name.trim()) {
      newErrors.name = "El nombre del grado académico es requerido"
    } else if (name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const now = new Date().toISOString()
    const updatedAcademicGrade: AcademicGrade = {
      ...(academicGrade || {
        ID: '',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }),
      name: name.trim(),
      updated_at: now
    }

    onSave(updatedAcademicGrade)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Nombre del grado */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Nombre del Grado Académico</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: egresado, bachiller, Licenciatura..."
              className={`${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Info adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-1 rounded">
                <GraduationCap className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Información</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Los grados académicos se utilizan para organizar y categorizar los diferentes niveles educativos en el sistema.
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
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}