// src/pages/admin/poster-editor.tsx
import { useState, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ArrowLeft, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface PosterTemplate {
  title: string;
  description: string;
  category: 'investigacion' | 'desarrollo' | 'innovacion';
  excalidrawData: any;
}

const PosterEditorPage = () => {
  const [template, setTemplate] = useState<PosterTemplate>({
    title: '',
    description: '',
    category: 'investigacion',
    excalidrawData: null
  });

  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const handleBack = () => {
    window.location.href = '/admin/posters';
  };

  const handleSave = async () => {
    if (excalidrawAPI) {
      const excalidrawData = excalidrawAPI.getSceneElements();
      const updatedTemplate = {
        ...template,
        excalidrawData
      };
      console.log('Guardando plantilla:', updatedTemplate);
      // Aquí iría la lógica para guardar en el backend
    }
  };

  const handleExport = useCallback(async () => {
    if (!excalidrawAPI) return;
    
    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) return;

    const blob = await excalidrawAPI.exportToBlob({
      mimeType: 'image/png',
      elements,
      appState: {
        exportWithDarkMode: false,
      },
    });

    // Crear un enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.title || 'poster-template'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [excalidrawAPI, template.title]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Barra superior */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-xl font-semibold">Editor de Plantilla</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel lateral */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={template.title}
                    onChange={(e) => setTemplate({...template, title: e.target.value})}
                    placeholder="Título de la plantilla"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={template.description}
                    onChange={(e) => setTemplate({...template, description: e.target.value})}
                    placeholder="Descripción de la plantilla"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select
                    value={template.category}
                    onValueChange={(value: any) => setTemplate({...template, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investigacion">Investigación</SelectItem>
                      <SelectItem value="desarrollo">Desarrollo</SelectItem>
                      <SelectItem value="innovacion">Innovación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área de Excalidraw */}
          <div className="col-span-9 bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div style={{ height: 'calc(100vh - 200px)' }}>
              <Excalidraw
                ref={(api: any) => setExcalidrawAPI(api)}
                initialData={{
                  appState: {
                    viewBackgroundColor: '#ffffff',
                    currentItemStrokeWidth: 1,
                    gridSize: 20,
                  },
                }}
                UIOptions={{
                  canvasActions: {
                    loadScene: false,
                    saveToActiveFile: false,
                    export: false,
                    saveAsImage: false,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterEditorPage;