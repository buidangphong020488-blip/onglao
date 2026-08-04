import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// POST /api/auth/login (thay thế loginWithGiacNgoAction server action)
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = (email || '').trim().toLowerCase();

    const giacNgoBase = process.env.GIACNGO_API_URL || "https://giac.ngo";
    const spaceId = Number(process.env.GIACNGO_SPACE_ID || "1");

    const res = await fetch(`${giacNgoBase}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password, spaceId }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: (errData as any)?.message || "Email hoặc mật khẩu không đúng.",
      });
    }

    const gn: any = await res.json();
    let avatarUrl = gn.avatarUrl || null;
    if (avatarUrl && avatarUrl.startsWith("/")) {
      avatarUrl = `${giacNgoBase}${avatarUrl}`;
    }

    const localUserId = `gn_${gn.id}`;
    let dbUser: any = null;

    try {
      dbUser = await prisma.user.upsert({
        where: { id: localUserId },
        update: {
          name: gn.name || gn.email,
          email: gn.email,
          image: avatarUrl,
        },
        create: {
          id: localUserId,
          name: gn.name || gn.email,
          email: gn.email,
          image: avatarUrl,
        },
      });
    } catch (dbError: any) {
      console.warn("[/api/auth/login] Warning DB upsert user:", dbError.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        token: gn.apiToken,
        refreshToken: gn.refreshToken || null,
        user: {
          id: localUserId,
          giacNgoId: gn.id,
          name: dbUser?.name || gn.name || gn.email,
          email: gn.email,
          avatar: avatarUrl,
          space: gn.space || null,
          profileCompleted: dbUser?.profileCompleted || false,
          userGender: dbUser?.userGender || null,
          userAge: dbUser?.userAge || null,
          appLanguage: dbUser?.appLanguage || null,
          userVoice: dbUser?.userVoice || null,
          userVoiceStyle: dbUser?.userVoiceStyle || null,
          laoVoice: dbUser?.laoVoice || null,
          laoVoiceStyle: dbUser?.laoVoiceStyle || null,
          customLaoName: dbUser?.customLaoName || null,
          laoSelfCall: dbUser?.laoSelfCall || null,
          laoCallUser: dbUser?.laoCallUser || null,
          customUserName: dbUser?.customUserName || null,
          userSelfCall: dbUser?.userSelfCall || null,
          userCallLao: dbUser?.userCallLao || null,
        },
      },
    });
  } catch (error: any) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json({ success: false, error: "Lỗi kết nối máy chủ. Vui lòng thử lại." }, { status: 500 });
  }
}
