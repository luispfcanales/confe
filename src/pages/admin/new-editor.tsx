import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { TooltipProvider } from "@/components/ui/tooltip";
import { FormatControls } from '@/components/ui/editor/toolbar/FormatControls';
import { TextBoxComponent } from '@/components/ui/editor/TextBoxComponent';
import { useTextBoxes } from '@/hooks/useTextBoxes';
import { useEditorZoom } from '@/hooks/useEditorZoom';
import { Style } from '@/types/editor';
import { pageSizes } from '@/constants/pageSizes';
import { LineBreakToggle } from '@/components/ui/editor/toolbar/LineBreakToggle';
import { exportAsSVG,exportAsPDF, getEditorState } from '@/utils/exportUtils';


import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  //right
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu"
import { Type, ZoomIn, ZoomOut, Download,File,FileImageIcon } from 'lucide-react';
import { FontControls } from '@/components/ui/editor/toolbar/FontControls';




const NewEditor = () => {
  const {
    textBoxes,
    selectedBox,
    setSelectedBox,
    handleTextChange,
    handleStyleChange,
    handleDragStart,
    handleResizeStart,
    handleDragMove,
    handleDragEnd,
    deleteTextBox,
    addTextBox,
    removeLineBreaksInSelection
  } = useTextBoxes();
  

  const [currentPageSize, setCurrentPageSize] = useState<string>('A4');

  const currentSize = pageSizes[currentPageSize];
  
  const { zoom: zoomNumber, handleZoomIn, handleZoomOut, handleWheelZoom } = useEditorZoom();
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('wheel', handleWheelZoom, { passive: false });
      
      return () => {
        editor.removeEventListener('wheel', handleWheelZoom);
      };
    }
  }, [handleWheelZoom]);

  const handleWheelEvent = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    width: '80vw',
    height: 'calc(100vh - 100px)',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '2rem',
    backgroundColor: '#f1f5f9',
    touchAction: 'none',
    margin: 'auto',
    overflowY:'auto',
  };
  const sheetStyle: React.CSSProperties = {
    width: `${currentSize.width}px`,
    height: `${currentSize.height}px`,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transform: `scale(${zoomNumber / 100})`,
    transformOrigin: 'center top',
    margin: '0 auto',
    position: 'relative'
  };

  const getSelectedBoxStyle = (property: keyof Style) => {
    if (!selectedBox) return '';
    const box = textBoxes.find(b => b.id === selectedBox);
    return box ? box.style[property] : '';
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedBox(null);
    }
  };


const handleExportAsSVG = async () => {
  try {
    console.log('TextBoxes antes de convertir:', textBoxes);
    const editorState = getEditorState(
      textBoxes, 
      currentPageSize,
      currentSize.width,
      currentSize.height
    );
    await exportAsSVG(editorState);
  } catch (error) {
    console.error('Error al exportar SVG:', error);
  }
};

const handleExportAsPDF = async () => {
  try {
    console.log('TextBoxes antes de convertir:', textBoxes);
    const editorState = getEditorState(
      textBoxes, 
      currentPageSize,
      currentSize.width,
      currentSize.height
    );
    await exportAsPDF(editorState);
  } catch (error) {
    console.error('Error al exportar PDF:', error);
  }
};

  return (
    <TooltipProvider>
      <div className="bg-slate-100">
        <Card className="rounded-none border-x-0 border-t-0">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FormatControls
                  selectedBox={selectedBox}
                  getSelectedBoxStyle={getSelectedBoxStyle}
                  handleStyleChange={handleStyleChange}
                />
                <div className="h-6 w-px bg-gray-200" />
                <FontControls
                  selectedBox={selectedBox}
                  getSelectedBoxStyle={getSelectedBoxStyle}
                  handleStyleChange={handleStyleChange}
                />
                <LineBreakToggle
                  selectedBox={selectedBox}
                  onRemoveLineBreaks={() => {
                    if (selectedBox) {
                      const textarea = document.querySelector(`[data-id="${selectedBox}"] textarea`) as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        if (start !== end) {
                          removeLineBreaksInSelection(selectedBox, start, end);
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <div
          className="editor-container"
          style={{
            ...containerStyle,
          }}
          onWheel={handleWheelEvent}
        >
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                ref={editorRef}
                className="editor-page bg-white"
                style={sheetStyle}
                onClick={handleBackgroundClick}
                onMouseMove={(e) => handleDragMove(e, zoomNumber)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {textBoxes.map((box) => (
                  <TextBoxComponent
                    key={box.id}
                    box={box}
                    isSelected={selectedBox === box.id}
                    onSelect={(id) => setSelectedBox(id)}
                    onDelete={deleteTextBox}
                    onChange={handleTextChange}
                    onDragStart={handleDragStart}
                    onResizeStart={handleResizeStart}
                    onRemoveLineBreaks={removeLineBreaksInSelection}
                  />
                ))}

                {textBoxes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Haz clic en el botón "Agregar texto"
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
            
            <ContextMenuContent className="w-64">
              <ContextMenuItem onClick={() => addTextBox(
                pageSizes[currentPageSize].width/2 - 100, 
                pageSizes[currentPageSize].height/2 - 50
              )}>
                <Type className="h-4 w-4 mr-2" />
                Agregar texto
              </ContextMenuItem>
              
              <ContextMenuSeparator />

              <ContextMenuSub>
                <ContextMenuSubTrigger inset>Exportar</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-20">
                  <ContextMenuItem onClick={handleExportAsSVG}>
                    <Download className="h-4 w-4 mr-4" />
                    SVG
                    <FileImageIcon className="h-4 w-4 ml-2" />
                  </ContextMenuItem>
                  <ContextMenuItem onClick={handleExportAsPDF}>
                    <Download className="h-4 w-4 mr-4" />
                    PDF
                    <File className="h-4 w-4 ml-2" />
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              
              <ContextMenuSeparator />
              
              <ContextMenuItem onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4 mr-2" />
                Aumentar zoom
              </ContextMenuItem>
              
              <ContextMenuItem onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4 mr-2" />
                Reducir zoom
              </ContextMenuItem>
              
              <ContextMenuSeparator />
              
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>Tamaño de Hoja</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  {Object.entries(pageSizes).map(([size, dimensions]) => (
                    <ContextMenuCheckboxItem
                      key={size}
                      checked={currentPageSize === size}
                      onCheckedChange={() => setCurrentPageSize(size)}
                    >
                      {size} - {dimensions.width}x{dimensions.height}
                    </ContextMenuCheckboxItem >
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>

              
              {/* Puedes agregar más tamaños de página aquí */}
            </ContextMenuContent>
          </ContextMenu>

        </div>
      </div>
    </TooltipProvider>
  );
};



export default NewEditor;