'use client';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FIGMA_FILE_BY_KEY } from '@/lib/graphql/queries';
import Toast from '../../Toast';

interface FirstDropdownProps {
    onSelect: (value: string) => void;
}

export default function FirstDropdown({ onSelect }: FirstDropdownProps) {
    const [value, setValue] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
    const [parsedOptions, setParsedOptions] = useState<Array<{ id: string; name: string }>>([]);

    const { loading, error, data } = useQuery(GET_FIGMA_FILE_BY_KEY, {
        variables: { fileKey: "qyrtCkpQQ1yq1Nv3h0mbkq" },
        onCompleted: (data) => {
            try {
                const parsedData = data?.figmaFileByKey?.data ? data.figmaFileByKey.data : null;
                const options = parsedData.document.children.map((v: any) => ({
                    id: v.id,
                    name: v.name,
                }));
                setParsedOptions(options);
            } catch (err) {
                console.error('Error parsing data:', err);
                setToast({
                    message: 'Error parsing data from server',
                    type: 'error'
                });
            }
        }
    });

    if (loading) return <div className="p-3">Loading...</div>;

    if (error) {
        return (
            <>
                <div className="p-3">Failed to load options</div>
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

    const handleChange = (newValue: string) => {
        setValue(newValue);
        onSelect(newValue);
        if (!newValue) {
            setToast({
                message: 'Please select an option',
                type: 'warning'
            });
        }
    };

    return (
        <>
            <select
                className="form-select"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            >
                <option value="">Select Option 1</option>
                {parsedOptions.map((option) => (
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