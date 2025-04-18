import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Image, FileText } from "lucide-react"

// Add new interface for event images
interface EventImage {
  id: string
  imageUrl: string
  description: string
  year: number
}

interface Poster {
  id: string
  title: string
  authors: string[]
  abstract: string
  imageUrl: string
  year: number
}

const PublicationsPage = (): JSX.Element => {
  const navigate = useNavigate()
  
  // Add state for event images
  const [eventImages] = useState<EventImage[]>([
    {
      id: "1",
      imageUrl: "/event1.jpg",
      description: "Ceremonia de apertura del evento científico 2023",
      year: 2023
    },
    {
      id: "2",
      imageUrl: "/event2.jpg",
      description: "Presentación de posters - Primera Jornada 2024",
      year: 2024
    },
    {
      id: "3",
      imageUrl: "/event3.jpg",
      description: "Conferencia magistral sobre energías renovables 2024",
      year: 2024
    },
    {
      id: "4",
      imageUrl: "/event4.jpg",
      description: "Inauguración del simposio de medicina tropical 2025",
      year: 2025
    },
    {
      id: "5",
      imageUrl: "/event5.jpg",
      description: "Exposición de tecnologías agrícolas emergentes 2025",
      year: 2025
    }
  ])

  // Group event images by year
  const imagesByYear = eventImages.reduce((acc, image) => {
    if (!acc[image.year]) {
      acc[image.year] = []
    }
    acc[image.year].push(image)
    return acc
  }, {} as Record<number, EventImage[]>)

  const imageYears = Object.keys(imagesByYear).sort((a, b) => Number(b) - Number(a))

  // Mock data - Replace this with your actual data fetching logic
  const [posters] = useState<Poster[]>([
    {
      id: "1",
      title: "Impacto de la Inteligencia Artificial en la Educación Superior",
      authors: ["Juan Pérez", "María García"],
      abstract: "Este estudio analiza el impacto de la IA en la educación universitaria...",
      imageUrl: "/poster1.jpg",
      year: 2023
    },
    {
      id: "2",
      title: "Desarrollo Sostenible en la Amazonía Peruana",
      authors: ["Carlos Mendoza", "Ana Luna"],
      abstract: "Investigación sobre prácticas sostenibles y conservación de la biodiversidad en la región amazónica...",
      imageUrl: "/poster2.jpg",
      year: 2024
    },
    {
      id: "3",
      title: "Innovaciones en Energía Renovable",
      authors: ["Luis Torres", "Diana Paz"],
      abstract: "Estudio sobre nuevas tecnologías en energía solar y eólica aplicadas a comunidades rurales...",
      imageUrl: "/poster3.jpg",
      year: 2024
    },
    {
      id: "4",
      title: "Avances en Medicina Tropical",
      authors: ["Patricia Ruiz", "Marco Silva"],
      abstract: "Investigación sobre tratamientos innovadores para enfermedades tropicales endémicas...",
      imageUrl: "/poster4.jpg",
      year: 2025
    },
    {
      id: "5",
      title: "Tecnologías Emergentes en Agricultura",
      authors: ["Roberto Chang", "Elena Vargas"],
      abstract: "Análisis del impacto de la agricultura de precisión y tecnologías IoT en la producción agrícola...",
      imageUrl: "/poster5.jpg",
      year: 2025
    }
  ])

  // Group posters by year
  const postersByYear = posters.reduce((acc, poster) => {
    if (!acc[poster.year]) {
      acc[poster.year] = []
    }
    acc[poster.year].push(poster)
    return acc
  }, {} as Record<number, Poster[]>)

  const years = Object.keys(postersByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100/80 to-gray-200/80 p-6">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-200/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">Posters Científicos</h1>
        </div>

        <Tabs defaultValue="posters" className="w-full">
          <TabsList className="mb-8 bg-white/70 p-1 shadow-sm rounded-lg backdrop-blur-sm">
            <TabsTrigger 
              value="posters"
              className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Posters
            </TabsTrigger>
            <TabsTrigger 
              value="images"
              className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Galería del Evento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posters">
            <Tabs defaultValue={years[0]} className="w-full">
              <TabsList className="mb-8 bg-white/70 p-1 shadow-sm rounded-lg backdrop-blur-sm">
                {years.map((year) => (
                  <TabsTrigger key={year} value={year}>
                    {year}
                  </TabsTrigger>
                ))}
              </TabsList>

              {years.map((year) => (
                <TabsContent key={year} value={year}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postersByYear[Number(year)].map((poster) => (
                      <Card key={poster.id} className="hover:shadow-xl transition-all duration-300 bg-white/80 border-none backdrop-blur-sm">
                        <CardHeader className="space-y-2">
                          <CardTitle className="text-xl font-bold text-gray-800 hover:text-primary transition-colors">
                            {poster.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 font-medium">
                            {poster.authors.join(", ")}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                            <img 
                              src={poster.imageUrl} 
                              alt={poster.title}
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                            {poster.abstract}
                          </p>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          </TabsContent>
          <TabsContent value="images">
            <Tabs defaultValue={imageYears[0]} className="w-full">
              <TabsList className="mb-8 bg-white p-1 shadow-sm rounded-lg">
                {imageYears.map((year) => (
                  <TabsTrigger key={year} value={year}>
                    {year}
                  </TabsTrigger>
                ))}
              </TabsList>

              {imageYears.map((year) => (
                <TabsContent key={year} value={year}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imagesByYear[Number(year)].map((image) => (
                      <Card key={image.id} className="hover:shadow-xl transition-all duration-300 bg-white border-none overflow-hidden">
                        <div className="aspect-square relative group cursor-pointer">
                          <img 
                            src={image.imageUrl} 
                            alt={image.description}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                            <p className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                              {image.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default PublicationsPage