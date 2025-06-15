export interface RenderedComponentProperties {
    id: string;
    type: 'button' | 'text' | 'rectangle';
    position: { x: number; y: number };
    size: { width: number; height: number };
    style: {
        backgroundColor?: string;
        borderRadius?: number;
        fontSize?: number;
        textColor?: string;
    };
    content?: {
        text?: string;
    };
}

export interface CanvasRenderer {
    zoom: number;
    pan: { x: number; y: number };
    selectedRenderer: string | null;
    renderedComponents: RenderedComponentProperties[];
}