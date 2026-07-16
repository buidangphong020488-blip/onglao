"use server";

import prisma from "@/lib/prisma";

// 1. Lấy toàn bộ danh sách tri thức giác ngộ
export async function getGiacNgoListAction() {
  try {
    const list = await prisma.knowledgeBase.findMany({
      orderBy: { createdAt: "desc" },
    });
    const mapped = list.map(item => ({
      id: item.id,
      source: item.category || 'Dữ liệu gốc (giacngo.sql)',
      text: `Hỏi: ${item.question}\nĐáp: ${item.answer}`
    }));
    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Error getting GiacNgo list:", error);
    return { success: false, error: error.message };
  }
}

// 2. Thêm hoặc cập nhật một tri thức (upsert)
export async function saveGiacNgoAction(id: string | undefined, source: string, text: string) {
  try {
    let question = '';
    let answer = '';
    if (text.includes('\nĐáp:')) {
      const parts = text.split('\nĐáp:');
      question = parts[0].replace(/^Hỏi:\s*/, '').trim();
      answer = parts[1].trim();
    } else {
      question = text.trim();
      answer = '';
    }

    const item = await prisma.knowledgeBase.upsert({
      where: { id: id || "" },
      update: {
        category: source,
        question: question,
        answer: answer,
      },
      create: {
        id: id || undefined,
        category: source,
        question: question,
        answer: answer,
      },
    });

    return {
      success: true,
      data: {
        id: item.id,
        source: item.category,
        text: `Hỏi: ${item.question}\nĐáp: ${item.answer}`
      }
    };
  } catch (error: any) {
    console.error("Error saving GiacNgo:", error);
    return { success: false, error: error.message };
  }
}

// 3. Xóa một tri thức
export async function deleteGiacNgoAction(id: string) {
  try {
    await prisma.knowledgeBase.delete({
      where: { id: id },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting GiacNgo:", error);
    return { success: false, error: error.message };
  }
}

// 4. Lưu hàng loạt tri thức (ví dụ khi upload hoặc reset về mặc định)
export async function saveAllGiacNgoAction(items: { id: string; source: string; text: string }[]) {
  try {
    const operations = items.map(item => {
      let question = '';
      let answer = '';
      if (item.text.includes('\nĐáp:')) {
        const parts = item.text.split('\nĐáp:');
        question = parts[0].replace(/^Hỏi:\s*/, '').trim();
        answer = parts[1].trim();
      } else {
        question = item.text.trim();
        answer = '';
      }

      return prisma.knowledgeBase.upsert({
        where: { id: item.id },
        update: {
          category: item.source,
          question: question,
          answer: answer,
        },
        create: {
          id: item.id,
          category: item.source,
          question: question,
          answer: answer,
        },
      });
    });

    const results = await prisma.$transaction(operations);
    const mapped = results.map(item => ({
      id: item.id,
      source: item.category || 'Dữ liệu gốc (giacngo.sql)',
      text: `Hỏi: ${item.question}\nĐáp: ${item.answer}`
    }));

    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Error saving all GiacNgo:", error);
    return { success: false, error: error.message };
  }
}

// 5. Xóa toàn bộ tri thức giác ngộ
export async function clearAllGiacNgoAction() {
  try {
    await prisma.knowledgeBase.deleteMany({});
    return { success: true };
  } catch (error: any) {
    console.error("Error clearing all GiacNgo:", error);
    return { success: false, error: error.message };
  }
}
