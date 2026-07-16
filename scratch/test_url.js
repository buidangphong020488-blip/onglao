const dbUrl = "postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao";
try {
  const parsed = new URL(dbUrl);
  console.log("username:", parsed.username);
  console.log("password:", parsed.password);
  console.log("pathname:", parsed.pathname);
  console.log("hostname:", parsed.hostname);
  console.log("port:", parsed.port);
} catch (e) {
  console.error(e);
}
