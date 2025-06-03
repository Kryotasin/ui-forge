'use client';
import { useState } from 'react';
import Toast from '../../Toast';
import { useAppSelector } from '@/lib/store/hooks';

export default function ThirdDropdown() {
    const { nodeSelectionDataDump } = useAppSelector(state => state.data);

    const [value, setValue] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    const handleChange = (newValue: string) => {
        setValue(newValue);
        // onSelect(newValue);
        if (!newValue) {
            setToast({
                message: 'Please select an option',
                type: 'warning'
            });
        }
    };
    console.log(nodeSelectionDataDump)
    return (
        <>
            <select
                className="form-select"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            >
                <option value="">Select Option 3</option>
                {/* {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))} */}
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