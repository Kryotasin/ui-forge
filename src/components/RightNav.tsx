import React from 'react';

const RightNav: React.FC = () => {
    return (
        <div className="bg-gray-100 p-4 h-full">
            <h2 className="font-bold mb-4">Right Navigation</h2>
            <div>
                <p className="mb-2">Recent Posts</p>
                <p className="mb-2">Categories</p>
                <p className="mb-2">Archives</p>
            </div>
        </div>
    );
};

export default RightNav;