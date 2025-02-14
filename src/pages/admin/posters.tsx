import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Download, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Los tipos se mantienen igual...
type PosterStatus = 'active' | 'draft' | 'archived';
type PosterCategory = 'investigacion' | 'desarrollo' | 'innovacion';

interface Poster {
  id: number;
  title: string;
  description: string;
  category: PosterCategory;
  status: PosterStatus;
  templateUrl: string;
  createdAt: string;
}

interface NewPoster {
  title: string;
  description: string;
  category: PosterCategory;
  templateUrl: string;
}

const PostersPage = () => {
  const [posters, setPosters] = useState<Poster[]>([
    {
      id: 1,
      title: 'Plantilla Investigación Científica',
      description: 'Plantilla estándar para proyectos de investigación científica. Incluye secciones para metodología, resultados y conclusiones.',
      category: 'investigacion',
      status: 'active',
      templateUrl: '/templates/scientific-research.pdf',
      createdAt: '2024-01-22'
    }
  ]);

  // Estados y manejadores se mantienen igual...
  // const [newPoster, setNewPoster] = useState<NewPoster>({
  //   title: '',
  //   description: '',
  //   category: 'investigacion',
  //   templateUrl: ''
  // });

  // const [dialogOpen, setDialogOpen] = useState(false);

  // Los manejadores se mantienen igual...
  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setNewPoster(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // const handleCategoryChange = (value: PosterCategory) => {
  //   setNewPoster(prev => ({
  //     ...prev,
  //     category: value
  //   }));
  // };

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setNewPoster(prev => ({
  //       ...prev,
  //       templateUrl: `/templates/${file.name}`
  //     }));
  //   }
  // };

  // const handleCreatePoster = () => {
  //   const newPosterWithId: Poster = {
  //     id: posters.length + 1,
  //     ...newPoster,
  //     status: 'active',
  //     createdAt: new Date().toISOString().split('T')[0]
  //   };

  //   setPosters(prev => [...prev, newPosterWithId]);
  //   setNewPoster({
  //     title: '',
  //     description: '',
  //     category: 'investigacion',
  //     templateUrl: ''
  //   });
  //   setDialogOpen(false);
  // };

  const deletePoster = (posterId: number) => {
    setPosters(posters.filter(poster => poster.id !== posterId));
  };

  const getCategoryLabel = (category: PosterCategory) => {
    const labels = {
      investigacion: 'Investigación',
      desarrollo: 'Desarrollo',
      innovacion: 'Innovación'
    };
    return labels[category];
  };

  const getCategoryColor = (category: PosterCategory) => {
    const colors = {
      investigacion: 'bg-blue-100 text-blue-800',
      desarrollo: 'bg-purple-100 text-purple-800',
      innovacion: 'bg-orange-100 text-orange-800'
    };
    return colors[category];
  };

  const getStatusColor = (status: PosterStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Posters Científicos</h1>
        <Button onClick={() => window.location.href = '/admin/posters/a4-new'}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Nueva vista de cuadrícula de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posters.map((poster) => (
          <Card key={poster.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{poster.title}</CardTitle>
                <Badge className={`hover:bg-green-100 ${getStatusColor(poster.status)}`}>
                  {poster.status === 'active' ? 'Activo' : 
                   poster.status === 'draft' ? 'Borrador' : 'Archivado'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <CalendarDays className="h-4 w-4" />
                {poster.createdAt}
              </div>
              <Badge className={`mt-2 ${getCategoryColor(poster.category)}`}>
                {getCategoryLabel(poster.category)}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600">{poster.description}</p>
            </CardContent>
            
            <CardFooter className="mt-auto pt-4 flex justify-between">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(poster.templateUrl, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => console.log('Descargar:', poster.templateUrl)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => console.log('Editar poster:', poster.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => deletePoster(poster.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostersPage;