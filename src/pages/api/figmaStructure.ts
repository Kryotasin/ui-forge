// src/pages/api/figmaStructure.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { fileKey } = req.body;

        if (!fileKey) {
            return res.status(400).json({
                message: 'File key is required',
            });
        }

        // Get only the file structure - much lighter than full node data
        const response = await axios.get(`https://api.figma.com/v1/files/${fileKey}`, {
            headers: {
                'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN as string,
            },
        });

        // Process the response to create a lightweight page map
        const document = response.data.document;
        const pagesMap: Record<string, any> = {};

        // Process only top-level pages (canvases) and their immediate children
        if (document && document.children) {
            document.children.forEach((page: any) => {
                const children: Record<string, any> = {};

                // Include only basic info about children
                if (page.children) {
                    page.children.forEach((child: any) => {
                        children[child.name] = {
                            id: child.id,
                            type: child.type
                        };
                    });
                }

                pagesMap[page.name] = {
                    id: page.id,
                    type: page.type,
                    children
                };
            });
        }

        return res.status(200).json({
            pagesMap
        });
    } catch (error: any) {
        console.error('Error fetching Figma structure:', error);

        return res.status(error.response?.status || 500).json({
            message: 'Failed to fetch Figma structure',
            error: error.response?.data || error.message,
        });
    }
}