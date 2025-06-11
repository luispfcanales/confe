import { EditorState } from '@/types/editor';
import { API_URL } from '@/constants/api';
/**
 * Exports the current editor state as an SVG file
 * @param editorState The current state of the editor including all text boxes
 * @returns Promise that resolves when the export is complete
 */
export const exportAsSVG = async (editorState: EditorState): Promise<void> => {
  try {
    console.log('Estado del editor a enviar:', editorState);
    
    const response = await fetch(`${API_URL}/api/export/svg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editorState)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al exportar SVG: ${errorText}`);
    }

    const svgBlob = await response.blob();
    const url = window.URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-${editorState.pageSize}-${new Date().toISOString()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error detallado al exportar:', error);
    throw error;
  }
};

//para pdf
export const exportAsPDF = async (editorState: EditorState): Promise<void> => {
    try {
      console.log('Estado del editor a enviar:', JSON.stringify(editorState));
  
      const response = await fetch(`${API_URL}/api/export/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editorState),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al exportar PDF: ${errorText}`);
      }
  
      const pdfBlob = await response.blob();
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${editorState.pageSize}-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error('Error detallado al exportar PDF:', error);
      throw error;
    }
  };

/**
 * Prepares editor state data for export
 * @param textBoxes Array of text boxes in the editor
 * @param currentPageSize Current page size identifier (A4, Letter, etc)
 * @param width Current page width
 * @param height Current page height
 * @returns EditorState object ready for export
 */
export const getEditorState = (
  textBoxes: any[], 
  currentPageSize: string,
  width: number,
  height: number
): EditorState => {

    const editorContainer = document.querySelector('.editor-container');
    const containerRect = editorContainer?.getBoundingClientRect();
    const containerOffsetX = containerRect ? containerRect.left : 0;
    const containerOffsetY = containerRect ? containerRect.top : 0;
  
  console.log(`Editor size: ${width}x${height}, Container offset: (${containerOffsetX}, ${containerOffsetY})`);
  
  return {
    pageSize: currentPageSize,
    width: width,
    height: height,
    textBoxes: textBoxes.map((box) => {
      const boxElement = document.querySelector(`[data-id="${box.id}"]`);
      const textarea = boxElement?.querySelector('textarea');
      const computedStyle = textarea ? window.getComputedStyle(textarea) : null;

      const absoluteX = box.position.x;
      const absoluteY = box.position.y;
      
      console.log(`Box ${box.id}: Content="${box.content.substring(0, 20)}...", Position=(${absoluteX}, ${absoluteY})`);
      
      return {
        id: box.id,
        text: box.content,
        x: box.position.x,
        y: box.position.y,
        width: box.size.width,
        height: box.size.height,
        style: {
          fontFamily: box.style.fontFamily || computedStyle?.fontFamily || 'Arial',
          fontSize: box.style.fontSize || computedStyle?.fontSize || '16px',
          fontWeight: box.style.fontWeight || computedStyle?.fontWeight || 'normal',
          fontStyle: box.style.fontStyle || computedStyle?.fontStyle || 'normal',
          textDecoration: box.style.textDecoration || computedStyle?.textDecoration || 'none',
          textAlign: box.style.textAlign || computedStyle?.textAlign || 'left',
          color: box.style.color || computedStyle?.color || '#000000',
          backgroundColor: box.style.backgroundColor || computedStyle?.backgroundColor || 'transparent',
          padding: computedStyle?.padding || '0px',
          margin: computedStyle?.margin || '0px'
        }
      };
    })
  };
};

// export const getEditorState = (
//   textBoxes: any[], 
//   currentPageSize: string,
//   width: number,
//   height: number
// ): EditorState => {

//   const editorContainer = document.querySelector('.editor-container');
//   const containerRect = editorContainer?.getBoundingClientRect();
//   const containerOffsetX = containerRect ? containerRect.left : 0;
//   const containerOffsetY = containerRect ? containerRect.top : 0;

//   console.log(`Editor size: ${width}x${height}, Container offset: (${containerOffsetX}, ${containerOffsetY})`);

//   // Función para convertir píxeles a puntos
//   const pxToPt = (px: number): number => px * 0.75;//0.75;

//   return {
//     pageSize: currentPageSize,
//     width: pxToPt(width), // Convertir ancho a puntos
//     height: pxToPt(height), // Convertir alto a puntos
//     textBoxes: textBoxes.map((box) => {
//       const boxElement = document.querySelector(`[data-id="${box.id}"]`);
//       const textarea = boxElement?.querySelector('textarea');
//       const computedStyle = textarea ? window.getComputedStyle(textarea) : null;

//       // Convertir coordenadas y dimensiones a puntos
//       const absoluteX = pxToPt(box.position.x);
//       const absoluteY = pxToPt(box.position.y);
//       const boxWidth = pxToPt(box.size.width);
//       const boxHeight = pxToPt(box.size.height);

//       console.log(`Box ${box.id}: Content="${box.content.substring(0, 20)}...", Position=(${absoluteX}, ${absoluteY})`);

//       const paddingInPt = computedStyle?.padding ? pxToPt(parseFloat(computedStyle.padding)) : 0;
//       const margingInPt = computedStyle?.padding ? pxToPt(parseFloat(computedStyle.padding)) : 0;

//       return {
//         id: box.id,
//         text: box.content,
//         x: absoluteX, // Coordenada X en puntos
//         y: absoluteY, // Coordenada Y en puntos
//         width: boxWidth, // Ancho en puntos
//         height: boxHeight, // Alto en puntos
//         style: {
//           fontFamily: box.style.fontFamily || computedStyle?.fontFamily || 'Arial',
//           fontSize: box.style.fontSize || computedStyle?.fontSize || '16px',
//           fontWeight: box.style.fontWeight || computedStyle?.fontWeight || 'normal',
//           fontStyle: box.style.fontStyle || computedStyle?.fontStyle || 'normal',
//           textDecoration: box.style.textDecoration || computedStyle?.textDecoration || 'none',
//           textAlign: box.style.textAlign || computedStyle?.textAlign || 'left',
//           color: box.style.color || computedStyle?.color || '#000000',
//           backgroundColor: box.style.backgroundColor || computedStyle?.backgroundColor || 'transparent',
//           padding: String(paddingInPt) || '0px',
//           margin: String(margingInPt) || '0px'
//         }
//       };
//     })
//   };
// };