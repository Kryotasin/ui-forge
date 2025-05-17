// src/app/components/FigmaNodeViewer.tsx
import { Suspense } from 'react';
// import ClientNodeControls from './ClientNodeControls';
import { pruneNodeData } from '@/utils/figmaParser';

// This is a Server Component
export default async function FigmaNodeViewer({ nodeId }: { nodeId: string }) {
    // If no nodeId is provided, render only the client-side controls
    if (!nodeId) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                {/* <ClientNodeControls /> */}
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            {/* <ClientNodeControls initialNodeId={nodeId} /> */}

            <div className="mt-4">
                <h3 className="text-lg font-medium">Node Details</h3>
                {/* <NodeDetails data={processedData} /> */}
                no node details
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