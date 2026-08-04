/**
 * clientActions.ts
 * Thay thế server actions từ @/actions/chat bằng fetch thông thường
 * Tránh UnrecognizedActionError do Next.js Turbopack build inconsistency
 */

export async function getChatMessagesAction(sessionId: string) {
    try {
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/messages`, {
            cache: 'no-store',
        });
        const data = await res.json();
        return data;
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
        const data = await res.json();
        return data;
    } catch (error: any) {
        console.error('[getScriptSessionsAction fetch] Error:', error?.message);
        return { success: false, error: error.message };
    }
}
