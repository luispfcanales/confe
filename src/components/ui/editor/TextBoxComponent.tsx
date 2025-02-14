import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TextBox } from '@/types/editor';

interface TextBoxProps {
  box: TextBox;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, content: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
  onResizeStart: (e: React.MouseEvent, id: string, direction: string) => void;
}

export const TextBoxComponent: React.FC<TextBoxProps> = ({
  box,
  isSelected,
  onSelect,
  onDelete,
  onChange,
  onDragStart,
  onResizeStart
}) => {
  const resizeHandles = [
    { position: '-bottom-2 -right-2', cursor: 'se-resize', direction: 'se' }
  ];

  return (
    <div
      data-id={box.id}  // Añade esta línea
      //className={`absolute group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      className={`absolute group ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-200'}`}
      style={{
        left: box.position.x,
        top: box.position.y,
        width: box.size.width,
        height: box.size.height,
      }}
    >
      <div
        className="relative w-full h-full"
        onMouseDown={(e) => {
          if (e.ctrlKey) {
            e.preventDefault();
            onDragStart(e, box.id);
          }
        }}
      >
        {isSelected && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-4 -right-4 h-8 w-8 p-0 bg-white hover:bg-red-50 shadow-sm"
              onClick={() => onDelete(box.id)}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>

            {resizeHandles.map(({ position, cursor, direction }) => (
              <div
                key={direction}
                className={`absolute ${position} w-5 h-5 bg-white border-2 border-blue-500 shadow-md hover:border-blue-600 hover:bg-blue-50 transition-colors duration-150`}
                style={{ 
                  cursor,
                  transform: 'translate(50%, 50%)',
                  zIndex: 50 
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onResizeStart(e, box.id, direction);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                </div>
              </div>
            ))}
          </>
        )}

        <textarea
          value={box.content}
          onChange={(e) => onChange(box.id, e.target.value)}
          className="w-full h-full p-2 border-none bg-transparent resize-none focus:outline-none"
          style={{
            fontSize: box.style.fontSize,
            fontFamily: box.style.fontFamily,
            fontWeight: box.style.fontWeight,
            fontStyle: box.style.fontStyle,
            textDecoration: box.style.textDecoration,
            textAlign: box.style.textAlign as any,
            border: box.style.borderStyle !== 'none' 
              ? `${box.style.borderWidth} ${box.style.borderStyle} currentColor` 
              : 'none',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(box.id);
          }}
        />
      </div>
    </div>
  );
};