import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: {
        title: {
          startsWith: 'CĐ:'
        }
      }
    });

    let count = 0;
    for (const session of sessions) {
      const newTitle = session.title.replace(/^CĐ:\s*/, '').trim();
      await prisma.chatSession.update({
        where: { id: session.id },
        data: {
          title: newTitle,
          type: 'script'
        }
      });
      count++;
    }
    
    const extraSessions = await prisma.chatSession.findMany({
      where: {
        title: {
          startsWith: '[Thủ công]'
        },
        type: 'chat'
      }
    });
    
    for (const session of extraSessions) {
      await prisma.chatSession.update({
        where: { id: session.id },
        data: {
          type: 'script'
        }
      });
      count++;
    }

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
