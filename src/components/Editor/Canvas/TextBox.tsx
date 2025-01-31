import React from 'react';
import { TextBox } from '../../../types';
import ResizeHandles from './ResizeHandles';

interface TextBoxProps {
  box: TextBox;
  isSelected: boolean;
  onTextChange: (id: string, content: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
  onResizeStart: (e: React.MouseEvent, id: string, direction: string) => void;
  onDelete: (id: string) => void;
}

const TextBoxComponent: React.FC<TextBoxProps> = ({
  box,
  isSelected,
  onTextChange,
  onDragStart,
  onResizeStart,
  onDelete,
}) => {
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
        onMouseDown={(e) => onDragStart(e, box.id)}
      >
        {isSelected && (
          <>
            <button
              className="absolute -top-4 -right-4 h-8 w-8 p-0"
              onClick={() => onDelete(box.id)}
            >
              X
            </button>
            <ResizeHandles onResizeStart={onResizeStart} boxId={box.id} />
          </>
        )}
        <textarea
          value={box.content}
          onChange={(e) => onTextChange(box.id, e.target.value)}
          className="w-full h-full p-2 border-none bg-transparent resize-none focus:outline-none"
          style={{
            fontSize: box.style.fontSize,
            fontFamily: box.style.fontFamily,
            fontWeight: box.style.fontWeight,
            fontStyle: box.style.fontStyle,
            textDecoration: box.style.textDecoration,
            textAlign: box.style.textAlign as any,
            border: box.style.borderStyle !== 'none' ? `${box.style.borderWidth} ${box.style.borderStyle} currentColor` : 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default TextBoxComponent;