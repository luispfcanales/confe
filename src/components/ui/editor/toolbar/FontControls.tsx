import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Style } from "../../../../types/editor"

interface FontControlsProps {
  selectedBox: string | null;
  getSelectedBoxStyle: (property: keyof Style) => string;
  handleStyleChange: (id: string, property: keyof Style, value: string) => void;
}

export const FontControls: React.FC<FontControlsProps> = ({
  selectedBox,
  getSelectedBoxStyle,
  handleStyleChange,
}) => {
  const fontFamilies = [
    'Arial', 'Times New Roman', 'Helvetica', 'Georgia',
    'Verdana', 'Tahoma', 'Courier New'
  ];
  
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedBox ? getSelectedBoxStyle('fontFamily') : undefined}
        onValueChange={(value) => selectedBox && handleStyleChange(selectedBox, 'fontFamily', value)}
        disabled={!selectedBox}
      >
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="fuente" />
        </SelectTrigger>
        <SelectContent>
          {fontFamilies.map(font => (
            <SelectItem key={font} value={font}>
              <span style={{ fontFamily: font }}>{font}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedBox ? getSelectedBoxStyle('fontSize').replace('px', '') : undefined}
        onValueChange={(value) => selectedBox && handleStyleChange(selectedBox, 'fontSize', `${value}px`)}
        disabled={!selectedBox}
      >
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue placeholder="Tamaño" />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map(size => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};