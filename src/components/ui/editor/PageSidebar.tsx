import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MinusIcon, PlusIcon } from 'lucide-react';
import { pageSizes } from '@/constants/pageSizes';
import { FontControls } from '@/components/ui/editor/toolbar/FontControls';
import { Style } from "../../../types/editor";
import { Type } from 'lucide-react';

interface PageSidebarProps {
  currentPageSize: string;
  onPageSizeChange: (size: string) => void;
  selectedBox: string | null;
  getSelectedBoxStyle: (property: keyof Style) => string;
  handleStyleChange: (id: string, property: keyof Style, value: string) => void;
  //zoom: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  addTextBox:(x: number, y: number) => void;
}

export const PageSidebar: React.FC<PageSidebarProps> = ({
  currentPageSize,
  onPageSizeChange,
  selectedBox,
  getSelectedBoxStyle,
  handleStyleChange,
  //zoom,
  handleZoomIn,
  handleZoomOut,
  addTextBox
}) => {
  return (
    <Card className="w-64 h-full p-4 rounded-none border-t-0 border-l-0 border-b-0">
      <div className="space-y-6">
        <div>
          <Label>Tamaño de página</Label>
          <Select value={currentPageSize} onValueChange={onPageSizeChange}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Seleccionar tamaño" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(pageSizes).map(([size, dimensions]) => (
                <SelectItem key={size} value={size}>
                  {size} - {dimensions.width}x{dimensions.height}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Zoom</Label>
          <div className="flex items-center space-x-2 mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleZoomOut} size="sm">
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reducir zoom</TooltipContent>
              </Tooltip>

              {/* <span className="mx-2 text-sm font-medium">{zoom}%</span> */}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleZoomIn} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Aumentar zoom</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div>
          <Label>Fuente</Label>
          <FontControls
            selectedBox={selectedBox}
            getSelectedBoxStyle={getSelectedBoxStyle}
            handleStyleChange={handleStyleChange}
          />
        </div>

        <div>
          <Label>Herramientas</Label>
          <div className="mt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => addTextBox(pageSizes[currentPageSize].width/2 - 100, pageSizes[currentPageSize].height/2 - 50)}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Agregar texto
                </Button>
              </TooltipTrigger>
              <TooltipContent>Añadir cuadro de texto</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};