const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
pool.query(`SELECT p.title, COUNT(s.id) as stanzas, COUNT(s."audioUrl") as has_audio 
            FROM "Poem" p LEFT JOIN "Stanza" s ON s."poemId" = p.id 
            GROUP BY p.title ORDER BY p.title`, (err, res) => {
  if (err) console.error(err.message);
  else {
    let totalStanza = 0, totalAudio = 0;
    res.rows.forEach(r => {
      console.log(`  [${r.title}] kệ: ${r.stanzas}, có audio: ${r.has_audio}`);
      totalStanza += parseInt(r.stanzas);
      totalAudio  += parseInt(r.has_audio);
    });
    console.log(`\nTổng: ${totalStanza} kệ, ${totalAudio} có audio, ${totalStanza - totalAudio} cần tạo`);
  }
  pool.end();
});
