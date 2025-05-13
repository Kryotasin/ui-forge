import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Set to a higher value if needed
        },
        responseLimit: false, // Disable response size limit
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { fileKey, accessToken, depth = 1 } = req.body; // Default depth to 1

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

        return res.status(200).json(response.data);
    } catch (error: any) {
        return res.status(error.response?.status || 500).json({
            message: 'Failed to fetch Figma file',
            error: error.response?.data || error.message
        });
    }
}