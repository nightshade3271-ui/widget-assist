import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const widget = await db.widget.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            companyName: true,
            welcomeMessage: true,
            primaryColor: true,
            secondaryColor: true,
            avatarUrl: true,
            bannerUrl: true,
            enableLeadCollection: true,
            leadFormMessage: true,
            leadKeywords: true,
            leadMessageThreshold: true,
        }
    })

    if (!widget) {
        return new NextResponse('Widget not found', { status: 404 })
    }

    return NextResponse.json(widget)
}
