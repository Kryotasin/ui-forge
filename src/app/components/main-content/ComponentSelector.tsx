'use client';
import { useState } from 'react';
import FirstDropdown from './dropdowns/FirstDropdown';
import SecondDropdown from './dropdowns/SecondDropdown';
import ThirdDropdown from './dropdowns/ThirdDropdown';

export default function ComponentSelector() {
    const [options, setOptions] = useState<Array<{ id: string; name: string }>>([]);


    return (
        <div className="container p-3">
            <div className="row g-3">
                <div className="col-md-4">
                    <FirstDropdown />
                </div>
                <div className="col-md-4">
                    <SecondDropdown
                    />
                </div>
                <div className="col-md-4">
                    <ThirdDropdown
                    />
                </div>
            </div>
        </div>
    );
}
