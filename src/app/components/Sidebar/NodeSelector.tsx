// src/components/Sidebar/NodeSelector.tsx
"use client";
import { useState } from 'react';
import { CanvasMap } from '@/types/figma';
import { pruneNodeData } from '@/utils/figmaParser';

interface SaveStatusType {
    success: boolean;
    message: string;
    data?: any;
}

export default function NodeSelector() {
    const [pagesMap, setPagesMap] = useState<CanvasMap>({});
    const [loading, setLoading] = useState(false);
    const [selectedParent, setSelectedParent] = useState<string | null>(null);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [parentOptions, setParentOptions] = useState<string[]>([]);
    const [childOptions, setChildOptions] = useState<string[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [nodeData, setNodeData] = useState<any>(null);
    const [savingData, setSavingData] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatusType | null>(null);

    // Get the base URL from environment or default to localhost
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const fetchFigmaPages = async () => {
        setLoading(true);
        setSaveStatus(null);

        try {
            const response = await fetch(`${baseUrl}/api/figmaFile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileKey: 'qyrtCkpQQ1yq1Nv3h0mbkq',
                    accessToken: process.env.NEXT_PUBLIC_FIGMA_ACCESS_TOKEN
                }),
            });

            const data = await response.json();
            setPagesMap(data.pagesMap);
            setParentOptions(Object.keys(data.pagesMap));
            setChildOptions([]);
            setSelectedChildId(null);
            setNodeData(null);
        } catch (error) {
            console.error('Error fetching Figma pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAndSaveNodeData = async () => {
        if (!selectedChildId) return;

        setLoading(true);
        setSaveStatus(null);
        setNodeData(null);

        try {
            // Step 1: Fetch node data from Figma API
            console.log(`Fetching node data for: ${selectedChildId}`);
            const nodeResponse = await fetch(`${baseUrl}/api/figmaNodes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileKey: 'qyrtCkpQQ1yq1Nv3h0mbkq',
                    accessToken: process.env.NEXT_PUBLIC_FIGMA_ACCESS_TOKEN,
                    nodeIds: [selectedChildId]
                }),
            });

            if (!nodeResponse.ok) {
                throw new Error(`Failed to fetch node data: ${nodeResponse.statusText}`);
            }

            const nodeDataResult = await nodeResponse.json();
            setNodeData(pruneNodeData(nodeDataResult.nodes));

            // Step 2: Save to MongoDB
            setSavingData(true);
            console.log('Saving node data to MongoDB...');

            const saveResponse = await fetch(`${baseUrl}/api/figmaSaveNodesData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedChildId,
                    nodeData: pruneNodeData(nodeDataResult.nodes)
                }),
            });

            const saveResult = await saveResponse.json();
            setSaveStatus(saveResult);
            console.log('Save operation completed:', saveResult);

        } catch (error) {
            console.error('Error fetching or saving node data:', error);
            setSaveStatus({
                success: false,
                message: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        } finally {
            setLoading(false);
            setSavingData(false);
        }
    };

    const handleParentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const parent = event.target.value;
        setSelectedParent(parent);
        setSelectedChild(null);
        setChildOptions(Object.keys(pagesMap[parent]?.children || {}));
        setNodeData(null);
        setSaveStatus(null);
    };

    const handleChildChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const child = event.target.value;
        setSelectedChild(child);
        setSelectedChildId(pagesMap[selectedParent!]?.children[child]?.id || null);
        setNodeData(null);
        setSaveStatus(null);
    };

    return (
        <div>
            <button
                onClick={fetchFigmaPages}
                disabled={loading || savingData}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                {loading ? 'Loading...' : 'Fetch Figma Pages'}
            </button>

            {parentOptions.length > 0 && (
                <>
                    <div className="mt-5">
                        <label htmlFor="parentDropdown" className="block mb-1">Parent:</label>
                        <select
                            id="parentDropdown"
                            value={selectedParent || ''}
                            className="w-full p-2 border rounded"
                            onChange={handleParentChange}
                        >
                            <option value="" disabled>
                                Select a parent
                            </option>
                            {parentOptions.map(parent => (
                                <option key={parent} value={parent}>
                                    {parent}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-5">
                        <label htmlFor="childDropdown" className="block mb-1">Child:</label>
                        <select
                            id="childDropdown"
                            value={selectedChild || ''}
                            className="w-full p-2 border rounded"
                            onChange={handleChildChange}
                            disabled={!selectedParent}
                        >
                            <option value="" disabled>
                                Select a child
                            </option>
                            {childOptions.map(child => (
                                <option key={child} value={child}>
                                    {child}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedChildId && (
                        <div className="mt-5">
                            <div className="p-3 bg-gray-100 rounded">
                                <strong>Selected Child ID:</strong> {selectedChildId}
                            </div>

                            <button
                                onClick={fetchAndSaveNodeData}
                                disabled={loading || savingData}
                                className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                            >
                                {loading ? 'Fetching...' : savingData ? 'Saving...' : 'Fetch & Save Node Data'}
                            </button>

                            {saveStatus && (
                                <div className={`mt-4 p-3 rounded ${saveStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <p className="font-medium">{saveStatus.success ? 'Success!' : 'Notice:'}</p>
                                    <p>{saveStatus.message}</p>
                                </div>
                            )}


                        </div>
                    )}
                </>
            )}
        </div>
    );
}