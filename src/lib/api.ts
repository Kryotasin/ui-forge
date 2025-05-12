// src/lib/api.ts

/**
 * Fetches a Figma file using the file key and access token
 */
export const fetchFigmaFile = async (fileKey: string, accessToken: string) => {
    try {
        const response = await fetch('/api/figma/getFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileKey, accessToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch Figma file');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Figma file:', error);
        throw error;
    }
};

/**
 * Parses a Figma file URL to extract the file key
 */
export const extractFigmaFileKey = (url: string): string | null => {
    // Figma file URLs typically look like: https://www.figma.com/file/abcdefg123456/FileName
    const match = url.match(/figma\.com\/file\/([^/]+)/);
    return match ? match[1] : null;
};