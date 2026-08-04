/**
 * clientActions.ts
 * Thay thế 100% server actions từ @/actions/chat bằng REST API fetch thông thường.
 * Triệt tiêu hoàn toàn UnrecognizedActionError (404 Next-Action ID mismatch) trên VPS deployment.
 */

export async function getChatMessagesAction(sessionId: string) {
    try {
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/messages`, {
            cache: 'no-store',
        });
        return await res.json();
    } catch (error: any) {
        console.error('[getChatMessagesAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function getScriptSessionsAction(userId?: string | null) {
    try {
        const params = new URLSearchParams();
        if (userId) params.set('userId', userId);
        params.set('type', 'script');
        const res = await fetch(`/api/sessions?${params.toString()}`, {
            cache: 'no-store',
        });
        return await res.json();
    } catch (error: any) {
        console.error('[getScriptSessionsAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function getChatSessionsAction(userId?: string | null) {
    try {
        const params = new URLSearchParams();
        if (userId) params.set('userId', userId);
        const res = await fetch(`/api/sessions?${params.toString()}`, {
            cache: 'no-store',
        });
        return await res.json();
    } catch (error: any) {
        console.error('[getChatSessionsAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function createChatSessionAction(userId?: string, title: string = "Hội thoại mới", type: string = "chat", createdAt?: Date) {
    try {
        const res = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, title, type, createdAt }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[createChatSessionAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function deleteChatSessionAction(sessionId: string) {
    try {
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
            method: 'DELETE',
        });
        return await res.json();
    } catch (error: any) {
        console.error('[deleteChatSessionAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

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
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, content, audioUrl, voiceStyleId, messageId, emotion }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[saveChatMessageAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function updateChatMessageContentAction(messageId: string, content: string, sessionId?: string | null, role?: string | null) {
    try {
        const sId = sessionId || 'default';
        const res = await fetch(`/api/sessions/${encodeURIComponent(sId)}/messages`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, content, role }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[updateChatMessageContentAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function updateChatSessionTitleAction(sessionId: string, title: string, updatedAt?: Date) {
    try {
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, updatedAt }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[updateChatSessionTitleAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function updateChatSessionVoicesAction(sessionId: string, laoVoice?: string, laoVoiceStyle?: string, userVoice?: string, userVoiceStyle?: string) {
    try {
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ laoVoice, laoVoiceStyle, userVoice, userVoiceStyle }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[updateChatSessionVoicesAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function updateChatSessionTypeAction(sessionId: string, type: string, title?: string) {
    try {
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, title }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[updateChatSessionTypeAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function deleteChatMessageAction(messageId: string) {
    try {
        const res = await fetch(`/api/sessions/default/messages?messageId=${encodeURIComponent(messageId)}`, {
            method: 'DELETE',
        });
        return await res.json();
    } catch (error: any) {
        console.error('[deleteChatMessageAction fetch] Error:', error?.message);
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
        emotion?: string | null;
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
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/batch-save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, deleteMessageIds, title, updatedAt, voices }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[batchSaveScriptAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

export async function togglePinChatSessionAction(sessionId: string, isPinned: boolean) {
    return { success: true, isPinned };
}

export async function loginWithGiacNgoAction(email: string, password: string) {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[loginWithGiacNgoAction fetch] Error:', error?.message);
        return { success: false, error: 'Lỗi kết nối máy chủ.' };
    }
}

export async function updateUserProfileAction(userId: string, profileData: any) {
    try {
        const res = await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, profileData }),
        });
        return await res.json();
    } catch (error: any) {
        console.error('[updateUserProfileAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}

