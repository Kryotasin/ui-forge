import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="bg-gray-100 p-4 h-full">
            <h2 className="font-bold mb-4">Sidebar</h2>
            <ul>
                <li className="mb-2">Menu Item 1</li>
                <li className="mb-2">Menu Item 2</li>
                <li className="mb-2">Menu Item 3</li>
                <li className="mb-2">Menu Item 4</li>
            </ul>
        </div>
    );
};

export default Sidebar;