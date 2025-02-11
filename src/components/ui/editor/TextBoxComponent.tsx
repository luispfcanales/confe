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
    //{ position: '-top-1 -left-1', cursor: 'nw-resize', direction: 'nw' },
    //{ position: '-top-1 -right-1', cursor: 'ne-resize', direction: 'ne' },
    //{ position: '-bottom-1 -left-1', cursor: 'sw-resize', direction: 'sw' },
    { position: '-bottom-1 -right-1', cursor: 'se-resize', direction: 'se' },
    //{ position: 'top-1/2 -left-1 transform -translate-y-1/2', cursor: 'w-resize', direction: 'w' },
    //{ position: 'top-1/2 -right-1 transform -translate-y-1/2', cursor: 'e-resize', direction: 'e' },
    //{ position: '-top-1 left-1/2 transform -translate-x-1/2', cursor: 'n-resize', direction: 'n' },
    //{ position: '-bottom-1 left-1/2 transform -translate-x-1/2', cursor: 's-resize', direction: 's' }
  ];

  return (
    <div
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: box.position.x,
        top: box.position.y,
        width: box.size.width,
        height: box.size.height,
      }}
    >
      <div
        className="relative w-full h-full"
        //onMouseDown={(e) => onDragStart(e, box.id)}
      >
        {isSelected && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-4 -right-4 h-8 w-8 p-0"
              onClick={() => onDelete(box.id)}
            >
              <X className="h-4 w-4" />
            </Button>

            {resizeHandles.map(({ position, cursor, direction }) => (
              <div
                key={direction}
                className={`absolute ${position} w-3 h-3 bg-white border-2 border-blue-500`}
                style={{ cursor }}
                onMouseDown={(e) => onResizeStart(e, box.id, direction)}
              />
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