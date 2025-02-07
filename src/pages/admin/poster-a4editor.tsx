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
import { PageSidebar } from '@/components/ui/editor/PageSidebar';

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
import { Type, ZoomIn, ZoomOut } from 'lucide-react';


const A4Editor = () => {
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
    addTextBox
  } = useTextBoxes();
  

  const [currentPageSize, setCurrentPageSize] = useState<string>('A4');

  //const [containerHeight, setContainerHeight] = useState(window.innerHeight - 120); // altura inicial
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


  // const { zoom: zoomNumber, handleZoomIn, handleZoomOut } = useEditorZoom(
  //   currentSize.width,
  //   containerHeight
  // );

  // useEffect(() => {
  //   const handleResize = () => {
  //     setContainerHeight(window.innerHeight - 120); // 120px es el header
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: 'calc(100vh - 120px)',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '2rem',
    backgroundColor: '#f1f5f9',
    touchAction: 'none',
  };
  const a4Style: React.CSSProperties = {
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-100">
        <Card className="rounded-none border-x-0 border-t-0">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              
              <FormatControls
                selectedBox={selectedBox}
                getSelectedBoxStyle={getSelectedBoxStyle}
                handleStyleChange={handleStyleChange}
              />
            </div>
          </div>
        </Card>

        <div
          className="editor-container"
          style={containerStyle}
          onWheel={handleWheelEvent}
        >
          {/* <PageSidebar 
            currentPageSize={currentPageSize}
            onPageSizeChange={setCurrentPageSize}
            selectedBox={selectedBox}
            getSelectedBoxStyle={getSelectedBoxStyle}
            handleStyleChange={handleStyleChange}
            //zoom={zoom}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            addTextBox ={addTextBox}
          /> */}
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                ref={editorRef}
                className="editor-page bg-white"
                style={a4Style}
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



export default A4Editor;