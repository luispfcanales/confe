import React from 'react';

interface ResizeHandlesProps {
  onResizeStart: (e: React.MouseEvent, id: string, direction: string) => void;
  boxId: string;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResizeStart, boxId }) => {
  return (
    <>
      <div
        className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-nw-resize"
        onMouseDown={(e) => onResizeStart(e, boxId, 'nw')}
      />
      <div
        className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-ne-resize"
        onMouseDown={(e) => onResizeStart(e, boxId, 'ne')}
      />
      <div
        className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-sw-resize"
        onMouseDown={(e) => onResizeStart(e, boxId, 'sw')}
      />
      <div
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-se-resize"
        onMouseDown={(e) => onResizeStart(e, boxId, 'se')}
      />
      <div
        className="absolute top-1/2 -left-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-w-resize transform -translate-y-1/2"
        onMouseDown={(e) => onResizeStart(e, boxId, 'w')}
      />
      <div
        className="absolute top-1/2 -right-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-e-resize transform -translate-y-1/2"
        onMouseDown={(e) => onResizeStart(e, boxId, 'e')}
      />
      <div
        className="absolute -top-1 left-1/2 w-3 h-3 bg-white border-2 border-blue-500 cursor-n-resize transform -translate-x-1/2"
        onMouseDown={(e) => onResizeStart(e, boxId, 'n')}
      />
      <div
        className="absolute -bottom-1 left-1/2 w-3 h-3 bg-white border-2 border-blue-500 cursor-s-resize transform -translate-x-1/2"
        onMouseDown={(e) => onResizeStart(e, boxId, 's')}
      />
    </>
  );
};

export default ResizeHandles;