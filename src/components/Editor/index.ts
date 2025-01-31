// Exporta el componente principal del editor
export { default as A4Editor } from './A4Editor';

// Exporta los componentes relacionados con el lienzo (Canvas)
export { default as TextBoxComponent } from './Canvas/TextBox';
export { default as ResizeHandles } from './Canvas/ResizeHandles';

// Exporta los componentes relacionados con la barra de herramientas (Toolbar)
export { default as FontControls } from './Toolbar/FontControls';
export { default as ZoomControls } from './Toolbar/ZoomControls';
export { default as TextControls } from './Toolbar/TextControls';
export { default as BorderControls } from './Toolbar/BorderControls';

// Exporta los hooks relacionados con el editor
export { default as useTextBoxes } from '../../hooks/useTextBoxes';
export { default as useZoom } from '../../hooks/useZoom';

// Exporta los tipos relacionados con el editor
export type { TextBox, Style, Position, Size } from '../../types';