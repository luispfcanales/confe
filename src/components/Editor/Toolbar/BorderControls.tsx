import React from 'react';
import { Button } from '@/components/ui/button';
import { Style } from '../../../types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface BorderControlsProps {
  selectedBox: string | null;
  getSelectedBoxStyle: (property: keyof Style) => string;
  handleStyleChange: (id: string, styleProperty: keyof Style, value: string) => void;
}

const BorderControls: React.FC<BorderControlsProps> = ({
  selectedBox,
  getSelectedBoxStyle,
  handleStyleChange,
}) => {
  return (
    <div className="flex items-center space-x-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getSelectedBoxStyle('borderStyle') !== 'none' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectedBox && handleStyleChange(
              selectedBox,
              'borderStyle',
              getSelectedBoxStyle('borderStyle') === 'none' ? 'solid' : 'none'
            )}
            disabled={!selectedBox}
          >
            <div className="w-4 h-4 border border-current" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Activar/Desactivar borde</TooltipContent>
      </Tooltip>

      {getSelectedBoxStyle('borderStyle') !== 'none' && (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!selectedBox) return;
              const currentWidth = parseInt(getSelectedBoxStyle('borderWidth'));
              const newWidth = Math.max(1, currentWidth - 1);
              handleStyleChange(selectedBox, 'borderWidth', `${newWidth}px`);
            }}
            disabled={!selectedBox || parseInt(getSelectedBoxStyle('borderWidth')) <= 1}
          >
            <MinusIcon className="h-3 w-3" />
          </Button>

          <span className="text-sm w-8 text-center">
            {parseInt(getSelectedBoxStyle('borderWidth') || '0')}px
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!selectedBox) return;
              const currentWidth = parseInt(getSelectedBoxStyle('borderWidth'));
              const newWidth = Math.min(10, currentWidth + 1);
              handleStyleChange(selectedBox, 'borderWidth', `${newWidth}px`);
            }}
            disabled={!selectedBox || parseInt(getSelectedBoxStyle('borderWidth')) >= 10}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BorderControls;