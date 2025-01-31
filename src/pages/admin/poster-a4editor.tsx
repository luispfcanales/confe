import React, { useState, CSSProperties } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, List, Type, Image, Move, X, MinusIcon, PlusIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Style {
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: string;
  borderWidth: string;
  borderStyle: string;
}

interface TextBox {
  id: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Style;
}

const A4Editor = () => {
  const [zoom, setZoom] = useState(100);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
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

    const newTextBox: TextBox = {
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

  const handleStyleChange = (id: string, styleProperty: keyof TextBox['style'], value: string) => {
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

  const getSelectedBoxStyle = (property: keyof TextBox['style']) => {
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
                {/* Selectores de fuente y tamaño */}
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
                      <SelectItem value="Arial">
                        <span style={{ fontFamily: 'Arial' }}>Arial</span>
                      </SelectItem>
                      <SelectItem value="Times New Roman">
                        <span style={{ fontFamily: 'Times New Roman' }}>Times New Roman</span>
                      </SelectItem>
                      <SelectItem value="Helvetica">
                        <span style={{ fontFamily: 'Helvetica' }}>Helvetica</span>
                      </SelectItem>
                      <SelectItem value="Georgia">
                        <span style={{ fontFamily: 'Georgia' }}>Georgia</span>
                      </SelectItem>
                      <SelectItem value="Verdana">
                        <span style={{ fontFamily: 'Verdana' }}>Verdana</span>
                      </SelectItem>
                      <SelectItem value="Tahoma">
                        <span style={{ fontFamily: 'Tahoma' }}>Tahoma</span>
                      </SelectItem>
                      <SelectItem value="Courier New">
                        <span style={{ fontFamily: 'Courier New' }}>Courier New</span>
                      </SelectItem>
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

                <div className="border-l border-gray-200 h-6" />
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleZoomOut} size="sm">
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reducir zoom</TooltipContent>
                  </Tooltip>

                  <span className="mx-2 text-sm font-medium">{zoom}%</span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleZoomIn} size="sm">
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Aumentar zoom</TooltipContent>
                  </Tooltip>
                </div>

                <div className="border-l border-gray-200 h-6" />

                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newTextBox: TextBox = {
                            id: Date.now().toString(),
                            content: 'Nuevo texto',
                            position: { x: pageWidth/2 - 100, y: pageHeight/2 - 50 },
                            size: { width: 200, height: 100 },
                            style: {
                              fontSize: '16px',
                              fontFamily: 'Arial',
                              fontWeight: 'normal',
                              fontStyle: 'normal',
                              textDecoration: 'none',
                              textAlign: 'left',
                              borderWidth: '1px',
                              borderStyle: 'none'
                            }
                          };
                          setTextBoxes([...textBoxes, newTextBox]);
                          setSelectedBox(newTextBox.id);
                        }}
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Agregar texto
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Añadir cuadro de texto</TooltipContent>
                  </Tooltip>

                  <div className="border-l border-gray-200 mx-2 h-6" />

                  {/* Control de tamaño de texto */}
                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (!selectedBox) return;
                            const currentSize = parseInt(getSelectedBoxStyle('fontSize'));
                            const newSize = Math.max(8, currentSize - 2);
                            handleStyleChange(selectedBox, 'fontSize', `${newSize}px`);
                          }}
                          disabled={!selectedBox}
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reducir tamaño de texto</TooltipContent>
                    </Tooltip>

                    <span className="text-sm w-12 text-center">
                      {selectedBox ? parseInt(getSelectedBoxStyle('fontSize')) : 16}px
                    </span>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (!selectedBox) return;
                            const currentSize = parseInt(getSelectedBoxStyle('fontSize'));
                            const newSize = Math.min(72, currentSize + 2);
                            handleStyleChange(selectedBox, 'fontSize', `${newSize}px`);
                          }}
                          disabled={!selectedBox}
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Aumentar tamaño de texto</TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="border-l border-gray-200 mx-2 h-6" />

                  {/* Controles de borde */}
                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={getSelectedBoxStyle('borderStyle') !== 'none' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => selectedBox && handleStyleChange(
                            selectedBox,
                            'borderStyle',
                            getSelectedBoxStyle('borderStyle') === 'none' ? 'solid' : 'none'
                          )}
                          disabled={!selectedBox}
                        >
                          <div className="w-4 h-4 border border-current" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Activar/Desactivar borde</TooltipContent>
                    </Tooltip>

                    {getSelectedBoxStyle('borderStyle') !== 'none' && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (!selectedBox) return;
                            const currentWidth = parseInt(getSelectedBoxStyle('borderWidth'));
                            const newWidth = Math.max(1, currentWidth - 1);
                            handleStyleChange(selectedBox, 'borderWidth', `${newWidth}px`);
                          }}
                          disabled={!selectedBox || parseInt(getSelectedBoxStyle('borderWidth')) <= 1}
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>

                        <span className="text-sm w-8 text-center">
                          {parseInt(getSelectedBoxStyle('borderWidth') || '0')}px
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (!selectedBox) return;
                            const currentWidth = parseInt(getSelectedBoxStyle('borderWidth'));
                            const newWidth = Math.min(10, currentWidth + 1);
                            handleStyleChange(selectedBox, 'borderWidth', `${newWidth}px`);
                          }}
                          disabled={!selectedBox || parseInt(getSelectedBoxStyle('borderWidth')) >= 10}
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={getSelectedBoxStyle('fontWeight') === 'bold' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => selectedBox && handleStyleChange(
                          selectedBox,
                          'fontWeight',
                          getSelectedBoxStyle('fontWeight') === 'bold' ? 'normal' : 'bold'
                        )}
                        disabled={!selectedBox}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Negrita</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={getSelectedBoxStyle('fontStyle') === 'italic' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => selectedBox && handleStyleChange(
                          selectedBox,
                          'fontStyle',
                          getSelectedBoxStyle('fontStyle') === 'italic' ? 'normal' : 'italic'
                        )}
                        disabled={!selectedBox}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cursiva</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={getSelectedBoxStyle('textDecoration') === 'underline' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => selectedBox && handleStyleChange(
                          selectedBox,
                          'textDecoration',
                          getSelectedBoxStyle('textDecoration') === 'underline' ? 'none' : 'underline'
                        )}
                        disabled={!selectedBox}
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Subrayado</TooltipContent>
                  </Tooltip>

                  <div className="border-l border-gray-200 mx-2 h-6" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={getSelectedBoxStyle('textAlign') === 'left' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => selectedBox && handleStyleChange(selectedBox, 'textAlign', 'left')}
                        disabled={!selectedBox}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Alinear a la izquierda</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={getSelectedBoxStyle('textAlign') === 'center' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => selectedBox && handleStyleChange(selectedBox, 'textAlign', 'center')}
                        disabled={!selectedBox}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Centrar</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={getSelectedBoxStyle('textAlign') === 'right' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => selectedBox && handleStyleChange(selectedBox, 'textAlign', 'right')}
                        disabled={!selectedBox}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Alinear a la derecha</TooltipContent>
                  </Tooltip>
                </div>
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
                <div
                  key={box.id}
                  className={`absolute ${selectedBox === box.id ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    left: box.position.x,
                    top: box.position.y,
                    width: box.size.width,
                    height: box.size.height,
                  }}
                >
                  <div
                    className="relative w-full h-full"
                    onMouseDown={(e) => handleDragStart(e, box.id)}
                  >
                    {selectedBox === box.id && (
                      <>
                        {/* Botón de eliminar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-4 -right-4 h-8 w-8 p-0"
                          onClick={() => deleteTextBox(box.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        {/* Controles de redimensión */}
                        <div
                          className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-nw-resize"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 'nw')}
                        />
                        <div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-ne-resize"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 'ne')}
                        />
                        <div
                          className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-sw-resize"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 'sw')}
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-se-resize"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 'se')}
                        />
                        <div
                          className="absolute top-1/2 -left-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-w-resize transform -translate-y-1/2"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 'w')}
                        />
                        <div
                          className="absolute top-1/2 -right-1 w-3 h-3 bg-white border-2 border-blue-500 cursor-e-resize transform -translate-y-1/2"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 'e')}
                        />
                        <div
                          className="absolute -top-1 left-1/2 w-3 h-3 bg-white border-2 border-blue-500 cursor-n-resize transform -translate-x-1/2"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 'n')}
                        />
                        <div
                          className="absolute -bottom-1 left-1/2 w-3 h-3 bg-white border-2 border-blue-500 cursor-s-resize transform -translate-x-1/2"
                          onMouseDown={(e) => handleResizeStart(e, box.id, 's')}
                        />
                      </>
                    )}
                    <textarea
                      value={box.content}
                      onChange={(e) => handleTextChange(box.id, e.target.value)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBox(box.id);
                      }}
                    />
                  </div>
                </div>
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
}

export default A4Editor;