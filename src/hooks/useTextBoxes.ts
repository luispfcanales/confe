import { useState } from 'react';
import { TextBox, Style } from '@/types/editor';

interface UseTextBoxesState {
  textBoxes: TextBox[];
  selectedBox: string | null;
  isDragging: boolean;
  isResizing: boolean;
  dragOffset: { x: number; y: number };
  resizeStartPos: { x: number; y: number };
  resizeStartSize: { width: number; height: number };
  resizeDirection: string | null;
}

export const useTextBoxes = (pageWidth = 794, pageHeight = 1123) => {
  const [state, setState] = useState<UseTextBoxesState>({
    textBoxes: [],
    selectedBox: null,
    isDragging: false,
    isResizing: false,
    dragOffset: { x: 0, y: 0 },
    resizeStartPos: { x: 0, y: 0 },
    resizeStartSize: { width: 0, height: 0 },
    resizeDirection: null
  });

  const createNewTextBox = (x: number, y: number): TextBox => ({
    id: Date.now().toString(),
    content: 'Nuevo texto',
    position: { x, y },
    size: { width: 200, height: 100 },
    style: {
      fontSize: '16px',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      borderWidth: '1px',
      borderStyle: 'none',
    }
  });

  const addTextBox = (x: number, y: number) => {
    const newBox = createNewTextBox(x, y);
    setState(prev => ({
      ...prev,
      textBoxes: [...prev.textBoxes, newBox],
      selectedBox: newBox.id
    }));
  };

  const handleTextChange = (id: string, content: string) => {
    setState(prev => ({
      ...prev,
      textBoxes: prev.textBoxes.map(box =>
        box.id === id ? { ...box, content } : box
      )
    }));
  };

  const handleStyleChange = (id: string, property: keyof Style, value: string) => {
    setState(prev => ({
      ...prev,
      textBoxes: prev.textBoxes.map(box =>
        box.id === id ? { ...box, style: { ...box.style, [property]: value } } : box
      )
    }));
  };

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setState(prev => ({
      ...prev,
      isDragging: true,
      selectedBox: id,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }));
  };

  const handleResizeStart = (e: React.MouseEvent, id: string, direction: string) => {
    setState(prev => {
      const box = prev.textBoxes.find(b => b.id === id);
      if (!box) return prev;

      return {
        ...prev,
        isResizing: true,
        selectedBox: id,
        resizeDirection: direction,
        resizeStartPos: { x: e.clientX, y: e.clientY },
        resizeStartSize: { width: box.size.width, height: box.size.height }
      };
    });
  };

  const handleDragMove = (e: React.MouseEvent, zoom: number) => {
    if (state.isDragging && state.selectedBox) {
      const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const currentBox = state.textBoxes.find(box => box.id === state.selectedBox);
      if (!currentBox) return;
 
      const x = Math.max(0, Math.min(
        (e.clientX - container.left - state.dragOffset.x) / (zoom / 100),
        pageWidth - currentBox.size.width
      ));
 
      const y = Math.max(0, Math.min(
        (e.clientY - container.top - state.dragOffset.y) / (zoom / 100),
        pageHeight - currentBox.size.height
      ));
 
      setState(prev => ({
        ...prev,
        textBoxes: prev.textBoxes.map(box =>
          box.id === state.selectedBox ? { ...box, position: { x, y } } : box
        )
      }));
    }
 
    if (state.isResizing && state.selectedBox && state.resizeDirection) {
      const deltaX = (e.clientX - state.resizeStartPos.x) / (zoom / 100);
      const deltaY = (e.clientY - state.resizeStartPos.y) / (zoom / 100);
      
      setState(prev => ({
        ...prev,
        textBoxes: prev.textBoxes.map(box => {
          if (box.id !== state.selectedBox) return box;
          return handleResize(box, deltaX, deltaY, state.resizeDirection!, state.resizeStartSize, zoom);
        })
      }));
    }
  };

  const handleResize = (
    box: TextBox,
    deltaX: number,
    deltaY: number,
    direction: string,
    startSize: { width: number; height: number },
    zoom: number
  ): TextBox => {
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = box.position.x;
    let newY = box.position.y;
 
    const scaledDeltaX = deltaX * (zoom / 100);
    const scaledDeltaY = deltaY * (zoom / 100);
 
    if (direction.includes('e')) {
      newWidth = Math.max(100, Math.min(startSize.width + scaledDeltaX, pageWidth - box.position.x));
    }
    if (direction.includes('w')) {
      const maxDeltaX = box.position.x + startSize.width - 100;
      const clampedDeltaX = Math.max(0, Math.min(scaledDeltaX, maxDeltaX));
      newWidth = startSize.width - clampedDeltaX;
      newX = box.position.x + clampedDeltaX;
    }
    if (direction.includes('s')) {
      newHeight = Math.max(50, Math.min(startSize.height + scaledDeltaY, pageHeight - box.position.y));
    }
    if (direction.includes('n')) {
      const maxDeltaY = box.position.y + startSize.height - 50;
      const clampedDeltaY = Math.max(0, Math.min(scaledDeltaY, maxDeltaY));
      newHeight = startSize.height - clampedDeltaY;
      newY = box.position.y + clampedDeltaY;
    }
 
    return {
      ...box,
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight }
    };
  };

  const handleDragEnd = () => {
    setState(prev => ({
      ...prev,
      isDragging: false,
      isResizing: false,
      resizeDirection: null
    }));
  };

  const deleteTextBox = (id: string) => {
    setState(prev => ({
      ...prev,
      textBoxes: prev.textBoxes.filter(box => box.id !== id),
      selectedBox: null
    }));
  };

  return {
    ...state,
    setSelectedBox: (id: string | null) => setState(prev => ({ ...prev, selectedBox: id })),
    addTextBox,
    handleTextChange,
    handleStyleChange,
    handleDragStart,
    handleResizeStart,
    handleDragMove,
    handleDragEnd,
    deleteTextBox
  };
};