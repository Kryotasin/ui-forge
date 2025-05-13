// src/pages/api/figmaSaveNodesData.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

type ResponseData = {
    success: boolean;
    message: string;
    data?: any;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed. Please use POST.',
        });
    }

    try {
        // Get data from the request body
        const { id, nodeData } = req.body;

        // Validate required fields
        if (!id || !nodeData) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: id and nodeData are required.',
            });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME || 'figma_data');
        console.log(`Connected to database: ${process.env.MONGODB_DB_NAME || 'figma_data'}`);

        const collection = db.collection('nodes_dev_store');

        // Check if document with this id already exists
        const existingDocument = await collection.findOne({ id });

        if (existingDocument) {
            return res.status(200).json({
                success: false,
                message: 'This node data is already saved in our database. If you need to update it, please use the update endpoint.',
            });
        }

        // Insert new document
        const result = await collection.insertOne({
            id,
            nodeData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: 'Node data successfully saved to database.',
            data: {
                id: result.insertedId,
            },
        });
    } catch (error: any) {
        console.error('Error saving node data:', error);

        return res.status(500).json({
            success: false,
            message: `An error occurred while saving the node data: ${error.message}`,
        });
    }
}