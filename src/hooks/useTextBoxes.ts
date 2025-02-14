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

interface PageDimensions {
  width: number;
  height: number;
}

export const useTextBoxes = () => {
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
    const container = e.currentTarget as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const pageDimensions = {
      width: container.offsetWidth,
      height: container.offsetHeight
    };

    if (state.isDragging && state.selectedBox) {
      const currentBox = state.textBoxes.find(box => box.id === state.selectedBox);
      if (!currentBox) return;

      const zoomFactor = zoom / 100;
      const x = (e.clientX - containerRect.left - state.dragOffset.x) / zoomFactor;
      const y = (e.clientY - containerRect.top - state.dragOffset.y) / zoomFactor;

      setState(prev => ({
        ...prev,
        textBoxes: prev.textBoxes.map(box =>
          box.id === state.selectedBox
            ? {
                ...box,
                position: {
                  x: Math.max(0, Math.min(x, pageDimensions.width - box.size.width)),
                  y: Math.max(0, Math.min(y, pageDimensions.height - box.size.height))
                }
              }
            : box
        )
      }));
    }

    if (state.isResizing && state.selectedBox && state.resizeDirection) {
      const zoomFactor = zoom / 100;
      const deltaX = (e.clientX - state.resizeStartPos.x) / zoomFactor;
      const deltaY = (e.clientY - state.resizeStartPos.y) / zoomFactor;

      setState(prev => ({
        ...prev,
        textBoxes: prev.textBoxes.map(box => {
          if (box.id !== state.selectedBox) return box;
          return handleResize(box, deltaX, deltaY, state.resizeDirection!, state.resizeStartSize, pageDimensions);
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
    pageDimensions: PageDimensions
  ): TextBox => {
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = box.position.x;
    let newY = box.position.y;

    const minWidth = 100;
    const minHeight = 50;

    if (direction === 'se') {
      // Permitir crecer hasta el límite de la página
      newWidth = Math.max(minWidth, Math.min(startSize.width + deltaX, pageDimensions.width - box.position.x));
      newHeight = Math.max(minHeight, Math.min(startSize.height + deltaY, pageDimensions.height - box.position.y));
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