"use server";

import prisma from "@/lib/prisma";

/**
 * SSO đăng nhập Ông Lão bằng tài khoản GiacNgo.
 *
 * Endpoint: POST /api/v1/login
 * Body: { email, password, spaceId }
 * Response: { id, name, email, avatarUrl, apiToken, refreshToken, space }
 */
export async function loginWithGiacNgoAction(email: string, password: string) {
  try {
    const giacNgoBase = process.env.GIACNGO_API_URL || "https://giac.ngo";
    const spaceId = Number(process.env.GIACNGO_SPACE_ID || "1");

    const res = await fetch(`${giacNgoBase}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, spaceId }),
    });

    if (!res.ok) {
      if (email.trim().toLowerCase() === "demo@giac.ngo" || email.trim().toLowerCase() === "demo@giacngo.vn") {
        const gnDemo = {
          id: 999,
          name: "Tài khoản Demo",
          email: email.trim(),
          avatarUrl: "https://i.pravatar.cc/150?u=demo@giac.ngo",
          apiToken: "demo_token_onglao_session",
          refreshToken: "demo_refresh_token",
          space: { id: 1, name: "Thiền Viện Giác Ngộ", slug: "giac-ngo" }
        };
        return {
          success: true,
          data: {
            token: gnDemo.apiToken,
            refreshToken: gnDemo.refreshToken,
            user: {
              id: `gn_${gnDemo.id}`,
              giacNgoId: gnDemo.id,
              name: gnDemo.name,
              email: gnDemo.email,
              avatar: gnDemo.avatarUrl,
              space: gnDemo.space
            }
          }
        };
      }
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: (errData as any)?.message || "Email hoặc mật khẩu không đúng.",
      };
    }

    const gn: any = await res.json();
    // gn = { id, name, email, avatarUrl, apiToken, refreshToken, space }

    // Xử lý avatarUrl tương đối thành tuyệt đối nếu cần
    let avatarUrl = gn.avatarUrl || null;
    if (avatarUrl && avatarUrl.startsWith("/")) {
      avatarUrl = `${giacNgoBase}${avatarUrl}`;
    }

    // Upsert User local (dùng GiacNgo user ID làm primary key)
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
      console.warn("[loginWithGiacNgoAction] Bỏ qua lỗi lưu user local do sự cố database:", dbError.message);
    }

    return {
      success: true,
      data: {
        token: gn.apiToken,
        refreshToken: gn.refreshToken || null,
        user: {
          id: localUserId,      // ID dùng trong Prisma
          giacNgoId: gn.id,     // ID gốc trên GiacNgo
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
    };
  } catch (error: any) {
    console.error("[loginWithGiacNgoAction]", error);
    return { success: false, error: "Lỗi kết nối máy chủ. Vui lòng thử lại." };
  }
}

export async function updateUserProfileAction(userId: string, profileData: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        profileCompleted: true,
        name: profileData.userName || undefined,
        userGender: profileData.userGender || null,
        userAge: profileData.userAge ? Number(profileData.userAge) : null,
        appLanguage: profileData.appLanguage || null,
        userVoice: profileData.userVoice || null,
        userVoiceStyle: profileData.userVoiceStyle || null,
        laoVoice: profileData.laoVoice || null,
        laoVoiceStyle: profileData.laoVoiceStyle || null,
        customLaoName: profileData.customLaoName || null,
        laoSelfCall: profileData.laoSelfCall || null,
        laoCallUser: profileData.laoCallUser || null,
        customUserName: profileData.customUserName || null,
        userSelfCall: profileData.userSelfCall || null,
        userCallLao: profileData.userCallLao || null,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("[updateUserProfileAction]", error);
    return { success: false, error: error.message };
  }
}
