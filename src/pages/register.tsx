import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '@/constants/api'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

interface UserData {
  userName: string
  dni: string
  name: string
  paternalSurname: string
  maternalSurname: string
  email: string
  personalEmail: string | null
  carrerName?: string
  academicDepartament?: string
  facultyName: string
}

const Register = () => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState<'student' | 'teacher'>('student')
  const [isInternal, setIsInternal] = useState(true)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  // Add effect to clear data when isInternal changes
  useEffect(() => {
    setUsername('')
    setUserData(null)
  }, [isInternal])

  const fetchUserData = async () => {
    if (!username) return
    setLoading(true)
    try {
    const response = await fetch(`${API_URL}/api/roles`);
      const endpoint = isInternal 
        ? userType === 'student'
          ? `${API_URL}/api/data/student/${username}`
          : `${API_URL}/api/data/teacher/${username}`
        : null

      if (endpoint) {
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error('Usuario no encontrado')
        const data = await response.json()
        setUserData(data)
        toast.success('Datos encontrados')
      }
    } catch (error) {
      toast.error('Error al buscar usuario')
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="container max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          ← Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Registro de Investigador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Tipo de Investigador</Label>
              <RadioGroup
                defaultValue="student"
                onValueChange={(v) => setUserType(v as 'student' | 'teacher')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Estudiante Investigador</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Docente Investigador</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Procedencia</Label>
              <RadioGroup
                defaultValue="true"
                onValueChange={(v) => setIsInternal(v === 'true')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="internal" />
                  <Label htmlFor="internal">UNAMAD</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="external" />
                  <Label htmlFor="external">Externo</Label>
                </div>
              </RadioGroup>
            </div>

            {isInternal && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="username">Código {userType === 'student' ? 'Estudiante' : 'Docente'}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={userType === 'student' ? '20241021' : '88129'}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={fetchUserData}
                    disabled={loading || !username}
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                        Buscando...
                      </>
                    ) : (
                      'Buscar'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {userData && (
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium">Datos encontrados:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombres</Label>
                    <Input value={userData.name} readOnly />
                  </div>
                  <div>
                    <Label>DNI</Label>
                    <Input value={userData.dni} readOnly />
                  </div>
                  <div>
                    <Label>Apellido Paterno</Label>
                    <Input value={userData.paternalSurname} readOnly />
                  </div>
                  <div>
                    <Label>Apellido Materno</Label>
                    <Input value={userData.maternalSurname} readOnly />
                  </div>
                  <div className="col-span-2">
                    <Label>Email Institucional</Label>
                    <Input value={userData.email} readOnly />
                  </div>
                  <div className="col-span-2">
                    <Label>{userType === 'student' ? 'Carrera' : 'Departamento'}</Label>
                    <Input 
                      value={userType === 'student' ? userData.carrerName : userData.academicDepartament} 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            )}

            {!isInternal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* External user form fields */}
                  <div>
                    <Label>Nombres</Label>
                    <Input required />
                  </div>
                  <div>
                    <Label>DNI</Label>
                    <Input required />
                  </div>
                  <div>
                    <Label>Apellido Paterno</Label>
                    <Input required />
                  </div>
                  <div>
                    <Label>Apellido Materno</Label>
                    <Input required />
                  </div>
                  <div className="col-span-2">
                    <Label>Email</Label>
                    <Input type="email" required />
                  </div>
                  <div className="col-span-2">
                    <Label>Institución</Label>
                    <Input required />
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full">
              Registrarse
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register