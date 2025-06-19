import { GET_FIGMA_FILE_DATA } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Stage, Layer, Rect, Text, Group, Image } from 'react-konva';
import Toast from '../../Toast';

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
        componentId?: string;
        svgImage?: HTMLImageElement;
    };
    rightIcon?: {
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
        componentId?: string;
        svgImage?: HTMLImageElement;
    };
}

const Canvas = () => {
    const { componentSelection } = useAppSelector(state => state.data);
    const [buttonData, setButtonData] = useState<FigmaButtonData | null>(null);
    const [loadingIcons, setLoadingIcons] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

    // Main component query
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

    // Icon component queries (dynamic based on found componentIds)
    const [leftIconComponentId, setLeftIconComponentId] = useState<string | null>(null);
    const [rightIconComponentId, setRightIconComponentId] = useState<string | null>(null);

    const { data: leftIconData } = useQuery(GET_FIGMA_FILE_DATA, {
        variables: {
            fileKey: "qyrtCkpQQ1yq1Nv3h0mbkq",
            nodeId: leftIconComponentId
        },
        skip: !leftIconComponentId,
    });

    const { data: rightIconData } = useQuery(GET_FIGMA_FILE_DATA, {
        variables: {
            fileKey: "qyrtCkpQQ1yq1Nv3h0mbkq",
            nodeId: rightIconComponentId
        },
        skip: !rightIconComponentId,
    });

    // Parse main button component
    useEffect(() => {
        if (data && componentSelection) {
            try {
                const figmaData = data.figmaFileData;
                const parsedButton = parseFigmaButton(figmaData, componentSelection);
                if (parsedButton) {
                    setButtonData(parsedButton);

                    // Extract icon component IDs for drilling down
                    const iconIds = extractIconComponentIds(figmaData, componentSelection);
                    setLeftIconComponentId(iconIds.leftIconComponentId);
                    setRightIconComponentId(iconIds.rightIconComponentId);
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

    // Process left icon
    useEffect(() => {
        if (leftIconData && buttonData) {
            processIconData(leftIconData, 'left');
        }
    }, [leftIconData, buttonData]);

    // Process right icon
    useEffect(() => {
        if (rightIconData && buttonData) {
            processIconData(rightIconData, 'right');
        }
    }, [rightIconData, buttonData]);

    const extractIconComponentIds = (figmaData: any, nodeId: string) => {
        const targetNode = figmaData?.nodes?.[nodeId]?.document;
        let leftIconComponentId = null;
        let rightIconComponentId = null;

        const searchForIcons = (node: any) => {
            if (!node.children) return;

            node.children.forEach((child: any) => {
                if (child.type === 'INSTANCE' && child.name?.includes('Icon')) {
                    const iconType = child.componentProperties?.Type?.value;

                    if (iconType === 'ArrowLeft' || child.name.includes('Left')) {
                        leftIconComponentId = child.componentId;
                    } else if (iconType === 'ArrowRight' || child.name.includes('Right')) {
                        rightIconComponentId = child.componentId;
                    }
                }
                searchForIcons(child);
            });
        };

        searchForIcons(targetNode);
        return { leftIconComponentId, rightIconComponentId };
    };

    const processIconData = async (iconData: any, position: 'left' | 'right') => {
        try {
            setLoadingIcons(true);

            // Find vector node in icon component
            const iconNode = Object.values(iconData.figmaFileData.nodes)[0] as any;
            const vectorNode = findVectorNode(iconNode.document);

            if (vectorNode) {
                // Get SVG from Figma Images API
                const svgUrl = await getSVGFromFigmaAPI(vectorNode.id);
                if (svgUrl) {
                    // Fetch and process SVG
                    const svgContent = await fetchSVGFromUrl(svgUrl);
                    const processedSVG = processSVG(svgContent, '#ffffff'); // White color
                    const svgImage = await createImageFromSVG(processedSVG);

                    // Update button data with SVG image
                    setButtonData(prev => {
                        if (!prev) return prev;

                        const updated = { ...prev };
                        if (position === 'left' && updated.leftIcon) {
                            updated.leftIcon.svgImage = svgImage;
                        } else if (position === 'right' && updated.rightIcon) {
                            updated.rightIcon.svgImage = svgImage;
                        }
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error(`Error processing ${position} icon:`, error);
            setToast({
                message: `Failed to load ${position} icon`,
                type: 'warning'
            });
        } finally {
            setLoadingIcons(false);
        }
    };

    const findVectorNode = (node: any): any => {
        if (node.type === 'VECTOR') return node;

        if (node.children) {
            for (const child of node.children) {
                const found = findVectorNode(child);
                if (found) return found;
            }
        }
        return null;
    };

    const getSVGFromFigmaAPI = async (vectorNodeId: string): Promise<string | null> => {
        try {
            // This should call your backend API route that handles Figma Images API
            const response = await fetch(`/api/figma-svg?fileKey=qyrtCkpQQ1yq1Nv3h0mbkq&nodeIds=${vectorNodeId}`);
            const data = await response.json();
            return data.images?.[vectorNodeId] || null;
        } catch (error) {
            console.error('Error getting SVG from Figma API:', error);
            return null;
        }
    };

    const fetchSVGFromUrl = async (svgUrl: string): Promise<string> => {
        const response = await fetch(svgUrl);
        if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.status}`);
        return await response.text();
    };

    const processSVG = (svgContent: string, fillColor: string = '#ffffff'): string => {
        return svgContent
            .replace(/fill="[^"]*"/g, '')
            .replace(/fill='[^']*'/g, '')
            .replace(/<path/g, `<path fill="${fillColor}"`)
            .replace(/<circle/g, `<circle fill="${fillColor}"`)
            .replace(/<rect/g, `<rect fill="${fillColor}"`)
            .replace(/<polygon/g, `<polygon fill="${fillColor}"`);
    };

    const createImageFromSVG = (svgContent: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
            img.src = dataUrl;
        });
    };

    const parseFigmaButton = (figmaData: any, nodeId: string): FigmaButtonData | null => {
        try {
            const targetNode = figmaData?.nodes?.[nodeId]?.document;
            if (!targetNode) return null;

            const buttonRect = targetNode.absoluteBoundingBox;
            const backgroundColor = extractColor(targetNode.fills?.[0]?.color) || '#1976d2';
            const cornerRadius = targetNode.cornerRadius || 4;

            let textData: any = null;
            let leftIconData = null;
            let rightIconData = null;

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
                            color: extractColor(child.fills?.[0]?.color) || '#ffffff',
                            componentId: child.componentId
                        };

                        if (textData) {
                            if (iconData.x < textData.x) {
                                leftIconData = iconData;
                            } else {
                                rightIconData = iconData;
                            }
                        } else {
                            leftIconData = iconData;
                        }
                    }
                    searchChildren(child);
                });
            };

            searchChildren(targetNode);

            return {
                x: 100,
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
                    buttonData.leftIcon.svgImage ? (
                        <Image
                            x={buttonData.leftIcon.x}
                            y={buttonData.leftIcon.y}
                            width={buttonData.leftIcon.width}
                            height={buttonData.leftIcon.height}
                            image={buttonData.leftIcon.svgImage}
                        />
                    ) : (
                        <Rect
                            x={buttonData.leftIcon.x}
                            y={buttonData.leftIcon.y}
                            width={buttonData.leftIcon.width}
                            height={buttonData.leftIcon.height}
                            fill="#cccccc"
                            stroke="#999999"
                            strokeWidth={1}
                        />
                    )
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
                    buttonData.rightIcon.svgImage ? (
                        <Image
                            x={buttonData.rightIcon.x}
                            y={buttonData.rightIcon.y}
                            width={buttonData.rightIcon.width}
                            height={buttonData.rightIcon.height}
                            image={buttonData.rightIcon.svgImage}
                        />
                    ) : (
                        <Rect
                            x={buttonData.rightIcon.x}
                            y={buttonData.rightIcon.y}
                            width={buttonData.rightIcon.width}
                            height={buttonData.rightIcon.height}
                            fill="#cccccc"
                            stroke="#999999"
                            strokeWidth={1}
                        />
                    )
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
            <h4 className="mb-3">
                Rendered Component: {componentSelection}
                {loadingIcons && <span className="text-primary"> (Loading icons...)</span>}
            </h4>

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
                    {buttonData.leftIcon && (
                        <p><strong>Left Icon:</strong> {buttonData.leftIcon.svgImage ? '✅ Loaded' : '⏳ Loading...'}</p>
                    )}
                    {buttonData.rightIcon && (
                        <p><strong>Right Icon:</strong> {buttonData.rightIcon.svgImage ? '✅ Loaded' : '⏳ Loading...'}</p>
                    )}
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