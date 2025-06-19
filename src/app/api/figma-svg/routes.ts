// app/api/figma-svg/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('fileKey');
    const nodeIds = searchParams.get('nodeIds');

    if (!fileKey || !nodeIds) {
        return NextResponse.json(
            { error: 'Missing fileKey or nodeIds parameters' },
            { status: 400 }
        );
    }

    if (!process.env.FIGMA_TOKEN) {
        return NextResponse.json(
            { error: 'Figma token not configured' },
            { status: 500 }
        );
    }

    try {
        const figmaUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeIds)}&format=svg`;

        const response = await fetch(figmaUrl, {
            headers: {
                'X-Figma-Token': process.env.FIGMA_TOKEN,
            },
        });

        if (!response.ok) {
            throw new Error(`Figma API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.err) {
            return NextResponse.json(
                { error: data.err },
                { status: 400 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching SVG from Figma:', error);
        return NextResponse.json(
            { error: 'Failed to fetch SVG from Figma' },
            { status: 500 }
        );
    }
}