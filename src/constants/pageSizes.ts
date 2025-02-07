
export interface PageSize {
    width: number;
    height: number;
  }
  
  export const pageSizes: Record<string, PageSize> = {
    'A4': { width: 794, height: 1123 },
    'A3': { width: 1123, height: 1587 },
    'A5': { width: 559, height: 794 },
    'Carta': { width: 816, height: 1056 },
    'Legal': { width: 816, height: 1344 },
    'Poster 90x120': { width: 3401, height: 4535 },
  };