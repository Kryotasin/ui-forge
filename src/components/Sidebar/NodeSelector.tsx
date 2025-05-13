"use client";
import { useState } from 'react';
import { CanvasMap } from '@/types/figma';

export default function NodeSelector() {
    const [pagesMap, setPagesMap] = useState<CanvasMap>({});
    const [loading, setLoading] = useState(false);
    const [selectedParent, setSelectedParent] = useState<string | null>(null);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [parentOptions, setParentOptions] = useState<string[]>([]);
    const [childOptions, setChildOptions] = useState<string[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [nodeData, setNodeData] = useState<any>(null);

    const fetchFigmaPages = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/figmaFile', {
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
        } catch (error) {
            console.error('Error fetching Figma pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFigmaNodes = async () => {
        if (!selectedChildId) return;

        setLoading(true);
        try {
            const response = await fetch('/api/figmaNodes', {
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

            const data = await response.json();
            setNodeData(data.nodes);
        } catch (error) {
            console.error('Error fetching Figma nodes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleParentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const parent = event.target.value;
        setSelectedParent(parent);
        setSelectedChild(null);
        setChildOptions(Object.keys(pagesMap[parent]?.children || {}));
    };

    const handleChildChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const child = event.target.value;
        setSelectedChild(child);
        setSelectedChildId(pagesMap[selectedParent!]?.children[child]?.id || null);
    };

    return (
        <div>
            <button onClick={fetchFigmaPages} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Figma Pages'}
            </button>

            {parentOptions.length > 0 && (
                <>
                    <div style={{ marginTop: '20px' }}>
                        <label htmlFor="parentDropdown">Parent:</label>
                        <select
                            id="parentDropdown"
                            value={selectedParent || ''}
                            className='w-100'
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

                    <div style={{ marginTop: '20px' }}>
                        {/* Child Dropdown */}
                        <label htmlFor="childDropdown">Child:</label>
                        <select
                            id="childDropdown"
                            value={selectedChild || ''}
                            className='w-100'
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
                        <div style={{ marginTop: '20px' }}>
                            <strong>Selected Child ID:</strong> {selectedChildId}
                            <button
                                onClick={fetchFigmaNodes}
                                disabled={loading}
                                className="ml-2"
                            >
                                {loading ? 'Loading...' : 'Fetch Node Data'}
                            </button>
                            {nodeData && (
                                <pre style={{ marginTop: '10px' }}>
                                    {JSON.stringify(nodeData, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </>
            )}


        </div>
    );
}