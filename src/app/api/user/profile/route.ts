import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { authenticateUser } from '@/lib/authz';

// POST /api/user/profile (thay thế updateUserProfileAction server action)
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const { profileData } = await request.json();
    const userId = auth.user.id;

    const dataToSet = {
      profileCompleted: true,
      name: profileData?.userName || auth.user.name || undefined,
      userGender: profileData?.userGender || null,
      userAge: profileData?.userAge ? Number(profileData.userAge) : null,
      appLanguage: profileData?.appLanguage || null,
      userVoice: profileData?.userVoice || null,
      userVoiceStyle: profileData?.userVoiceStyle || null,
      laoVoice: profileData?.laoVoice || null,
      laoVoiceStyle: profileData?.laoVoiceStyle || null,
      customLaoName: profileData?.customLaoName || null,
      laoSelfCall: profileData?.laoSelfCall || null,
      laoCallUser: profileData?.laoCallUser || null,
      customUserName: profileData?.customUserName || null,
      userSelfCall: profileData?.userSelfCall || null,
      userCallLao: profileData?.userCallLao || null,
    };

    await prisma.user.upsert({
      where: { id: userId },
      update: dataToSet,
      create: {
        id: userId,
        email: profileData?.email || auth.user.email || `${userId}@giac.ngo`,
        ...dataToSet,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[/api/user/profile] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
