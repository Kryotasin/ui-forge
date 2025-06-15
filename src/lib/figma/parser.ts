import { RenderedComponentProperties } from '@/types/rendered-component';

export function parseFigmaToRenderedComponent(figmaData: any, componentId: string): RenderedComponentProperties | null {
    const node = findNodeInData(figmaData, componentId);
    if (!node) return null;

    return {
        id: node.id,
        type: inferRendererType(node),
        position: { x: 0, y: 0 },
        size: {
            width: node.absoluteBoundingBox?.width || 100,
            height: node.absoluteBoundingBox?.height || 40
        },
        style: {
            backgroundColor: extractBackgroundColor(node) || '#3B82F6',
            borderRadius: node.cornerRadius || 8,
            fontSize: extractFontSize(node) || 16,
            textColor: extractTextColor(node) || '#FFFFFF'
        },
        content: {
            text: extractText(node) || 'Button'
        }
    };
}

function inferRendererType(node: any): 'button' | 'text' | 'rectangle' {
    if (node.type === 'TEXT') return 'text';
    if (node.name?.toLowerCase().includes('button')) return 'button';
    return 'rectangle';
}

function findNodeInData(data: any, nodeId: string): any {
    // Your existing logic to find node in Figma data
    const nodes = data?.nodes || {};

    // Direct lookup
    if (nodes[nodeId]) return nodes[nodeId].document;

    // Search through all nodes
    for (const [key, nodeData] of Object.entries(nodes)) {
        const document = (nodeData as any)?.document;
        if (document?.id === nodeId) return document;

        // Search children recursively
        const found = searchInChildren(document, nodeId);
        if (found) return found;
    }

    return null;
}

function searchInChildren(node: any, targetId: string): any {
    if (!node?.children) return null;

    for (const child of node.children) {
        if (child.id === targetId) return child;
        const found = searchInChildren(child, targetId);
        if (found) return found;
    }

    return null;
}

function extractBackgroundColor(node: any): string | undefined {
    if (node.fills && node.fills.length > 0) {
        const fill = node.fills[0];
        if (fill.type === 'SOLID') {
            return figmaColorToHex(fill.color);
        }
    }
    return undefined;
}

function extractTextColor(node: any): string | undefined {
    if (node.style?.fills && node.style.fills.length > 0) {
        const fill = node.style.fills[0];
        if (fill.type === 'SOLID') {
            return figmaColorToHex(fill.color);
        }
    }
    return undefined;
}

function extractFontSize(node: any): number | undefined {
    return node.style?.fontSize;
}

function extractText(node: any): string | undefined {
    if (node.type === 'TEXT') return node.characters;

    // Search for text in children
    if (node.children) {
        for (const child of node.children) {
            if (child.type === 'TEXT') return child.characters;
        }
    }

    return undefined;
}

function figmaColorToHex(color: { r: number; g: number; b: number }): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}