import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/sessions/[id]/messages
// Thay thế getChatMessagesAction server action (tránh UnrecognizedActionError)
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sessionId } = await context.params;
        const messages = await prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
        return NextResponse.json({ success: true, data: messages });
    } catch (error: any) {
        console.error('[/api/sessions/[id]/messages] Error:', error?.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
