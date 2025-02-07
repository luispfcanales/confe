// import { useState, useEffect } from 'react';

// export const useEditorZoom = (pageWidth: number, containerHeight: number) => {
//   const [zoom, setZoom] = useState(100);

//   const calculateIdealZoom = () => {
//     // Obtenemos el alto del contenedor menos el padding
//     const availableHeight = containerHeight - 64; // 2rem padding = 32px * 2
//     // Calculamos el zoom necesario para que la página quepa en la altura disponible
//     const idealZoom = (availableHeight / pageWidth) * 100;
//     return Math.min(Math.max(idealZoom, 30), 200); // Limitamos entre 30% y 200%
//   };

//   const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
//   const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 30));
//   const setSpecificZoom = (value: number) => setZoom(value);
  
//   // Recalcular zoom cuando cambian las dimensiones
//   useEffect(() => {
//     setZoom(calculateIdealZoom());
//   }, [pageWidth, containerHeight]);

//   return {
//     zoom,
//     handleZoomIn,
//     handleZoomOut,
//     setSpecificZoom
//   };
// };

import { useState, useCallback } from 'react';

export const useEditorZoom = (initialZoom = 100) => {
  const [zoom, setZoom] = useState(initialZoom);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 30));
  
  // Nuevo método para el zoom con la rueda del mouse
  const handleWheelZoom = useCallback((event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -10 : 10;
      setZoom(prev => {
        const newZoom = prev + delta;
        return Math.min(Math.max(newZoom, 30), 200); // Límites de 30% a 200%
      });
    }
  }, []);

  return {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleWheelZoom
  };
};


// import { useState } from 'react';

// export const useEditorZoom = (initialZoom = 100) => {
//   const [zoom, setZoom] = useState(initialZoom);

//   const handleZoomIn = () => {
//     setZoom(prev => Math.min(prev + 5, 200));
//   };

//   const handleZoomOut = () => {
//     setZoom(prev => Math.max(prev - 5, 30));
//   };

//   return {
//     zoom,
//     handleZoomIn,
//     handleZoomOut
//   };
// };