"use client";
// src/app/components/ClientNodeControls.tsx
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClientNodeControls({ initialNodeId = '' }: { initialNodeId?: string }) {
    const [pagesMap, setPagesMap] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [selectedParent, setSelectedParent] = useState<string | null>(null);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [parentOptions, setParentOptions] = useState<string[]>([]);
    const [childOptions, setChildOptions] = useState<string[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(initialNodeId || null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch pages structure only (not full node data)
    const fetchFigmaPages = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/figmaStructure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileKey: 'qyrtCkpQQ1yq1Nv3h0mbkq',
                }),
            });

            const data = await response.json();
            setPagesMap(data.pagesMap);
            setParentOptions(Object.keys(data.pagesMap));
            setChildOptions([]);
            if (!initialNodeId) {
                setSelectedChildId(null);
            }
        } catch (error) {
            console.error('Error fetching Figma pages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Effect to load pages on component mount
    useEffect(() => {
        fetchFigmaPages();
    }, []);

    // Handle parent selection change
    const handleParentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const parent = event.target.value;
        setSelectedParent(parent);
        setSelectedChild(null);
        setChildOptions(Object.keys(pagesMap[parent]?.children || {}));

        // Clear node ID if we're changing parent
        if (!initialNodeId) {
            setSelectedChildId(null);

            // Update URL to remove node parameter
            router.push('/figma-viewer');
        }
    };

    // Handle child selection change
    const handleChildChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const child = event.target.value;
        setSelectedChild(child);
        const nodeId = pagesMap[selectedParent!]?.children[child]?.id || null;
        setSelectedChildId(nodeId);

        // Update URL with selected node
        if (nodeId) {
            router.push(`/figma-viewer?node=${nodeId}`);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <button
                    onClick={fetchFigmaPages}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? 'Loading...' : 'Refresh Page Structure'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="parentDropdown" className="block mb-1">
                        Parent Component/Page
                    </label>
                    <select
                        id="parentDropdown"
                        value={selectedParent || ''}
                        className="w-full p-2 border rounded"
                        onChange={handleParentChange}
                    >
                        <option value="" disabled>Select a parent</option>
                        {parentOptions.map(parent => (
                            <option key={parent} value={parent}>{parent}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="childDropdown" className="block mb-1">
                        Child Component
                    </label>
                    <select
                        id="childDropdown"
                        value={selectedChild || ''}
                        className="w-full p-2 border rounded"
                        onChange={handleChildChange}
                        disabled={!selectedParent}
                    >
                        <option value="" disabled>
                            {!selectedParent ? 'Select a parent first' : 'Select a child'}
                        </option>
                        {childOptions.map(child => (
                            <option key={child} value={child}>{child}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedChildId && (
                <div className="p-3 bg-gray-100 rounded">
                    <strong>Selected Node ID:</strong> {selectedChildId}
                </div>
            )}
        </div>
    );
}