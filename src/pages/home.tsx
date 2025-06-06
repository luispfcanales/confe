import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, BookOpen } from "lucide-react"
import { TypeAnimation } from 'react-type-animation'

const Home = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 bg-repeat bg-center -z-10"
        style={{ backgroundImage: 'url("/fondo-gpt.png")' }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Event Registration Banner */}
      <div className="absolute top-4 left-0 right-0 mx-auto max-w-2xl">
        <div className="bg-primary/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animate-pulse h-3 w-3 bg-white rounded-full"></span>
            <p className="text-sm font-medium">¡Evento en curso! II Congreso Internacional de Investigación 2024</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/register')}
            className="text-xs whitespace-nowrap"
          >
            Registrarse ahora
          </Button>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
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
              className="text-white"
            />
          </h1>
          <p className="text-gray-200 text-lg">Plataforma para la gestión y visualización de investigaciones académicas</p>
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
                className="w-full h-11 text-base font-medium hover:bg-gray-100 animate-pulse border-2 border-primary"
                variant="outline"
                onClick={() => navigate('/user-registration')}
              >
                Crear cuenta
              </Button>
            </CardContent>
          </Card>

          {/* Card de Publicaciones */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-secondary">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BookOpen className="h-7 w-7 text-primary" />
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