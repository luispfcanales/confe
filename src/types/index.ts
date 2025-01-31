// Definición de la posición (coordenadas x, y)
export interface Position {
    x: number;
    y: number;
  }
  
  // Definición del tamaño (ancho y alto)
  export interface Size {
    width: number;
    height: number;
  }
  
  // Definición de los estilos aplicables a un cuadro de texto
  export interface Style {
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    textAlign: string;
    borderWidth: string;
    borderStyle: string;
  }
  
  // Definición de un cuadro de texto
  export interface TextBox {
    id: string; // Identificador único del cuadro de texto
    content: string; // Contenido del cuadro de texto
    position: Position; // Posición del cuadro de texto en la página
    size: Size; // Tamaño del cuadro de texto
    style: Style; // Estilos aplicados al cuadro de texto
  }
  
  // Definición de las propiedades del hook useTextBoxes
  export interface UseTextBoxesProps {
    pageWidth: number; // Ancho de la página
    pageHeight: number; // Alto de la página
  }
  
  // Definición de las propiedades del hook useZoom
  export interface UseZoomProps {
    initialZoom?: number; // Zoom inicial (opcional)
  }
  
  // Definición de las propiedades del componente TextBox
  export interface TextBoxProps {
    box: TextBox; // Datos del cuadro de texto
    isSelected: boolean; // Indica si el cuadro de texto está seleccionado
    onTextChange: (id: string, content: string) => void; // Maneja cambios en el contenido
    onDragStart: (e: React.MouseEvent, id: string) => void; // Maneja el inicio del arrastre
    onResizeStart: (e: React.MouseEvent, id: string, direction: string) => void; // Maneja el inicio del redimensionamiento
    onDelete: (id: string) => void; // Maneja la eliminación del cuadro de texto
  }
  
  // Definición de las propiedades del componente ResizeHandles
  export interface ResizeHandlesProps {
    onResizeStart: (e: React.MouseEvent, id: string, direction: string) => void; // Maneja el inicio del redimensionamiento
    boxId: string; // Identificador del cuadro de texto
  }
  
  // Definición de las propiedades del componente FontControls
  export interface FontControlsProps {
    selectedBox: string | null; // Identificador del cuadro de texto seleccionado
    getSelectedBoxStyle: (property: keyof Style) => string; // Obtiene el estilo del cuadro seleccionado
    handleStyleChange: (id: string, styleProperty: keyof Style, value: string) => void; // Maneja cambios en los estilos
  }
  
  // Definición de las propiedades del componente ZoomControls
  export interface ZoomControlsProps {
    zoom: number; // Nivel de zoom actual
    handleZoomIn: () => void; // Maneja el aumento del zoom
    handleZoomOut: () => void; // Maneja la reducción del zoom
  }
  
  // Definición de las propiedades del componente TextControls
  export interface TextControlsProps {
    selectedBox: string | null; // Identificador del cuadro de texto seleccionado
    getSelectedBoxStyle: (property: keyof Style) => string; // Obtiene el estilo del cuadro seleccionado
    handleStyleChange: (id: string, styleProperty: keyof Style, value: string) => void; // Maneja cambios en los estilos
  }
  
  // Definición de las propiedades del componente BorderControls
  export interface BorderControlsProps {
    selectedBox: string | null; // Identificador del cuadro de texto seleccionado
    getSelectedBoxStyle: (property: keyof Style) => string; // Obtiene el estilo del cuadro seleccionado
    handleStyleChange: (id: string, styleProperty: keyof Style, value: string) => void; // Maneja cambios en los estilos
  }