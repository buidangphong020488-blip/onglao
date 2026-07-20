const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
pool.query(`
  SELECT s.id as session_id, s.title, COUNT(m.id) as msg_count
  FROM "ChatSession" s
  LEFT JOIN "ChatMessage" m ON m."sessionId" = s.id
  GROUP BY s.id, s.title
  ORDER BY s."createdAt" DESC
  LIMIT 10
`, (err, res) => {
  if (err) console.error(err.message);
  else res.rows.forEach(r => console.log(r.session_id.substring(0,8), '|', r.title, '| msgs:', r.msg_count));
  pool.end();
});
