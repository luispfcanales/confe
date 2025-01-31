import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, BookOpen } from "lucide-react"

const Home = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Posters Científicos</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card de Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-6 w-6" />
                Iniciar Sesión
              </CardTitle>
              <CardDescription>
                Accede al sistema para gestionar posters científicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Ingresar
              </Button>
            </CardContent>
          </Card>

          {/* Card de Publicaciones */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Publicaciones
              </CardTitle>
              <CardDescription>
                Explora los posters científicos publicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="secondary"
                onClick={() => navigate('/publicaciones')}
              >
                Ver Publicaciones
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home