const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
pool.query('SELECT id, title, "createdAt" FROM "ChatSession" ORDER BY "createdAt" DESC LIMIT 5', (err, res) => {
  if (err) console.error(err.message);
  else res.rows.forEach(r => console.log(r.id.substring(0,8), '|', r.title, '|', r.createdAt));
  pool.end();
});
