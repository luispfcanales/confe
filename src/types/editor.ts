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
  
  export interface TextBox {
    id: string;
    content: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    style: Style;
  }

  export interface PageSize {
    width: number;
    height: number;
  }