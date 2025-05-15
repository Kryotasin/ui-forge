// src/lib/figma-server.ts
// Server-side utilities for Figma data processing

// Fetch Figma node data
export async function fetchFigmaNode(nodeId: string) {
    try {
        // Get Figma access token from environment
        const accessToken = process.env.NEXT_PUBLIC_FIGMA_ACCESS_TOKEN;
        const fileKey = 'qyrtCkpQQ1yq1Nv3h0mbkq'; // Your Figma file key

        // Fetch data from Figma API directly on the server
        const response = await fetch(
            `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`,
            {
                headers: {
                    'X-Figma-Token': accessToken as string,
                },
            }
        );
        console.log(`Fetching node data for: ${nodeId}`, accessToken);
        if (!response.ok) {
            throw new Error(`Figma API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.nodes[nodeId];
    } catch (error) {
        console.error('Error fetching Figma node:', error);
        return null;
    }
}
