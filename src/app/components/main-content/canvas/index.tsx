import { GET_FIGMA_FILE_DATA } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import Toast from '../../toast';

interface FigmaButtonData {
    x: number;
    y: number;
    width: number;
    height: number;
    backgroundColor: string;
    cornerRadius: number;
    text: {
        content: string;
        x: number;
        y: number;
        width: number;
        height: number;
        fontSize: number;
        fontFamily: string;
        color: string;
    };
    leftIcon?: {
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
    };
    rightIcon?: {
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
    };
}

const Canvas = () => {
    const { componentSelection } = useAppSelector(state => state.data);
    const [buttonData, setButtonData] = useState<FigmaButtonData | null>(null);
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
                message: 'Failed to load component data',
                type: 'error'
            });
        }
    });
    console.log(data)
    useEffect(() => {
        if (data && componentSelection) {
            try {
                const figmaData = data.figmaFileData;
                const parsedButton = parseFigmaButton(figmaData, componentSelection);
                if (parsedButton) {
                    setButtonData(parsedButton);
                    setToast({
                        message: 'Component loaded successfully',
                        type: 'success'
                    });
                } else {
                    setToast({
                        message: 'Could not parse component data',
                        type: 'warning'
                    });
                }
            } catch (err) {
                console.error('Error parsing Figma data:', err);
                setToast({
                    message: 'Error parsing component data',
                    type: 'error'
                });
            }
        }
    }, [data, componentSelection]);

    const parseFigmaButton = (figmaData: any, nodeId: string): FigmaButtonData | null => {
        try {
            // Find the target node in the Figma data
            const targetNode = figmaData?.nodes?.[nodeId]?.document;
            if (!targetNode) return null;

            // Extract button container properties
            const buttonRect = targetNode.absoluteBoundingBox;
            const backgroundColor = extractColor(targetNode.fills?.[0]?.color) || '#1976d2';
            const cornerRadius = targetNode.cornerRadius || 4;

            // Find text content
            let textData: any = null;
            let leftIconData = null;
            let rightIconData = null;

            // Search through children to find text and icons
            const searchChildren = (node: any) => {
                if (!node.children) return;

                node.children.forEach((child: any) => {
                    if (child.type === 'TEXT') {
                        textData = {
                            content: child.characters || 'Button',
                            x: child.absoluteBoundingBox.x - buttonRect.x,
                            y: child.absoluteBoundingBox.y - buttonRect.y,
                            width: child.absoluteBoundingBox.width,
                            height: child.absoluteBoundingBox.height,
                            fontSize: child.style?.fontSize || 16,
                            fontFamily: child.style?.fontFamily || 'Arial',
                            color: extractColor(child.fills?.[0]?.color) || '#ffffff'
                        };
                    } else if (child.name?.includes('Icon') || child.type === 'INSTANCE') {
                        const iconData = {
                            x: child.absoluteBoundingBox.x - buttonRect.x,
                            y: child.absoluteBoundingBox.y - buttonRect.y,
                            width: child.absoluteBoundingBox.width,
                            height: child.absoluteBoundingBox.height,
                            color: extractColor(child.fills?.[0]?.color) || '#ffffff'
                        };

                        // Determine if it's left or right icon based on position
                        if (textData) {
                            if (iconData.x < textData.x) {
                                leftIconData = iconData;
                            } else {
                                rightIconData = iconData;
                            }
                        } else {
                            // If no text yet, assume it's left icon
                            leftIconData = iconData;
                        }
                    }

                    // Recursively search children
                    searchChildren(child);
                });
            };

            searchChildren(targetNode);

            return {
                x: 100, // Position on canvas
                y: 100,
                width: buttonRect.width,
                height: buttonRect.height,
                backgroundColor,
                cornerRadius,
                text: textData || {
                    content: 'Button',
                    x: 20,
                    y: 12,
                    width: buttonRect.width - 40,
                    height: 20,
                    fontSize: 16,
                    fontFamily: 'Arial',
                    color: '#ffffff'
                },
                leftIcon: leftIconData || undefined,
                rightIcon: rightIconData || undefined
            };
        } catch (error) {
            console.error('Error parsing button data:', error);
            return null;
        }
    };

    const extractColor = (color: any): string => {
        if (!color) return '#000000';
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const renderButton = () => {
        if (!buttonData) return null;

        return (
            <Group x={buttonData.x} y={buttonData.y}>
                {/* Button background */}
                <Rect
                    width={buttonData.width}
                    height={buttonData.height}
                    fill={buttonData.backgroundColor}
                    cornerRadius={buttonData.cornerRadius}
                    stroke="#000000"
                    strokeWidth={1}
                />

                {/* Left icon */}
                {buttonData.leftIcon && (
                    <Rect
                        x={buttonData.leftIcon.x}
                        y={buttonData.leftIcon.y}
                        width={buttonData.leftIcon.width}
                        height={buttonData.leftIcon.height}
                        fill={buttonData.leftIcon.color}
                    />
                )}

                {/* Button text */}
                <Text
                    x={buttonData.text.x}
                    y={buttonData.text.y}
                    width={buttonData.text.width}
                    height={buttonData.text.height}
                    text={buttonData.text.content}
                    fontSize={buttonData.text.fontSize}
                    fontFamily={buttonData.text.fontFamily}
                    fill={buttonData.text.color}
                    align="center"
                    verticalAlign="middle"
                />

                {/* Right icon */}
                {buttonData.rightIcon && (
                    <Rect
                        x={buttonData.rightIcon.x}
                        y={buttonData.rightIcon.y}
                        width={buttonData.rightIcon.width}
                        height={buttonData.rightIcon.height}
                        fill={buttonData.rightIcon.color}
                    />
                )}
            </Group>
        );
    };

    if (loading) {
        return <div className="p-4">Loading component...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error loading component</div>;
    }

    if (!componentSelection) {
        return (
            <div className="p-4">
                <p>Select a component to render it here</p>
                <Stage width={800} height={600}>
                    <Layer>
                        <Rect
                            x={50}
                            y={50}
                            width={700}
                            height={500}
                            fill="#f5f5f5"
                            stroke="#ddd"
                            strokeWidth={2}
                            dash={[10, 5]}
                        />
                        <Text
                            x={400}
                            y={300}
                            text="Canvas Ready"
                            fontSize={24}
                            fill="#666"
                            align="center"
                            width={200}
                            offsetX={100}
                        />
                    </Layer>
                </Stage>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h4 className="mb-3">Rendered Component: {componentSelection}</h4>

            <Stage width={800} height={600}>
                <Layer>
                    {/* Canvas background */}
                    <Rect
                        x={0}
                        y={0}
                        width={800}
                        height={600}
                        fill="#ffffff"
                        stroke="#e0e0e0"
                        strokeWidth={1}
                    />

                    {/* Render the parsed button */}
                    {renderButton()}

                    {/* Grid lines for reference */}
                    {Array.from({ length: 8 }, (_, i) => (
                        <React.Fragment key={`grid-${i}`}>
                            <Rect
                                x={i * 100}
                                y={0}
                                width={1}
                                height={600}
                                fill="#f0f0f0"
                            />
                            <Rect
                                x={0}
                                y={i * 75}
                                width={800}
                                height={1}
                                fill="#f0f0f0"
                            />
                        </React.Fragment>
                    ))}
                </Layer>
            </Stage>

            {buttonData && (
                <div className="mt-3 p-3 bg-light rounded">
                    <h6>Component Info:</h6>
                    <p><strong>Text:</strong> {buttonData.text.content}</p>
                    <p><strong>Size:</strong> {buttonData.width} × {buttonData.height}</p>
                    <p><strong>Background:</strong> {buttonData.backgroundColor}</p>
                    {buttonData.leftIcon && <p><strong>Left Icon:</strong> Present</p>}
                    {buttonData.rightIcon && <p><strong>Right Icon:</strong> Present</p>}
                </div>
            )}

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