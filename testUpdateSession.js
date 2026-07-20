const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao' });
// Thử update title của session đầu tiên
pool.query('UPDATE "ChatSession" SET title = $1 WHERE id = $2 RETURNING id, title', 
  ['Test Edit Title', 'bcc1e36b-7eb1-4551-a714-14c94e1f0bba'],
  (err, res) => {
    if (err) console.error('LỖI:', err.message);
    else console.log('OK:', JSON.stringify(res.rows[0]));
    pool.end();
  }
);
