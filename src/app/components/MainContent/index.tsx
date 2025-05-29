// No "use client" directive here = Server Component

import { Suspense } from "react";
import ComponentSelector from './ComponentSelector';
import ComponentRenderer from "./ComponentRenderer";

const MainContent: React.FC = () => {

    return (
        <div className="bg-gray-100 p-4 h-full">
            <Suspense fallback={<div className="p-12 text-center">Loading component data...</div>}>
                <ComponentSelector />
                Main Content
                <ComponentRenderer />
            </Suspense>
        </div>
    );
}

export default MainContent;