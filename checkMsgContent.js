const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
pool.query(`
  SELECT id, role, content, "createdAt"
  FROM "ChatMessage"
  WHERE "sessionId" = '724ed499-fb8e-4483-960a-177b89a7f14c'
  ORDER BY "createdAt" DESC
  LIMIT 6
`, (err, res) => {
  if (err) console.error(err.message);
  else res.rows.forEach(r => console.log(r.id.substring(0,8), '|', r.role, '|', r.content?.substring(0,60)));
  pool.end();
});
