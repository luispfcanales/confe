import React from 'react';
import { Style } from '../../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontControlsProps {
  selectedBox: string | null;
  getSelectedBoxStyle: (property: keyof Style) => string;
  handleStyleChange: (id: string, styleProperty: keyof Style, value: string) => void;
}

const FontControls: React.FC<FontControlsProps> = ({
  selectedBox,
  getSelectedBoxStyle,
  handleStyleChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedBox ? getSelectedBoxStyle('fontFamily') : undefined}
        onValueChange={(value) => selectedBox && handleStyleChange(selectedBox, 'fontFamily', value)}
        disabled={!selectedBox}
      >
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Seleccionar fuente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          <SelectItem value="Helvetica">Helvetica</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Verdana">Verdana</SelectItem>
          <SelectItem value="Tahoma">Tahoma</SelectItem>
          <SelectItem value="Courier New">Courier New</SelectItem>
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
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontControls;