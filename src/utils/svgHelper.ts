// utils/svgHelper.ts

/**
 * Fetches SVG content from a URL and processes it
 */
export const fetchSVGFromUrl = async (svgUrl: string): Promise<string> => {
    try {
        const response = await fetch(svgUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching SVG:', error);
        throw error;
    }
};

/**
 * Processes SVG content by applying fill color and cleaning up
 */
export const processSVG = (svgContent: string, fillColor: string = '#ffffff'): string => {
    // Remove any existing fill attributes and add our color
    let processedSVG = svgContent
        .replace(/fill="[^"]*"/g, '') // Remove existing fills
        .replace(/fill='[^']*'/g, '') // Remove existing fills (single quotes)
        .replace(/<path/g, `<path fill="${fillColor}"`) // Add fill to paths
        .replace(/<circle/g, `<circle fill="${fillColor}"`) // Add fill to circles
        .replace(/<rect/g, `<rect fill="${fillColor}"`) // Add fill to rectangles
        .replace(/<polygon/g, `<polygon fill="${fillColor}"`); // Add fill to polygons

    return processedSVG;
};

/**
 * Converts SVG content to a data URL for use in images
 */
export const svgToDataUrl = (svgContent: string): string => {
    const encoded = encodeURIComponent(svgContent);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
};

/**
 * Creates an Image object from SVG content for use with Konva
 */
export const createImageFromSVG = (svgContent: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = svgToDataUrl(svgContent);
    });
};