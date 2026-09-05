const { neon } = require('@neondatabase/serverless');

const sql = neon("postgresql://neondb_owner:npg_PqIlgSms3ay7@ep-patient-night-a5yusm39-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log("✅ Connection successful!");
    console.log(result[0].version);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

testConnection();