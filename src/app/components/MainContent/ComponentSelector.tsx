'use client';
import { useState } from 'react';
import FirstDropdown from './Dropdowns/FirstDropdown';
import SecondDropdown from './Dropdowns/SecondDropdown';
import ThirdDropdown from './Dropdowns/ThirdDropdown';

export default function ComponentSelector() {
    const [dropdown1Value, setDropdown1Value] = useState('');
    const [dropdown2Value, setDropdown2Value] = useState('');
    const [dropdown3Value, setDropdown3Value] = useState('');
    const [options, setOptions] = useState<Array<{ id: string; name: string }>>([]);

    const handleFirstDropdownSelect = (value: string) => {
        setDropdown1Value(value);
    };

    const handleSecondDropdownSelect = (value: string) => {
        setDropdown2Value(value);
    };

    const handleThirdDropdownSelect = (value: string) => {
        setDropdown3Value(value);
    };

    return (
        <div className="container p-3">
            <div className="row g-3">
                <div className="col-md-4">
                    <FirstDropdown onSelect={handleFirstDropdownSelect} />
                </div>
                <div className="col-md-4">
                    <SecondDropdown
                        options={options}
                        onSelect={handleSecondDropdownSelect}
                    />
                </div>
                <div className="col-md-4">
                    <ThirdDropdown
                        options={options}
                        onSelect={handleThirdDropdownSelect}
                    />
                </div>
            </div>
        </div>
    );
}
