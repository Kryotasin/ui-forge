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
        const { fileKey, accessToken, getComponents = false } = req.body;

        if (!fileKey || !accessToken) {
            return res.status(400).json({
                message: 'File key and access token are required'
            });
        }

        // If getComponents is true, fetch all components in the file
        if (getComponents) {
            const componentsResponse = await axios.get(
                `https://api.figma.com/v1/files/${fileKey}/components`,
                {
                    headers: {
                        'X-Figma-Token': accessToken
                    }
                }
            );

            return res.status(200).json({
                message: 'Successfully retrieved file components',
                components: componentsResponse.data
            });
        }

        // Default: get file metadata
        const metadataResponse = await axios.get(
            `https://api.figma.com/v1/files/${fileKey}/metadata`,
            {
                headers: {
                    'X-Figma-Token': accessToken
                }
            }
        );

        return res.status(200).json({
            message: 'Successfully retrieved file metadata',
            metadata: metadataResponse.data
        });
    } catch (error: any) {
        console.error('Error fetching Figma data:', error);

        return res.status(error.response?.status || 500).json({
            message: 'Failed to fetch Figma data',
            error: error.response?.data || error.message
        });
    }
}