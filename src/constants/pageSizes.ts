
export interface PageSize {
    width: number;
    height: number;
  }
  
  // export const pageSizes: Record<string, PageSize> = {
  //   // 'A4': { width: 595.28, height: 841.89 },
  //   'A4': { width: 794, height: 1123 },
  //   'A3': { width: 1123, height: 1587 },
  //   'A5': { width: 559, height: 794 },
  //   'Carta': { width: 816, height: 1056 },
  //   'Legal': { width: 816, height: 1344 },
  //   'Poster 90x120': { width: 3401, height: 4535 },
  // };

  export const pageSizes: Record<string, PageSize> = {
    'A4': { width: 595.28, height: 841.89 }, // Puntos (595.28pt x 841.89pt)
    'A3': { width: 841.89, height: 1190.55 },
    'A5': { width: 420.94, height: 595.28 },
    'Carta': { width: 612, height: 792 },      // Tamaño "Letter" estándar
    'Legal': { width: 612, height: 1008 },
    // Poster: Convierte cm a puntos (1cm = 28.3465pt)
    'Poster 90x120': { width: 90*28.3465, height: 120*28.3465 },
  };