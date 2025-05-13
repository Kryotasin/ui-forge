"use client";
import { useState } from 'react';
import { CanvasMap } from '@/types/figma';

export default function NodeSelector() {
    const [pagesMap, setPagesMap] = useState<CanvasMap>({});
    const [loading, setLoading] = useState(false);
    const [selectedParent, setSelectedParent] = useState<string | null>(null);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);

    const fetchFigmaPages = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/figmaFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileKey: 'qyrtCkpQQ1yq1Nv3h0mbkq', // Your Figma file key
                    accessToken: 'figd_8OT0PLXhNjd9zEmvKXZZBZdYb62YOTJkhGo7pydD' // Your Figma access token
                }),
            });

            const data = await response.json();
            setPagesMap(data.pagesMap);
        } catch (error) {
            console.error('Error fetching Figma pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleParentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const parent = event.target.value;
        setSelectedParent(parent);
        setSelectedChild(null); // Reset child selection when parent changes
    };

    const handleChildChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedChild(event.target.value);
    };

    const parentOptions = Object.keys(pagesMap);
    const childOptions = selectedParent ? Object.keys(pagesMap[selectedParent]?.children || {}) : [];
    const selectedChildId = selectedParent && selectedChild ? pagesMap[selectedParent]?.children[selectedChild]?.id : null;

    return (
        <div>
            <button onClick={fetchFigmaPages} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Figma Pages'}
            </button>

            <div style={{ marginTop: '20px' }}>
                {/* Parent Dropdown */}
                <label htmlFor="parentDropdown">Parent:</label>
                <select
                    id="parentDropdown"
                    value={selectedParent || ''}
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

            {/* Display Selected Child ID */}
            {selectedChildId && (
                <div style={{ marginTop: '20px' }}>
                    <strong>Selected Child ID:</strong> {selectedChildId}
                </div>
            )}
        </div>
    );
}