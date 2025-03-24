import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Award, LineChart } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Vicerrectorado de Investigación
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sistema de Gestión de Posters Científicos - Universidad Nacional Amazónica de Madre de Dios
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-none">
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Posters</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-none">
          <CardContent className="flex items-center p-6">
            <div className="bg-green-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Investigadores</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-none">
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Facultades</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-none">
          <CardContent className="flex items-center p-6">
            <div className="bg-orange-500 p-3 rounded-lg">
              <LineChart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Eventos</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Card */}
      <Card className="border-none bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto text-center text-white space-y-4">
            <h2 className="text-2xl font-bold">Bienvenido al Sistema de Gestión de Posters Científicos</h2>
            <p className="opacity-90">
              Plataforma dedicada a la gestión, visualización y promoción de la investigación científica 
              en la Universidad Nacional Amazónica de Madre de Dios.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-lg font-bold">Investigación</p>
                <p className="text-sm opacity-75">Promoviendo la excelencia</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-lg font-bold">Innovación</p>
                <p className="text-sm opacity-75">Impulsando el desarrollo</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-lg font-bold">Impacto</p>
                <p className="text-sm opacity-75">Generando cambios</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard