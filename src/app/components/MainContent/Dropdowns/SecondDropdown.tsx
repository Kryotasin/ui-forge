'use client';
import { useState, useEffect } from 'react';
import Toast from '../../Toast';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { GET_FIGMA_FILE_DATA } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import { setNodeSelectionDataDump, setNodeSelection } from '@/lib/store/slices/dataSlice';

export default function SecondDropdown() {
    const { pageSelection } = useAppSelector(state => state.data);
    const dispatch = useAppDispatch();

    const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
    const [value, setValue] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    // Always fetch the data, but skip if no pageSelection
    const { loading, error, data } = useQuery(GET_FIGMA_FILE_DATA, {
        variables: {
            fileKey: "qyrtCkpQQ1yq1Nv3h0mbkq"
        },
        skip: !pageSelection || pageSelection.trim() === '',
        onError: (error) => {
            console.error('GraphQL Error:', error);
            setToast({
                message: 'Failed to load options',
                type: 'error'
            });
        }
    });

    // Process data when both data and pageSelection are available
    useEffect(() => {
        if (data && pageSelection) {
            try {
                dispatch(setNodeSelectionDataDump(data));
                // Parse the raw JSON response
                const parsedData = data.figmaFileData;

                // Navigate to the specific node using pageSelection
                const targetNode = parsedData?.nodes?.[pageSelection]?.document;

                if (targetNode?.children) {
                    const childOptions = targetNode.children.map((child: any) => ({
                        id: child.id,
                        name: child.name,
                        type: child.type
                    }));
                    setOptions(childOptions);
                } else {
                    // Alternative: search through all nodes
                    const allNodes = parsedData?.nodes || {};
                    const matchingNode: any = Object.values(allNodes).find((node: any) =>
                        node?.document?.id === pageSelection
                    );

                    if (matchingNode?.document?.children) {
                        const childOptions = matchingNode.document.children.map((child: any) => ({
                            id: child.id,
                            name: child.name,
                            type: child.type
                        }));
                        setOptions(childOptions);
                    } else {
                        setOptions([]);
                        setToast({
                            message: 'No child nodes found for selected page',
                            type: 'info'
                        });
                    }
                }
            } catch (err) {
                console.error('Error parsing data:', err);
                setToast({
                    message: 'Error parsing data from server',
                    type: 'error'
                });
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    }, [data, pageSelection]);


    const handleChange = (newValue: string) => {
        dispatch(setNodeSelection(newValue));
    };

    // Show different states
    if (!pageSelection) {
        return (
            <select className="form-select" disabled>
                <option value="">Please select from first dropdown</option>
            </select>
        );
    }

    return (
        <>
            <select
                className="form-select"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                disabled={loading}
            >
                <option value="">
                    {loading ? 'Loading options...' : 'Select Option 2'}
                </option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}