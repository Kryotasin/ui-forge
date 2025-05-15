// src/app/components/FigmaNodeViewer.tsx
import { Suspense } from 'react';
import ClientNodeControls from './ClientNodeControls';
import { fetchFigmaNode } from '@/lib/figma-server';
import { pruneNodeData } from '@/utils/figmaParser';

// This is a Server Component
export default async function FigmaNodeViewer({ nodeId }: { nodeId: string }) {
    // If no nodeId is provided, render only the client-side controls
    if (!nodeId) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <ClientNodeControls />
            </div>
        );
    }

    // Fetch and process node data on the server
    const nodeData = await fetchFigmaNode(nodeId);

    // Process/prune data on the server to reduce size
    const processedData = pruneNodeData(nodeData);

    // Save to MongoDB directly on the server
    await saveNodeToMongoDB(nodeId, processedData);

    // Render the processed node data
    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <ClientNodeControls initialNodeId={nodeId} />

            <div className="mt-4">
                <h3 className="text-lg font-medium">Node Details</h3>
                <NodeDetails data={processedData} />
            </div>
        </div>
    );
}

// Server component to render node details
function NodeDetails({ data }: { data: any }) {
    if (!data) return <p>No data available</p>;
    console.log('Node data:', data);
    return (
        <div className="mt-2">
            <div className="grid grid-cols-2 gap-4">
                {/* Render key node information */}
                <div>
                    <h4 className="font-medium">Node Properties</h4>
                    <ul className="list-disc pl-5 mt-2">
                        {data.document.name && <li>Name: {data.document.name}</li>}
                        {data.document.type && <li>Type: {data.document.type}</li>}
                        {/* Add other properties you need to render */}
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium">Dimensions</h4>
                    {data.absoluteBoundingBox && (
                        <ul className="list-disc pl-5 mt-2">
                            <li>Width: {data.absoluteBoundingBox.width}px</li>
                            <li>Height: {data.absoluteBoundingBox.height}px</li>
                        </ul>
                    )}
                </div>
            </div>

            {/* Render children summary (not the full data) */}
            {data.children && data.children.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-medium">Child Components ({data.children.length})</h4>
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {data.children.slice(0, 9).map((child: any, index: number) => (
                            <li key={index} className="p-2 bg-gray-50 rounded text-sm">
                                {child.name || `Child ${index + 1}`}
                            </li>
                        ))}
                        {data.children.length > 9 && (
                            <li className="p-2 bg-gray-50 rounded text-sm">
                                + {data.children.length - 9} more
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

// Server-side function to save node to MongoDB
async function saveNodeToMongoDB(id: string, nodeData: any) {
    // This runs on the server only
    const { MongoClient, ServerApiVersion } = require('mongodb');

    // Get MongoDB credentials from environment variables
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;

    if (!username || !password) {
        console.error('MongoDB credentials not provided');
        return null;
    }

    const uri = `mongodb+srv://${username}:${password}@cluster0.jio8mfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME || 'figma_data');
        const collection = db.collection('nodes_dev_store');

        // Check if the document already exists
        const existingDoc = await collection.findOne({ id });

        if (existingDoc) {
            // Document exists, update it
            await collection.updateOne(
                { id },
                {
                    $set: {
                        nodeData,
                        updatedAt: new Date()
                    }
                }
            );
            console.log(`Updated node ${id} in MongoDB`);
        } else {
            // Document doesn't exist, insert it
            await collection.insertOne({
                id,
                nodeData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`Saved node ${id} to MongoDB`);
        }
    } catch (error) {
        console.error('MongoDB operation failed:', error);
    } finally {
        await client.close();
    }
}