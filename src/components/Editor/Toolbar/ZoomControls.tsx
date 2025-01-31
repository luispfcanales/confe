import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, handleZoomIn, handleZoomOut }) => {
  return (
    <div className="flex items-center space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={handleZoomOut} size="sm">
            <MinusIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reducir zoom</TooltipContent>
      </Tooltip>

      <span className="mx-2 text-sm font-medium">{zoom}%</span>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={handleZoomIn} size="sm">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Aumentar zoom</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ZoomControls;