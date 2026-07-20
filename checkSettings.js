const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
pool.query('SELECT key, LEFT(value, 40) as val FROM "SystemSetting" ORDER BY key', (err, res) => {
  if (err) console.error(err.message);
  else res.rows.forEach(r => console.log(r.key, ':', r.val));
  pool.end();
});
