"use server";

import prisma from "@/lib/prisma";
import { MessageRole } from "@prisma/client";

// 1. Tạo một phiên chat mới
export async function createChatSessionAction(userId?: string, title: string = "Hội thoại mới", type: string = "chat", createdAt?: Date) {
  try {
    const session = await prisma.chatSession.create({
      data: {
        userId: userId || null,
        title: title,
        type: type,
        ...(createdAt ? { createdAt, updatedAt: createdAt } : {}),
      },
    });
    return { success: true, data: session };
  } catch (error: any) {
    console.error("Error creating chat session:", error);
    return { success: false, error: error.message };
  }
}

// 2. Lưu tin nhắn chat vào DB
export async function saveChatMessageAction(
  sessionId: string,
  role: "USER" | "ASSISTANT" | "SYSTEM",
  content: string,
  audioUrl?: string | null,
  voiceStyleId?: number | null,
  messageId?: string,
  emotion?: string | null
) {
  try {
    let prismaRole: MessageRole;
    if (role === "USER") prismaRole = MessageRole.USER;
    else if (role === "ASSISTANT") prismaRole = MessageRole.ASSISTANT;
    else prismaRole = MessageRole.SYSTEM;

    // Sử dụng upsert để tạo mới hoặc cập nhật audioUrl/emotion nếu tin nhắn đã tồn tại
    const message = await prisma.chatMessage.upsert({
      where: { id: messageId || "" },
      update: {
        audioUrl: audioUrl || null,
        emotion: emotion || null,
      },
      create: {
        id: messageId || undefined,
        sessionId: sessionId,
        role: prismaRole,
        content: content,
        audioUrl: audioUrl || null,
        voiceStyleId: voiceStyleId || null,
        emotion: emotion || "calm",
      },
    });

    // Cập nhật lại thời gian hoạt động của ChatSession
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return { success: true, data: message };
  } catch (error: any) {
    console.error("Error saving chat message:", error);
    return { success: false, error: error.message };
  }
}

// 3. Lấy toàn bộ danh sách phiên chat (Chat Sessions)
export async function getChatSessionsAction(userId?: string) {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: userId ? { userId: userId } : {},
      orderBy: { updatedAt: "desc" }, // Sắp xếp theo thứ tự hoạt động mới nhất
    });
    return { success: true, data: sessions };
  } catch (error: any) {
    console.error("Error getting chat sessions:", error);
    return { success: false, error: error.message };
  }
}

// 4. Lấy tất cả tin nhắn của một phiên chat
export async function getChatMessagesAction(sessionId: string) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: sessionId },
      orderBy: { createdAt: "asc" }, // Sắp xếp theo trình tự thời gian
    });
    return { success: true, data: messages };
  } catch (error: any) {
    console.error("Error getting chat messages:", error);
    return { success: false, error: error.message };
  }
}

// 5. Xóa một phiên chat
export async function deleteChatSessionAction(sessionId: string) {
  try {
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting chat session:", error);
    return { success: false, error: error.message };
  }
}

// 6b. Cập nhật nội dung 1 tin nhắn (khi user edit inline)
export async function updateChatMessageContentAction(messageId: string, content: string) {
  try {
    const msg = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { content },
    });
    return { success: true, data: msg };
  } catch (error: any) {
    console.error("Error updating chat message content:", error);
    return { success: false, error: error.message };
  }
}

// 6. Cập nhật tiêu đề phiên chat
export async function updateChatSessionTitleAction(sessionId: string, title: string, updatedAt?: Date) {
  try {
    const session = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        title: title,
        ...(updatedAt ? { updatedAt } : {})
      },
    });
    return { success: true, data: session };
  } catch (error: any) {
    console.error("Error updating chat session title:", error);
    return { success: false, error: error.message };
  }
}

// 7. Cập nhật thiết lập giọng nói của phiên chat
export async function updateChatSessionVoicesAction(sessionId: string, laoVoice?: string, laoVoiceStyle?: string, userVoice?: string, userVoiceStyle?: string) {
  try {
    const session = await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        laoVoice,
        laoVoiceStyle,
        userVoice,
        userVoiceStyle
      },
    });
    return { success: true, data: session };
  } catch (error: any) {
    console.error("Error updating voices:", error);
    return { success: false, error: error.message };
  }
}

// 8. Xóa một tin nhắn chat
export async function deleteChatMessageAction(messageId: string) {
  try {
    await prisma.chatMessage.delete({
      where: { id: messageId },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting chat message:", error);
    return { success: false, error: error.message };
  }
}

export async function updateChatSessionTypeAction(sessionId: string, type: string, title?: string) {
  try {
    const session = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { 
        type,
        ...(title ? { title } : {})
      },
    });
    return { success: true, data: session };
  } catch (error: any) {
    console.error("Error updating chat session type:", error);
    return { success: false, error: error.message };
  }
}

export async function batchSaveScriptAction(
  sessionId: string,
  messages: Array<{
    id: string;
    role: "USER" | "ASSISTANT" | "SYSTEM" | "OUTRO";
    content: string;
    audioUrl?: string | null;
    voiceStyleId?: number | null;
  }>,
  deleteMessageIds: string[],
  title?: string,
  updatedAt?: Date,
  voices?: {
    laoVoice?: string;
    laoVoiceStyle?: string;
    userVoice?: string;
    userVoiceStyle?: string;
  }
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete messages
      if (deleteMessageIds.length > 0) {
        await tx.chatMessage.deleteMany({
          where: {
            id: { in: deleteMessageIds },
          },
        });
      }

      // 2. Upsert messages
      const savedMessages = [];
      for (const msg of messages) {
        const m = await tx.chatMessage.upsert({
          where: { id: msg.id || "" },
          update: {
            audioUrl: msg.audioUrl || null,
            content: msg.content,
            role: msg.role as MessageRole,
          },
          create: {
            id: msg.id && msg.id.length > 5 ? msg.id : undefined,
            sessionId: sessionId,
            role: msg.role as MessageRole,
            content: msg.content,
            audioUrl: msg.audioUrl || null,
            voiceStyleId: msg.voiceStyleId || null,
          },
        });
        savedMessages.push(m);
      }

      // 3. Update Session Info
      const sessionData: any = {};
      if (title !== undefined) sessionData.title = title;
      if (updatedAt !== undefined) sessionData.updatedAt = updatedAt;
      else sessionData.updatedAt = new Date();

      if (voices) {
        if (voices.laoVoice !== undefined) sessionData.laoVoice = voices.laoVoice;
        if (voices.laoVoiceStyle !== undefined) sessionData.laoVoiceStyle = voices.laoVoiceStyle;
        if (voices.userVoice !== undefined) sessionData.userVoice = voices.userVoice;
        if (voices.userVoiceStyle !== undefined) sessionData.userVoiceStyle = voices.userVoiceStyle;
      }

      const updatedSession = await tx.chatSession.update({
        where: { id: sessionId },
        data: sessionData,
      });

      return { session: updatedSession, messages: savedMessages };
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in batchSaveScriptAction:", error);
    return { success: false, error: error.message };
  }
}

