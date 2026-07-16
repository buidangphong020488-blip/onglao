"use server";

import prisma from "@/lib/prisma";

// Lấy prompt template đang hoạt động theo tên
export async function getActivePromptAction(name: string) {
  try {
    const prompt = await prisma.promptTemplate.findUnique({
      where: {
        name: name,
      },
    });
    return { success: true, data: prompt };
  } catch (error: any) {
    console.error("Error getting active prompt:", error);
    return { success: false, error: error.message };
  }
}

// Cập nhật hoặc tạo mới prompt template
export async function savePromptTemplateAction(name: string, content: string) {
  try {
    const prompt = await prisma.promptTemplate.upsert({
      where: { name: name },
      create: {
        name: name,
        content: content,
      },
      update: {
        content: content,
      },
    });
    return { success: true, data: prompt };
  } catch (error: any) {
    console.error("Error saving prompt template:", error);
    return { success: false, error: error.message };
  }
}
