import React, { useState, CSSProperties } from 'react';
import { Card } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import TextBox from './Canvas/TextBox';
import FontControls from './Toolbar/FontControls';
import ZoomControls from './Toolbar/ZoomControls';
import TextControls from './Toolbar/TextControls';
import BorderControls from './Toolbar/BorderControls';
import { TextBox as TextBoxType } from '../../types';

const A4Editor: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [textBoxes, setTextBoxes] = useState<TextBoxType[]>([]);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);

  const pageWidth = 794;
  const pageHeight = 1123;

  const containerStyle: CSSProperties = {
    width: '100%',
    height: 'calc(100vh - 120px)',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '2rem',
    backgroundColor: '#f1f5f9'
  };

  const a4Style: CSSProperties = {
    width: `${pageWidth}px`,
    height: `${pageHeight}px`,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'center top',
    margin: '0 auto',
    position: 'relative'
  };

  const wrapperStyle: CSSProperties = {
    padding: `${20 * (100 / zoom)}px`,
    transformOrigin: 'center top',
    display: 'flex',
    justifyContent: 'center'
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const addTextBox = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    const newTextBox: TextBoxType = {
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
    };

    setTextBoxes([...textBoxes, newTextBox]);
    setSelectedBox(newTextBox.id);
  };

  const handleTextChange = (id: string, content: string) => {
    setTextBoxes(boxes => 
      boxes.map(box => 
        box.id === id ? { ...box, content } : box
      )
    );
  };

  const handleStyleChange = (id: string, styleProperty: keyof TextBoxType['style'], value: string) => {
    setTextBoxes(boxes =>
      boxes.map(box =>
        box.id === id ? { ...box, style: { ...box.style, [styleProperty]: value } } : box
      )
    );
  };

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const box = textBoxes.find(b => b.id === id);
    if (!box) return;

    setIsDragging(true);
    setSelectedBox(id);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleResizeStart = (e: React.MouseEvent, id: string, direction: string) => {
    e.stopPropagation();
    const box = textBoxes.find(b => b.id === id);
    if (!box) return;

    setIsResizing(true);
    setSelectedBox(id);
    setResizeDirection(direction);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ width: box.size.width, height: box.size.height });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging && selectedBox) {
      const container = e.currentTarget.getBoundingClientRect();
      const currentBox = textBoxes.find(box => box.id === selectedBox);
      if (!currentBox) return;

      let x = (e.clientX - container.left - dragOffset.x) / (zoom / 100);
      let y = (e.clientY - container.top - dragOffset.y) / (zoom / 100);

      // Limitar x e y para que el cuadro no se salga de la hoja
      x = Math.max(0, Math.min(x, pageWidth - currentBox.size.width));
      y = Math.max(0, Math.min(y, pageHeight - currentBox.size.height));

      setTextBoxes(boxes =>
        boxes.map(box =>
          box.id === selectedBox ? { ...box, position: { x, y } } : box
        )
      );
    }

    if (isResizing && selectedBox && resizeDirection) {
      const deltaX = (e.clientX - resizeStartPos.x) / (zoom / 100);
      const deltaY = (e.clientY - resizeStartPos.y) / (zoom / 100);

      setTextBoxes(boxes =>
        boxes.map(box => {
          if (box.id !== selectedBox) return box;

          let newWidth = resizeStartSize.width;
          let newHeight = resizeStartSize.height;
          let newX = box.position.x;
          let newY = box.position.y;

          // Calcular nuevas dimensiones y posiciones
          if (resizeDirection.includes('e')) {
            newWidth = Math.max(100, Math.min(resizeStartSize.width + deltaX, pageWidth - box.position.x));
          }
          if (resizeDirection.includes('w')) {
            const maxDeltaX = box.position.x + resizeStartSize.width - 100; // Ancho mínimo
            const clampedDeltaX = Math.max(0, Math.min(deltaX, maxDeltaX));
            newWidth = resizeStartSize.width - clampedDeltaX;
            newX = box.position.x + clampedDeltaX;
          }
          if (resizeDirection.includes('s')) {
            newHeight = Math.max(50, Math.min(resizeStartSize.height + deltaY, pageHeight - box.position.y));
          }
          if (resizeDirection.includes('n')) {
            const maxDeltaY = box.position.y + resizeStartSize.height - 50; // Alto mínimo
            const clampedDeltaY = Math.max(0, Math.min(deltaY, maxDeltaY));
            newHeight = resizeStartSize.height - clampedDeltaY;
            newY = box.position.y + clampedDeltaY;
          }

          return {
            ...box,
            position: { x: newX, y: newY },
            size: { width: newWidth, height: newHeight }
          };
        })
      );
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const deleteTextBox = (id: string) => {
    setTextBoxes(boxes => boxes.filter(box => box.id !== id));
    setSelectedBox(null);
  };

  const getSelectedBoxStyle = (property: keyof TextBoxType['style']) => {
    if (!selectedBox) return '';
    const box = textBoxes.find(b => b.id === selectedBox);
    return box ? box.style[property] : '';
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedBox(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-100">
        <Card className="rounded-none border-x-0 border-t-0">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FontControls
                  selectedBox={selectedBox}
                  getSelectedBoxStyle={getSelectedBoxStyle}
                  handleStyleChange={handleStyleChange}
                />
                <div className="border-l border-gray-200 h-6" />
                <ZoomControls zoom={zoom} handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
                <div className="border-l border-gray-200 h-6" />
                <TextControls
                  selectedBox={selectedBox}
                  getSelectedBoxStyle={getSelectedBoxStyle}
                  handleStyleChange={handleStyleChange}
                />
                <div className="border-l border-gray-200 h-6" />
                <BorderControls
                  selectedBox={selectedBox}
                  getSelectedBoxStyle={getSelectedBoxStyle}
                  handleStyleChange={handleStyleChange}
                />
              </div>
            </div>
          </div>
        </Card>

        <div style={containerStyle}>
          <div style={wrapperStyle}>
            <div 
              className="bg-white"
              style={a4Style}
              onClick={handleBackgroundClick}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {textBoxes.map((box) => (
                <TextBox
                  key={box.id}
                  box={box}
                  isSelected={selectedBox === box.id}
                  onTextChange={handleTextChange}
                  onDragStart={handleDragStart}
                  onResizeStart={handleResizeStart}
                  onDelete={deleteTextBox}
                />
              ))}
              
              {textBoxes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Haz clic para añadir texto
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default A4Editor;