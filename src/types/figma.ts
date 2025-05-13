// src/types/figma.ts

// Main response type from Figma API
export interface FigmaFileResponse {
    document: FigmaDocument;
    components: Record<string, any>; // Empty in your case
    componentSets: Record<string, any>; // Empty in your case
    schemaVersion: number;
    styles: Record<string, any>; // Empty in your case
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
    role: string;
    editorType: string;
    linkAccess: string;
}

// Document structure
export interface FigmaDocument {
    id: string;
    name: string;
    type: string;
    scrollBehavior: string;
    children: FigmaCanvas[];
}

// Canvas (page) structure
export interface FigmaCanvas {
    id: string;
    name: string;
    type: string;
    scrollBehavior: string;
    children: any[]; // In your JSON these are empty arrays
    backgroundColor: FigmaColor;
    prototypeStartNodeID: string | null;
    flowStartingPoints: any[];
    prototypeDevice: FigmaPrototypeDevice;
    prototypeBackgrounds?: FigmaColor[]; // Optional since not all canvases have this
}

// Color structure
export interface FigmaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

// Prototype device structure
export interface FigmaPrototypeDevice {
    type: string;
    rotation: string;
    size?: {
        width: number;
        height: number;
    };
    presetIdentifier?: string;
}

// The name-ID mapping type
export interface CanvasMap {
    [key: string]: {
        id: string;
        children: CanvasMap;
    };
}

// src/lib/types/figma.ts
// Types for Figma data structure - helps with strongly typing your MongoDB data

export interface FigmaNode {
    id: string;
    name: string;
    type: string;
    [key: string]: any; // For other properties that vary by node type
}

export interface FigmaNodeData {
    id: string;           // Unique identifier for this node data entry
    nodeData: {
        document?: FigmaNode;
        nodes?: Record<string, { document: FigmaNode }>;
        components?: Record<string, any>;
        styles?: Record<string, any>;
        [key: string]: any; // Other top-level properties from Figma API
    };
    createdAt: Date;
    updatedAt: Date;
}