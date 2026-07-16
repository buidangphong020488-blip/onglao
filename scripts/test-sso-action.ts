import dotenv from 'dotenv';
import path from 'path';

// Load environment variables immediately before any other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runTests() {
  console.log("=========================================");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("=========================================");

  // Dynamically import to ensure dotenv is fully configured first
  const { loginWithGiacNgoAction } = await import('../src/actions/auth');
  const { getChatSessionsAction, createChatSessionAction, deleteChatSessionAction } = await import('../src/actions/chat');
  const { default: prisma } = await import('../src/lib/prisma');

  const email = "demo@giac.ngo";
  const password = "password";

  console.log(`\n🔑 Testing loginWithGiacNgoAction with: ${email}`);
  const loginRes = await loginWithGiacNgoAction(email, password);

  if (!loginRes.success || !loginRes.data) {
    console.error("❌ Login failed:", loginRes.error);
    process.exit(1);
  }

  const { token, user } = loginRes.data;
  console.log("✅ Login Success!");
  console.log("👤 User Profile:", JSON.stringify(user, null, 2));
  console.log(`🎟️ API Token (truncated): ${token ? token.substring(0, 20) + "..." : "none"}`);

  // Test session operations
  console.log(`\n📂 Testing getChatSessionsAction for userId: ${user.id}`);
  const sessionsBefore = await getChatSessionsAction(user.id);
  if (!sessionsBefore.success) {
    console.error("❌ Failed to get chat sessions:", sessionsBefore.error);
    process.exit(1);
  }
  console.log(`✅ Retrieved ${sessionsBefore.data?.length || 0} sessions.`);

  console.log(`\n➕ Testing createChatSessionAction for userId: ${user.id}`);
  const createRes = await createChatSessionAction(user.id, "Cuộc đàm đạo thử nghiệm");
  if (!createRes.success || !createRes.data) {
    console.error("❌ Failed to create chat session:", createRes.error);
    process.exit(1);
  }
  const newSessionId = createRes.data.id;
  console.log(`✅ Session created with ID: ${newSessionId}, Title: ${createRes.data.title}`);

  console.log(`\n📂 Verifying session list updated...`);
  const sessionsAfter = await getChatSessionsAction(user.id);
  const found = sessionsAfter.data?.find((s: any) => s.id === newSessionId);
  if (found) {
    console.log(`✅ Found new session in the list!`);
  } else {
    console.error("❌ Created session not found in list!");
    process.exit(1);
  }

  console.log(`\n🗑️ Testing deleteChatSessionAction for sessionId: ${newSessionId}`);
  const deleteRes = await deleteChatSessionAction(newSessionId);
  if (!deleteRes.success) {
    console.error("❌ Failed to delete session:", deleteRes.error);
    process.exit(1);
  }
  console.log(`✅ Session deleted successfully.`);

  // Verify deletion from db
  const sessionsFinal = await getChatSessionsAction(user.id);
  const stillExists = sessionsFinal.data?.find((s: any) => s.id === newSessionId);
  if (!stillExists) {
    console.log(`✅ Session is confirmed deleted from database.`);
  } else {
    console.error("❌ Session still exists in database after deletion!");
    process.exit(1);
  }

  console.log("\n=========================================");
  console.log("🎉 ALL SSO AUTH AND DB TESTS PASSED!");
  console.log("=========================================");

  await prisma.$disconnect();
}

runTests()
  .catch(err => {
    console.error("❌ Test crashed:", err);
    process.exit(1);
  });
