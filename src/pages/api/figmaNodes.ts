import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
        responseLimit: '8mb',
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { fileKey, accessToken, nodeIds } = req.body;

        if (!fileKey || !accessToken || !nodeIds) {
            return res.status(400).json({
                message: 'File key, access token, and node IDs are required',
            });
        }

        if (!Array.isArray(nodeIds)) {
            return res.status(400).json({
                message: 'Node IDs must be an array',
            });
        }

        // Fetch specific nodes from the Figma file
        const nodesResponse = await axios.get(
            `https://api.figma.com/v1/files/${fileKey}/nodes`,
            {
                headers: {
                    'X-Figma-Token': accessToken,
                },
                params: {
                    ids: nodeIds.join(','), // Join node IDs into a comma-separated string
                },
            }
        );

        return res.status(200).json({
            message: 'Successfully retrieved nodes',
            nodes: nodesResponse.data,
        });
    } catch (error: any) {
        console.error('Error fetching Figma nodes:', error);

        return res.status(error.response?.status || 500).json({
            message: 'Failed to fetch Figma nodes',
            error: error.response?.data || error.message,
        });
    }
}