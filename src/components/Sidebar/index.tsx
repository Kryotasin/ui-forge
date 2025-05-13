import React from 'react';
import NodeSelector from './NodeSelector';

const Sidebar: React.FC = () => {
    return (
        <div className="bg-gray-100 p-4 h-full">
            <NodeSelector />
        </div>
    );
};

export default Sidebar;