'use client';
import { useState } from 'react';
import Toast from '../../Toast';

interface ThirdDropdownProps {
    options: Array<{ id: string; name: string }>;
    onSelect: (value: string) => void;
}

export default function ThirdDropdown({ options, onSelect }: ThirdDropdownProps) {
    const [value, setValue] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

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
                <option value="">Select Option 3</option>
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