// No "use client" directive here = Server Component

import { Suspense } from "react";
import ComponentSelector from './ComponentSelector';

const MainContent: React.FC = () => {
    const nodeId = '6543:36648';

    return (
        <div className="bg-gray-100 p-4 h-full">
            <Suspense fallback={<div className="p-12 text-center">Loading component data...</div>}>
                <ComponentSelector />
                Main Content
            </Suspense>
        </div>
    );
}

export default MainContent;