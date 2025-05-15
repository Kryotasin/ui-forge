// src/app/components/MainContent.tsx
// No "use client" directive here = Server Component

import { Suspense } from "react";
import FigmaNodeViewer from "./FigmaNodeViewer";

export default async function MainContent() {
    const nodeId = '6543:36648';

    return (
        <div className="main-content">
            <Suspense fallback={<div className="p-12 text-center">Loading component data...</div>}>
                <FigmaNodeViewer nodeId={nodeId} />
            </Suspense>
        </div>
    );
}