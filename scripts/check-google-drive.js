const { Client } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL database!");

  // Find all tables
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  const tables = tablesRes.rows.map(r => r.table_name);
  console.log("Tables in database:", tables);

  // Helper to search a table for 'drive.google.com'
  async function searchTable(tableName) {
    // Get columns
    const colsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1 AND table_schema = 'public'
    `, [tableName]);
    
    const textCols = colsRes.rows
      .filter(r => ['character varying', 'text', 'array'].includes(r.data_type) || r.column_name.toLowerCase().includes('url'))
      .map(r => r.column_name);

    if (textCols.length === 0) return;

    for (const col of textCols) {
      try {
        const query = `SELECT * FROM "${tableName}" WHERE "${col}"::text LIKE '%drive.google.com%'`;
        const res = await client.query(query);
        if (res.rows.length > 0) {
          console.log(`\n[Found in table "${tableName}", column "${col}"]:`);
          res.rows.forEach(row => {
            console.log(JSON.stringify(row, null, 2));
          });
        }
      } catch (e) {
        // Ignore query errors for unsupported columns
      }
    }
  }

  for (const table of tables) {
    await searchTable(table);
  }

  console.log("\nSearch complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => client.end());
