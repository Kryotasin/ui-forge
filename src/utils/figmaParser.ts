// src/utils/figmaParser.ts

import { FigmaFileResponse, CanvasMap } from '@/types/figma';

/**
 * Extract canvas (page) names and IDs from Figma file response
 * @param response The Figma API response
 * @returns An object mapping canvas names to their IDs
 */
export function extractCanvasMap(response: FigmaFileResponse): CanvasMap {
    const canvasMap: CanvasMap = {};
    let currentParent: string | null = null;

    // Extract all canvases from the document
    const canvases = response.document.children || [];

    // Map each canvas name to its ID, creating a hierarchy
    canvases.forEach(canvas => {
        if (canvas.name.includes("↳")) {
            // It's a child canvas
            const childName = canvas.name.replace("↳", "").trim();
            if (currentParent) {
                if (!canvasMap[currentParent].children) {
                    canvasMap[currentParent].children = {};
                }
                canvasMap[currentParent].children[childName] = { id: canvas.id, children: {} };
            }
        } else {
            // It's a new parent canvas
            const parentName = canvas.name.trim();
            currentParent = parentName;
            canvasMap[parentName] = { id: canvas.id, children: {} };
        }
    });

    return canvasMap;
}

/**
 * Get all buttons from the Button canvas
 * This is a placeholder example - actual implementation would require fetching
 * the specific canvas with its children using the /nodes endpoint
 */
export function findButtonComponents(response: FigmaFileResponse): string | null {
    // Find the Button canvas ID
    const buttonCanvas = response.document.children.find(canvas =>
        canvas.name.includes('Button') || canvas.name.trim() === 'Button'
    );

    return buttonCanvas ? buttonCanvas.id : null;
}

/**
 * Parses a Figma file URL to extract the file key
 */
export const extractFigmaFileKey = (url: string): string | null => {
    // Figma file URLs typically look like: https://www.figma.com/file/abcdefg123456/FileName
    const match = url.match(/figma\.com\/file\/([^/]+)/);
    return match ? match[1] : null;
};

export const pruneNodeData = (data: any) => {
    // Deep clone to avoid reference issues
    const simplified = JSON.parse(JSON.stringify(data));

    // Remove heavy properties
    Object.values(simplified.nodes || {}).forEach((node: any) => {
        if (node.document) {
            // Remove detailed vector data
            delete node.document.vectorNetwork;
            // Remove export settings
            delete node.document.exportSettings;
            // Remove style overrides
            delete node.document.styleOverrideTable;
            // Remove detailed children recursively
            if (node.document.children && node.document.children.length > 10) {
                node.document.children = node.document.children.slice(0, 10);
                node.document.childrenTruncated = true;
            }
        }
    });

    return simplified;
}