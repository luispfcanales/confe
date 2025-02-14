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
import html2canvas from 'html2canvas';

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
import { Type, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { FontControls } from '@/components/ui/editor/toolbar/FontControls';
import { Button } from '@/components/ui/button';


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

  //aqui para exportar

  const handleExportAsPNG = async () => {
    if (!editorRef.current) return;
  
    try {
      const editorElement = editorRef.current;
      const originalStyles = {
        transform: editorElement.style.transform,
        position: editorElement.style.position,
        margin: editorElement.style.margin,
        width: editorElement.style.width,
        height: editorElement.style.height
      };
  
      // Prepara el elemento para la captura
      editorElement.style.transform = 'none';
      editorElement.style.margin = '0';
      editorElement.style.width = `${currentSize.width}px`;
      editorElement.style.height = `${currentSize.height}px`;
  
      // Oculta elementos UI
      const buttons = Array.from(editorElement.querySelectorAll('button')) as HTMLElement[];
      const resizeHandles = Array.from(editorElement.querySelectorAll('[data-resize-handle]')) as HTMLElement[];
      
      buttons.forEach(button => button.style.display = 'none');
      resizeHandles.forEach(handle => handle.style.display = 'none');
  
      // Remueve selección
      const selectedElements = editorElement.querySelectorAll('.ring-2');
      selectedElements.forEach(el => {
        el.classList.remove('ring-2', 'ring-blue-500');
      });
  
      // Preprocesa los textareas antes de la captura
      const textareas = editorElement.querySelectorAll('textarea') as NodeListOf<HTMLTextAreaElement>;
      const originalTextareaContents: { element: HTMLTextAreaElement; content: string; style: CSSStyleDeclaration }[] = [];
  
      textareas.forEach(textarea => {
        originalTextareaContents.push({
          element: textarea,
          content: textarea.value,
          style: window.getComputedStyle(textarea)
        });
  
        // Crea un div para reemplazar el textarea
        const div = document.createElement('div');
        div.innerHTML = textarea.value.replace(/\n/g, '<br>');
        
        // Copia los estilos computados
        const computedStyle = window.getComputedStyle(textarea);
        div.style.cssText = textarea.style.cssText;
        div.style.position = 'absolute';
        div.style.width = computedStyle.width;
        div.style.height = 'auto';
        div.style.minHeight = computedStyle.height;
        div.style.fontFamily = computedStyle.fontFamily;
        div.style.fontSize = computedStyle.fontSize;
        div.style.fontWeight = computedStyle.fontWeight;
        div.style.fontStyle = computedStyle.fontStyle;
        div.style.textDecoration = computedStyle.textDecoration;
        div.style.textAlign = computedStyle.textAlign;
        div.style.color = computedStyle.color;
        div.style.lineHeight = computedStyle.lineHeight;
        div.style.padding = computedStyle.padding;
        div.style.margin = computedStyle.margin;
        div.style.border = 'none';
        div.style.background = 'transparent';
        div.style.whiteSpace = 'pre-wrap';
        div.style.overflow = 'visible';
  
        // Reemplaza el textarea con el div
        textarea.parentNode?.insertBefore(div, textarea);
        textarea.style.display = 'none';
      });
  
      await new Promise(resolve => setTimeout(resolve, 100));
  
      const canvas = await html2canvas(editorElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: currentSize.width,
        height: currentSize.height,
        logging: true,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            .group {
              position: absolute !important;
              transform-origin: top left !important;
            }
            div {
              transform-origin: top left !important;
              position: absolute !important;
              white-space: pre-wrap !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
  
      // Restaura los textareas originales
      textareas.forEach((textarea, index) => {
        const original = originalTextareaContents[index];
        textarea.style.display = '';
        textarea.value = original.content;
        const divToRemove = textarea.previousSibling;
        if (divToRemove) {
          divToRemove.remove();
        }
      });
  
      // Crea y descarga la imagen
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `document-${currentPageSize}-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
  
      // Restaura todo
      buttons.forEach(button => button.style.display = '');
      resizeHandles.forEach(handle => handle.style.display = '');
      selectedElements.forEach(el => {
        el.classList.add('ring-2', 'ring-blue-500');
      });
  
      if (editorElement && originalStyles) {
        Object.entries(originalStyles).forEach(([key, value]) => {
          editorElement.style[key as any] = value || '';
        });
      }
  
    } catch (error) {
      console.error('Error al exportar:', error);
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
              </div>
              
              {/* Botón de exportar */}
              <Button
                onClick={handleExportAsPNG}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Exportar PNG
              </Button>
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