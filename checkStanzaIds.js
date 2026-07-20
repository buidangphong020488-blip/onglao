const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
pool.query('SELECT id FROM "Stanza" LIMIT 5', (err, res) => {
  if (err) console.error(err.message);
  else res.rows.forEach(r => console.log('DB ID:', r.id));
  pool.end();
});
