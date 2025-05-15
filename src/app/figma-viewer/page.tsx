// src/app/figma-viewer/page.tsx
import { Suspense } from 'react';
import FigmaNodeViewer from '@/app/components/FigmaNodeViewer';

// Access search parameters using the searchParams prop
export default function FigmaViewerPage({
    searchParams
}: {
    searchParams: { node?: string }
}) {
    const nodeId = searchParams.node || '';

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Figma Component Viewer</h1>

            <Suspense fallback={<div className="p-12 text-center">Loading component data...</div>}>
                <FigmaNodeViewer nodeId={nodeId} />
            </Suspense>
        </div>
    );
}