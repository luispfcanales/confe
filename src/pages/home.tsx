import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserCircle, BookOpen,  GraduationCap, Users, Award, Search, LogIn, UserPlus,
  Calendar,  TrendingUp, Globe, Star,  Microscope, Beaker,
  ExternalLink, Phone, Mail, MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation'

const UnamadResearchHome = () => {

  const navigate = useNavigate()


  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const fallback = target.nextElementSibling as HTMLElement;
    target.style.display = 'none';
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900">
      
      {/* Header simplificado y más limpio */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* UNAMAD Logo */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-emerald-200 cursor-pointer hover:scale-105 transition-transform"
                   onClick={() => navigate('/')}>
                <img 
                  src="/FONDO UNAMAD.png" 
                  alt="UNAMAD Logo" 
                  className="w-14 h-14 object-contain"
                  onError={handleImageError}
                />
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                <h1 className="text-white font-bold text-xl lg:text-2xl">UNAMAD</h1>
                <p className="text-emerald-200 text-sm lg:text-base">Universidad Nacional Amazónica</p>
                <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                  Investigación Científica
                </Badge>
              </div>
            </div>
            

            {/* VRI Logo y Menu Mobile */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-emerald-200 shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                   onClick={() => navigate('/')}>
                <img 
                  src="/FONDO VRI.png" 
                  alt="VRI Logo" 
                  className="w-14 h-14 object-contain"
                  onError={handleImageError}
                />
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                  <div className="text-white font-bold text-xs text-center">
                    VRI
                  </div>
                </div>
              </div> 
            </div>

          </div>

        </div>
      </header>


      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section mejorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-2 rounded-full text-emerald-200 text-sm mb-6 border border-emerald-400/30 shadow-lg cursor-pointer hover:bg-gradient-to-r hover:from-emerald-500/30 hover:to-blue-500/30 transition-all"
               onClick={() => navigate('/')}>
            <Award className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">Vicerrectorado de Investigación</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <TypeAnimation
              sequence={[
                'Sistema de Gestión',
                1000,
                'de Investigación Científica',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="bg-gradient-to-r from-white via-emerald-100 to-blue-100 bg-clip-text text-transparent"
            />
          </h1>
          
          <p className="text-emerald-100/90 text-lg lg:text-xl max-w-4xl mx-auto mb-10 leading-relaxed">
            Plataforma integral para la gestión, evaluación y difusión de investigaciones académicas 
            de la Universidad Nacional Amazónica de Madre de Dios
          </p>
        </div>

        {/* Action Cards simplificadas */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 mx-auto lg:max-w-4xl">
          {/* Portal de Acceso */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70"></div>
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <UserCircle className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800 mb-2">Portal de Acceso</CardTitle>
              <CardDescription className="text-gray-600">
                Accede al sistema para gestionar tus investigaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/login')}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button 
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-all"
                variant="outline"
                onClick={() => navigate('/user-registration')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Registrarse
              </Button>
            </CardContent>
          </Card>

          {/* Posters Científicos */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-70"></div>
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-800 mb-2">Posters Científicos</CardTitle>
              <CardDescription className="text-gray-600">
                Explora presentaciones de investigación
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/publications')}
              >
                <Search className="w-4 h-4 mr-2" />
                Explorar Posters
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Líneas de investigación simplificadas */}
        <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-white/30 shadow-2xl mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">Líneas de Investigación</h2>
            <p className="text-emerald-200 text-base lg:text-lg">Áreas prioritarias de investigación en la región amazónica</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-400/40 group-hover:border-green-400/60 transition-all">
                <Microscope className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Biodiversidad Amazónica</h3>
              <p className="text-emerald-200 text-sm leading-relaxed">Estudios de conservación y ecología de especies amazónicas</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-400/40 group-hover:border-blue-400/60 transition-all">
                <Beaker className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Recursos Hídricos</h3>
              <p className="text-blue-200 text-sm leading-relaxed">Gestión sostenible del agua y ecosistemas acuáticos</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-400/40 group-hover:border-amber-400/60 transition-all">
                <Globe className="w-8 h-8 text-amber-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Desarrollo Sostenible</h3>
              <p className="text-amber-200 text-sm leading-relaxed">Innovación y modelos de sostenibilidad regional</p>
            </div>
          </div>
        </div>

        {/* Información adicional simplificada */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
              Logros 2024
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-emerald-100 text-sm">15 artículos en revistas Scopus</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-emerald-100 text-sm">3 proyectos FONDECYT aprobados</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-emerald-100 text-sm">Convenio internacional</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Próximos Eventos
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-emerald-400 pl-3">
                <p className="text-white font-semibold text-sm">Simposio de Investigación</p>
                <p className="text-emerald-200 text-xs">15 de Julio, 2025</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-3">
                <p className="text-white font-semibold text-sm">Congreso Internacional</p>
                <p className="text-blue-200 text-xs">20-22 de Agosto, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simplificado */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-md border-t border-white/20 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-6 mb-4">
            <div>
              <h4 className="text-white font-bold text-base mb-2">UNAMAD</h4>
              <div className="text-emerald-200 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>Puerto Maldonado, Madre de Dios</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-2">Contacto VRI</h4>
              <div className="text-emerald-200 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span>vri@unamad.edu.pe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span>+51 82 571080</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-2">Enlaces</h4>
              <div className="space-y-1">
                <Button variant="link" className="text-emerald-200 hover:text-white p-0 h-auto justify-start text-sm" 
                        onClick={() => window.open('https://www.sunedu.gob.pe', '_blank')}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  SUNEDU
                </Button>
                <Button variant="link" className="text-emerald-200 hover:text-white p-0 h-auto justify-start text-sm"
                        onClick={() => window.open('https://portal.concytec.gob.pe', '_blank')}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  CONCYTEC
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
              <div className="text-emerald-200 text-sm">
                © 2025 UNAMAD - Vicerrectorado de Investigación
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Users className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200 text-sm">Investigación Amazónica</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnamadResearchHome;