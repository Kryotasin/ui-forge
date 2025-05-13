import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { FigmaFileResponse } from '@/types/figma';
import { extractCanvasMap, findButtonComponents } from '@/utils/figmaParser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { fileKey, accessToken, depth = 1 } = req.body;

        if (!fileKey || !accessToken) {
            return res.status(400).json({
                message: 'File key and access token are required'
            });
        }

        const response = await axios.get(
            `https://api.figma.com/v1/files/${fileKey}?depth=${depth}`,
            {
                headers: {
                    'X-Figma-Token': accessToken,
                },
            }
        );

        const figmaData = response.data as FigmaFileResponse;

        // Get pages as a map (name -> id)
        const pagesMap = extractCanvasMap(figmaData);

        // Find the Button page ID if needed
        const buttonPageId = findButtonComponents(figmaData);

        return res.status(200).json({
            pagesMap,
            buttonPageId,
            fileInfo: {
                name: figmaData.name,
                lastModified: figmaData.lastModified
            }
        });
    } catch (error: any) {
        return res.status(error.response?.status || 500).json({
            message: 'Failed to process Figma file',
            error: error.response?.data || error.message
        });
    }
}