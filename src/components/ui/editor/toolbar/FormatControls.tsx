import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Style } from '@/types/editor';

interface FormatControlsProps {
  selectedBox: string | null;
  getSelectedBoxStyle: (property: keyof Style) => string;
  handleStyleChange: (id: string, property: keyof Style, value: string) => void;
}

export const FormatControls: React.FC<FormatControlsProps> = ({
  selectedBox,
  getSelectedBoxStyle,
  handleStyleChange
}) => {
  const formatButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      tooltip: "Negrita",
      property: 'fontWeight' as keyof Style,
      getValue: () => getSelectedBoxStyle('fontWeight') === 'bold',
      toggle: () => selectedBox && handleStyleChange(
        selectedBox,
        'fontWeight',
        getSelectedBoxStyle('fontWeight') === 'bold' ? 'normal' : 'bold'
      )
    },
    {
      icon: <Italic className="h-4 w-4" />,
      tooltip: "Cursiva",
      property: 'fontStyle' as keyof Style,
      getValue: () => getSelectedBoxStyle('fontStyle') === 'italic',
      toggle: () => selectedBox && handleStyleChange(
        selectedBox,
        'fontStyle',
        getSelectedBoxStyle('fontStyle') === 'italic' ? 'normal' : 'italic'
      )
    },
    {
      icon: <Underline className="h-4 w-4" />,
      tooltip: "Subrayado",
      property: 'textDecoration' as keyof Style,
      getValue: () => getSelectedBoxStyle('textDecoration') === 'underline',
      toggle: () => selectedBox && handleStyleChange(
        selectedBox,
        'textDecoration',
        getSelectedBoxStyle('textDecoration') === 'underline' ? 'none' : 'underline'
      )
    }
  ];

  const alignmentButtons = [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      tooltip: "Alinear a la izquierda",
      value: 'left',
      getValue: () => getSelectedBoxStyle('textAlign') === 'left'
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      tooltip: "Centrar",
      value: 'center',
      getValue: () => getSelectedBoxStyle('textAlign') === 'center'
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      tooltip: "Alinear a la derecha",
      value: 'right',
      getValue: () => getSelectedBoxStyle('textAlign') === 'right'
    },
    {
      icon: <AlignJustify className="h-4 w-4" />,
      tooltip: "Justificar",
      value: "justify",
      getValue: () => getSelectedBoxStyle("textAlign") === "justify",
    },
  ];

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-1">
        {formatButtons.map((button, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant={button.getValue() ? 'secondary' : 'ghost'}
                size="sm"
                onClick={button.toggle}
                disabled={!selectedBox}
              >
                {button.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{button.tooltip}</TooltipContent>
          </Tooltip>
        ))}

        <div className="border-l border-gray-200 mx-2 h-6" />

        {alignmentButtons.map((button, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant={button.getValue() ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => selectedBox && handleStyleChange(selectedBox, 'textAlign', button.value)}
                disabled={!selectedBox}
              >
                {button.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{button.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};