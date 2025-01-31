import React from 'react';
import { Button } from '@/components/ui/button';
import { Style } from '../../../types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextControlsProps {
  selectedBox: string | null;
  getSelectedBoxStyle: (property: keyof Style) => string;
  handleStyleChange: (id: string, styleProperty: keyof Style, value: string) => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  selectedBox,
  getSelectedBoxStyle,
  handleStyleChange,
}) => {
  return (
    <div className="flex items-center space-x-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getSelectedBoxStyle('fontWeight') === 'bold' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectedBox && handleStyleChange(
              selectedBox,
              'fontWeight',
              getSelectedBoxStyle('fontWeight') === 'bold' ? 'normal' : 'bold'
            )}
            disabled={!selectedBox}
          >
            <Bold className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Negrita</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getSelectedBoxStyle('fontStyle') === 'italic' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectedBox && handleStyleChange(
              selectedBox,
              'fontStyle',
              getSelectedBoxStyle('fontStyle') === 'italic' ? 'normal' : 'italic'
            )}
            disabled={!selectedBox}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cursiva</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getSelectedBoxStyle('textDecoration') === 'underline' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectedBox && handleStyleChange(
              selectedBox,
              'textDecoration',
              getSelectedBoxStyle('textDecoration') === 'underline' ? 'none' : 'underline'
            )}
            disabled={!selectedBox}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Subrayado</TooltipContent>
      </Tooltip>

      <div className="border-l border-gray-200 mx-2 h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getSelectedBoxStyle('textAlign') === 'left' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectedBox && handleStyleChange(selectedBox, 'textAlign', 'left')}
            disabled={!selectedBox}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Alinear a la izquierda</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getSelectedBoxStyle('textAlign') === 'center' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectedBox && handleStyleChange(selectedBox, 'textAlign', 'center')}
            disabled={!selectedBox}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Centrar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={getSelectedBoxStyle('textAlign') === 'right' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => selectedBox && handleStyleChange(selectedBox, 'textAlign', 'right')}
            disabled={!selectedBox}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Alinear a la derecha</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TextControls;