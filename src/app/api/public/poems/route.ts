import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const dbPoems = await prisma.poem.findMany({
      include: {
        stanzas: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    let poems = dbPoems.map(p => ({
      title: p.title,
      stanzas: p.stanzas.map(s => ({
        id: s.id,
        tags: s.tags || [],
        content: s.content,
        meaning: s.meaning || '',
        audioUrl: s.audioUrl || null,
        isSaved: false
      }))
    }));

    // Nếu CSDL rỗng, tự động fetch từ GiacNgo Documents API làm fallback
    if (poems.length === 0) {
      try {
        const spaceId = process.env.GIACNGO_SPACE_ID || '1';
        const apiToken = process.env.GIACNGO_SERVICE_TOKEN || 'ebf1215cba2eceaadd1a6baccbbe0c82381ca1e033e120de';
        const apiUrl = `${process.env.GIACNGO_API_URL || 'https://giac.ngo'}/api/v1/documents?spaceId=${spaceId}&limit=50`;
        const docRes = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (docRes.ok) {
          const docData = await docRes.json();
          if (docData && Array.isArray(docData.data)) {
            const keyDocuments = docData.data.filter((doc: any) => doc.type && doc.type.toLowerCase().includes('kệ'));
            const parseHtmlToLines = (html: string) => {
              let text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/div>/gi, '\n').replace(/<p[^>]*>/gi, '').replace(/<div[^>]*>/gi, '').replace(/<[^>]*>/g, '');
              text = text.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
              return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            };
            poems = keyDocuments.map((doc: any) => {
              const lines = parseHtmlToLines(doc.content || '');
              const stanzas: any[] = [];
              let currentStanza: string[] = [];
              for (let i = 0; i < lines.length; i++) {
                const lineLower = lines[i].toLowerCase();
                if (lineLower.includes('nam mô tam vô chân sư') || lineLower.includes('kính cảm niệm') || lineLower.includes('nguyện đem công đức')) continue;
                currentStanza.push(lines[i]);
                if (currentStanza.length === 4) {
                  stanzas.push({
                    id: `giacngo_doc_${doc.id}_stanza_${stanzas.length + 1}`,
                    tags: doc.tags || [],
                    content: currentStanza.join('\n'),
                    meaning: '',
                    audioUrl: doc.audioUrl || null,
                    isSaved: false
                  });
                  currentStanza = [];
                }
              }
              if (currentStanza.length > 0) {
                stanzas.push({
                  id: `giacngo_doc_${doc.id}_stanza_${stanzas.length + 1}`,
                  tags: doc.tags || [],
                  content: currentStanza.join('\n'),
                  meaning: '',
                  audioUrl: doc.audioUrl || null,
                  isSaved: false
                });
              }
              return { title: doc.title, stanzas };
            }).filter((p: any) => p.stanzas.length > 0);
          }
        }
      } catch (gnErr) {
        console.warn('Lỗi fetch Kệ từ GiacNgo API:', gnErr);
      }
    }

    return NextResponse.json({ success: true, data: poems });
  } catch (err: any) {
    console.error("Lỗi GET /api/public/poems:", err);
    return NextResponse.json({ success: false, message: `Lỗi CSDL PostgreSQL: ${err.message}` }, { status: 500 });
  }
}
