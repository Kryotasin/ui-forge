// TypeScript equivalents of Rust types for Figma data

export interface FigmaFile {
    fileKey: string;
    message: string;
    status: string;
    data?: FigmaData;
  }
  
  export interface FigmaData {
    document?: Document;
    components?: Record<string, any>;
    componentSets?: Record<string, any>;
    styles?: Styles;
    name?: string;
    version?: string;
    role?: string;
    lastModified?: string;
    thumbnailUrl?: string;
  }
  
  export interface Document {
    id: string;
    name: string;
    type: string;  // renamed from node_type in Rust
    children?: Document[];
  }
  
  export interface Styles {
    fills?: any[];
    strokes?: any[];
    effects?: any[];
    grids?: any[];
  }
  
  // Equivalent to the MongoDB document type
  export interface FigmaFileDocument {
    fileKey: string;
    message: string;
    status: string;
    data?: Record<string, any>;
  } 