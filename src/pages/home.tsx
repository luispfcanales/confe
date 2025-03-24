import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, BookOpen } from "lucide-react"
import { TypeAnimation } from 'react-type-animation'

const Home = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            <TypeAnimation
              sequence={[
                'Sistema de Posters Científicos',
                1000,
                'Investigación e Innovación',
                1000,
                'Compartiendo Conocimiento',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-primary"
            />
          </h1>
          <p className="text-gray-600 text-lg">Plataforma para la gestión y visualización de investigaciones académicas</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card de Login */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-primary">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <UserCircle className="h-7 w-7 text-primary" />
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-base">
                Accede al sistema de posters científicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full h-11 text-base font-medium"
                onClick={() => navigate('/login')}
              >
                Ingresar
              </Button>
              <Button 
                className="w-full h-11 text-base font-medium hover:bg-gray-100"
                variant="outline"
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
            </CardContent>
          </Card>

          {/* Card de Publicaciones */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-secondary">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BookOpen className="h-7 w-7 text-secondary" />
                Publicaciones
              </CardTitle>
              <CardDescription className="text-base">
                Explora los posters científicos publicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-11 text-base font-medium"
                variant="secondary"
                onClick={() => navigate('/publications')}
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