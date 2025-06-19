'use client';

import { useAppSelector } from "@/lib/store/hooks";
import Canvas from "./canvas";

export default function ComponentRenderer() {
    const { pageSelection, nodeSelection, componentSelection } = useAppSelector(state => state.data);

    return (
        <div className="p-4 bg-gray-100">
            <h3>Current Values:</h3>
            <p>String 1: {pageSelection}</p>
            <p>String 2: {nodeSelection}</p>
            <p>String 3: {componentSelection}</p>

            <Canvas />
        </div>
    );
}
