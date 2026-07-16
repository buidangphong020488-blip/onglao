import OngLaoPlatform from "@/components/onglao-platform";
import prisma from "@/lib/prisma";

export default async function Home() {
  let initialPoems: any[] = [];

  // 1. Lấy dữ liệu Kệ Pháp có sẵn trong Database
  try {
    const dbPoems = await prisma.poem.findMany({
      include: {
        stanzas: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    initialPoems = dbPoems.map(p => ({
      title: p.title,
      stanzas: p.stanzas.map(s => ({
        id: s.id,
        tags: s.tags,
        content: s.content,
        meaning: s.meaning,
        audioUrl: s.audioUrl,
        isSaved: false
      }))
    }));
  } catch (err) {
    console.warn("Lỗi kết nối cơ sở dữ liệu khi truy vấn Kệ Pháp, sử dụng dữ liệu trống:", err instanceof Error ? err.message : String(err));
  }

  // 2. Lấy Kệ Pháp từ GiacNgo Documents API và gộp vào (tránh trùng tiêu đề)
  try {
    const spaceId = process.env.GIACNGO_SPACE_ID || '1';
    const apiToken = process.env.GIACNGO_SERVICE_TOKEN || 'ebf1215cba2eceaadd1a6baccbbe0c82381ca1e033e120de';
    const apiUrl = `${process.env.GIACNGO_API_URL || 'https://giac.ngo'}/api/v1/documents?spaceId=${spaceId}&limit=10`;

    const docRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 } // Cache dữ liệu 60 giây
    });

    if (docRes.ok) {
      const docData = await docRes.json();
      if (docData && Array.isArray(docData.data)) {
        // Lọc các tài liệu có type là Kệ
        const keyDocuments = docData.data.filter((doc: any) => 
          doc.type && doc.type.toLowerCase().includes('kệ')
        );

        // Hàm helper phân tách nội dung HTML của document thành các dòng thơ
        const parseHtmlToLines = (html: string) => {
          let text = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<p[^>]*>/gi, '')
            .replace(/<div[^>]*>/gi, '');
          
          text = text.replace(/<[^>]*>/g, '');
          
          text = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');

          return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        };

        const apiPoems = keyDocuments.map((doc: any) => {
          const lines = parseHtmlToLines(doc.content || '');
          const stanzas: any[] = [];
          let currentStanza: string[] = [];

          for (let i = 0; i < lines.length; i++) {
            const lineLower = lines[i].toLowerCase();
            // Lọc bỏ các câu chữ phụ trợ (hồi hướng, nam mô...)
            if (lineLower.includes('nam mô tam vô chân sư')) continue;
            if (lineLower.includes('kính cảm niệm')) continue;
            if (lineLower.includes('nguyện đem công đức')) continue;
            if (lineLower.includes('hồi hướng khắp')) continue;
            if (lineLower.includes('đệ tử và chúng')) continue;
            if (lineLower.includes('đều đồng thành phật')) continue;
            if (lineLower.match(/[a-zA-Z\s]+,\s*\d{2}\/\d{2}\/\d{4}/)) continue;

            currentStanza.push(lines[i]);

            if (currentStanza.length === 4) {
              const remaining = lines.slice(i + 1).filter(l => {
                const lLower = l.toLowerCase();
                return !lLower.includes('nam mô tam vô chân sư') &&
                       !lLower.includes('kính cảm niệm') &&
                       !lLower.includes('nguyện đem công đức') &&
                       !lLower.includes('hồi hướng') &&
                       !lLower.includes('đệ tử') &&
                       !lLower.includes('thành phật') &&
                       !lLower.match(/[a-zA-Z\s]+,\s*\d{2}\/\d{2}\/\d{4}/);
              });

              if (remaining.length > 0 && remaining.length <= 2) {
                continue;
              }

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

          return {
            title: doc.title,
            stanzas: stanzas
          };
        }).filter((p: any) => p.stanzas.length > 0);

        // Gộp hai nguồn tránh trùng lặp tiêu đề
        const existingTitles = new Set(initialPoems.map(p => p.title.toLowerCase().trim()));
        const uniqueApiPoems = apiPoems.filter((p: any) => !existingTitles.has(p.title.toLowerCase().trim()));
        initialPoems = [...initialPoems, ...uniqueApiPoems];
      }
    }
  } catch (err) {
    console.warn("Lỗi khi tải Kệ Pháp từ GiacNgo API:", err instanceof Error ? err.message : String(err));
  }

  return <OngLaoPlatform initialPoems={initialPoems} />;
}




