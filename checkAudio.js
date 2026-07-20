const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
const PUBLIC_DIR = path.join(__dirname, 'public');

async function run() {
  // 1. Kiểm tra OpeningPhrase
  const phrases = await pool.query('SELECT id, text, "audioUrl", category FROM "OpeningPhrase" WHERE "audioUrl" IS NOT NULL ORDER BY category');
  console.log(`\n=== OPENING PHRASE (Mào đầu): ${phrases.rows.length} bản ghi có audio ===`);
  let missingPhrases = 0;
  for (const row of phrases.rows) {
    const url = row.audioUrl;
    if (url && url.startsWith('/')) {
      const filePath = path.join(PUBLIC_DIR, url);
      const exists = fs.existsSync(filePath);
      if (!exists) {
        missingPhrases++;
        console.log(`  MISSING [${row.category}] "${row.text.substring(0,40)}" → ${url}`);
      }
    }
  }
  console.log(`  → Thiếu file: ${missingPhrases}/${phrases.rows.length}`);

  // 2. Kiểm tra Stanza
  const stanzas = await pool.query('SELECT s.id, s.content, s."audioUrl", p.title FROM "Stanza" s LEFT JOIN "Poem" p ON p.id = s."poemId" WHERE s."audioUrl" IS NOT NULL LIMIT 200');
  console.log(`\n=== STANZA (Kệ): ${stanzas.rows.length} bản ghi có audio ===`);
  let missingStanzas = 0;
  for (const row of stanzas.rows) {
    const url = row.audioUrl;
    if (url && url.startsWith('/')) {
      const filePath = path.join(PUBLIC_DIR, url);
      const exists = fs.existsSync(filePath);
      if (!exists) {
        missingStanzas++;
        if (missingStanzas <= 5) {
          console.log(`  MISSING [${row.title}] "${row.content.substring(0,40)}" → ${url}`);
        }
      }
    }
  }
  if (missingStanzas > 5) console.log(`  ... và ${missingStanzas - 5} file nữa bị thiếu`);
  console.log(`  → Thiếu file: ${missingStanzas}/${stanzas.rows.length}`);

  await pool.end();
}

run().catch(console.error);
