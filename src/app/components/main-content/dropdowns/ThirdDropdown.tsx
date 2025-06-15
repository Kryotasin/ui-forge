'use client';
import { useState, useEffect } from 'react';
import Toast from '../../toast';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { GET_FIGMA_FILE_DATA } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import { setComponentSelection } from '@/lib/store/slices/dataSlice';

export default function ThirdDropdown() {
    const { nodeSelection, componentSelection } = useAppSelector(state => state.data);
    const dispatch = useAppDispatch();

    const [options, setOptions] = useState<{ id: string; name: string; type: string }[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    // Always fetch the data, but skip if no nodeSelection
    const { loading, error, data } = useQuery(GET_FIGMA_FILE_DATA, {
        variables: {
            fileKey: "qyrtCkpQQ1yq1Nv3h0mbkq",
            nodeId: nodeSelection
        },
        skip: !nodeSelection || nodeSelection.trim() === '',
        onError: (error) => {
            console.error('GraphQL Error:', error);
            setToast({
                message: 'Failed to load component options',
                type: 'error'
            });
        }
    });

    // Process data when both data and nodeSelection are available
    useEffect(() => {
        if (data && nodeSelection) {
            try {
                // Parse the raw JSON response
                const parsedData = data.figmaFileData;

                // Navigate to the specific node using nodeSelection
                const targetNode = parsedData?.nodes?.[nodeSelection]?.document;

                if (targetNode?.children) {
                    // Filter for components/instances only (typical for button variants)
                    const componentOptions = targetNode.children
                        .filter((child: any) =>
                            child.type === 'COMPONENT' ||
                            child.type === 'INSTANCE' ||
                            child.type === 'COMPONENT_SET'
                        )
                        .map((child: any) => ({
                            id: child.id,
                            name: child.name,
                            type: child.type
                        }));

                    setOptions(componentOptions);

                    if (componentOptions.length === 0) {
                        setToast({
                            message: 'No components found in selected node',
                            type: 'info'
                        });
                    }
                } else {
                    // Alternative: search through all nodes
                    const allNodes = parsedData?.nodes || {};
                    const matchingNode: any = Object.values(allNodes).find((node: any) =>
                        node?.document?.id === nodeSelection
                    );

                    if (matchingNode?.document?.children) {
                        const componentOptions = matchingNode.document.children
                            .filter((child: any) =>
                                child.type === 'COMPONENT' ||
                                child.type === 'INSTANCE' ||
                                child.type === 'COMPONENT_SET'
                            )
                            .map((child: any) => ({
                                id: child.id,
                                name: child.name,
                                type: child.type
                            }));

                        setOptions(componentOptions);
                    } else {
                        setOptions([]);
                        setToast({
                            message: 'No components found for selected node',
                            type: 'info'
                        });
                    }
                }
            } catch (err) {
                console.error('Error parsing component data:', err);
                setToast({
                    message: 'Error parsing component data from server',
                    type: 'error'
                });
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    }, [data, nodeSelection]);

    const handleChange = (newValue: string) => {
        dispatch(setComponentSelection(newValue));
    };

    // Show different states
    if (!nodeSelection) {
        return (
            <select className="form-select" disabled>
                <option value="">Please select from second dropdown</option>
            </select>
        );
    }

    return (
        <>
            <select
                className="form-select"
                value={componentSelection} // Use Redux state directly
                onChange={(e) => handleChange(e.target.value)}
                disabled={loading}
            >
                <option value="">
                    {loading ? 'Loading components...' : 'Select Component'}
                </option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name} ({option.type})
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