import { GET_FIGMA_FILE_DATA } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Stage, Layer, Rect } from 'react-konva';
import Toast from '../../toast';

const Canvas = () => {
    const { componentSelection } = useAppSelector(state => state.data);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    const { loading, error, data } = useQuery(GET_FIGMA_FILE_DATA, {
        variables: {
            fileKey: "qyrtCkpQQ1yq1Nv3h0mbkq",
            nodeId: componentSelection
        },
        skip: !componentSelection || componentSelection.trim() === '',
        onError: (error) => {
            console.error('GraphQL Error:', error);
            setToast({
                message: 'Failed to load component options',
                type: 'error'
            });
        }
    });

    useEffect(() => {
        if (data && componentSelection) {

            console.log(data);
        }
    }, [data, componentSelection])

    if (loading) {
        return (<>Loading...</>)
    }

    if (error) {
        return (<>error...</>)
    }

    return (
        <div>

            <Stage width={800} height={600}>
                <Layer>
                    {/* Static Rectangle */}
                    <Rect
                        x={100}
                        y={100}
                        width={200}
                        height={150}
                        fill="blue"
                        stroke="black"
                        strokeWidth={2}
                    />

                    {/* Additional rectangle for demonstration */}
                    <Rect
                        x={350}
                        y={200}
                        width={150}
                        height={100}
                        fill="red"
                        stroke="darkred"
                        strokeWidth={3}
                        cornerRadius={10}
                    />
                </Layer>
            </Stage>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Canvas;