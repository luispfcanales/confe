export interface Style {
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    textAlign: string;
    borderWidth: string;
    borderStyle: string;
    color: string;
    backgroundColor: string;
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


  // Añade estas interfaces para el tipo de datos
export interface TextBoxData {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    textAlign: string;
    color: string;
    backgroundColor:string;
    padding: string;
    margin: string;
  };
}

export interface EditorState {
  pageSize: string;
  width: number;
  height: number;
  textBoxes: TextBoxData[];
}