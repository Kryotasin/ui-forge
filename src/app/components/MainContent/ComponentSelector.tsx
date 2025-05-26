'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import Toast from '../Toast';
import { API_CONFIG, getApiUrl } from '@/lib/config';

export default function ComponentSelector() {
    const [dropdown1, setDropdown1] = useState('');
    const [dropdown2, setDropdown2] = useState('');
    const [dropdown3, setDropdown3] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    // Fetch data for each dropdown using the base URL
    const { data: options1, error: error1 } = useSWR(getApiUrl(API_CONFIG.ENDPOINTS.OPTIONS1), fetcher);
    const { data: options2, error: error2 } = useSWR(getApiUrl(API_CONFIG.ENDPOINTS.OPTIONS2), fetcher);
    const { data: options3, error: error3 } = useSWR(getApiUrl(API_CONFIG.ENDPOINTS.OPTIONS3), fetcher);

    // Handle errors with toast
    if (error1 || error2 || error3) {
        if (!toast) {
            setToast({
                message: 'Failed to load options. Please try again.',
                type: 'error'
            });
        }
        return (
            <>
                <div>Failed to load options</div>
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

    if (!options1 || !options2 || !options3) return <div>Loading...</div>;

    const handleDropdownChange = (value: string, dropdownNumber: number) => {
        if (!value) {
            setToast({
                message: `Please select an option for dropdown ${dropdownNumber}`,
                type: 'warning'
            });
            return;
        }

        switch (dropdownNumber) {
            case 1:
                setDropdown1(value);
                break;
            case 2:
                setDropdown2(value);
                break;
            case 3:
                setDropdown3(value);
                break;
        }
    };

    return (
        <>
            <div className="container p-3">
                <div className="row g-3">
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={dropdown1}
                            onChange={(e) => handleDropdownChange(e.target.value, 1)}
                        >
                            <option value="">Select Option 1</option>
                            {options1.map((option: any) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={dropdown2}
                            onChange={(e) => handleDropdownChange(e.target.value, 2)}
                        >
                            <option value="">Select Option 2</option>
                            {options2.map((option: any) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={dropdown3}
                            onChange={(e) => handleDropdownChange(e.target.value, 3)}
                        >
                            <option value="">Select Option 3</option>
                            {options3.map((option: any) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
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
