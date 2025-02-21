import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PilcrowSquare } from 'lucide-react';

interface LineBreakToggleProps {
  selectedBox: string | null;
  onRemoveLineBreaks: () => void;
}

export const LineBreakToggle: React.FC<LineBreakToggleProps> = ({
  selectedBox,
  onRemoveLineBreaks,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemoveLineBreaks}
          disabled={!selectedBox}
          className="h-8 px-2"
          aria-label="Eliminar saltos en selección"
        >
          <PilcrowSquare className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Eliminar saltos en texto seleccionado</p>
      </TooltipContent>
    </Tooltip>
  );
};