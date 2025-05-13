// src/lib/mongodb-operations.ts
// This is an optional utility file to centralize MongoDB operations
// You can use this for more complex database interactions beyond your API route

import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { FigmaNodeData } from '@/types/figma';

// Get the database name from environment variables or use default
const getDbName = () => process.env.MONGODB_DB_NAME || 'figma_data';

// Initialize the database connection
async function initConnection() {
    try {
        const client = await clientPromise;
        console.log("Successfully connected to MongoDB");
        return client.db(getDbName());
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

// Save node data to MongoDB
export async function saveNodeData(id: string, nodeData: any): Promise<{ success: boolean; message: string; data?: any }> {
    try {
        const db = await initConnection();
        const collection = db.collection('nodes_dev_store');

        // Check if document with this id already exists
        const existingDocument = await collection.findOne({ id });

        if (existingDocument) {
            return {
                success: false,
                message: 'This node data already exists in the database.',
            };
        }

        // Insert new document
        const result = await collection.insertOne({
            id,
            nodeData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            success: true,
            message: 'Node data successfully saved.',
            data: {
                id: result.insertedId,
            },
        };
    } catch (error) {
        console.error('Error in saveNodeData:', error);
        throw error;
    }
}

// Get node data by id
export async function getNodeDataById(id: string): Promise<FigmaNodeData | null> {
    try {
        const db = await initConnection();
        const collection = db.collection('nodes_dev_store');

        const nodeData = await collection.findOne({ id });
        return nodeData as FigmaNodeData | null;
    } catch (error) {
        console.error('Error in getNodeDataById:', error);
        throw error;
    }
}

// Update existing node data
export async function updateNodeData(id: string, nodeData: any): Promise<{ success: boolean; message: string }> {
    try {
        const db = await initConnection();
        const collection = db.collection('nodes_dev_store');

        const result = await collection.updateOne(
            { id },
            {
                $set: {
                    nodeData,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return {
                success: false,
                message: 'No node data found with this id.',
            };
        }

        return {
            success: true,
            message: 'Node data successfully updated.',
        };
    } catch (error) {
        console.error('Error in updateNodeData:', error);
        throw error;
    }
}