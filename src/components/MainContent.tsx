import React from 'react';

const MainContent: React.FC = () => {
    return (
        <div className="bg-white p-4 h-full">
            <h2 className="text-xl font-bold mb-4">Main Content</h2>
            <p>
                This is the main content area. This takes up 60% of the width, while
                the sidebar and right navigation each take up 20%.
            </p>
        </div>
    );
};

export default MainContent;