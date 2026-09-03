import { defineConfig } from "drizzle-kit";

// drizzle-kit 은 Next 처럼 .env.local 을 자동으로 읽지 않는다.
// CI 처럼 환경변수가 이미 주입된 곳에서는 파일이 없어도 그냥 넘어간다.
try {
  process.loadEnvFile(".env.local");
} catch {
  // 파일이 없으면 process.env 를 그대로 쓴다
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  casing: "snake_case",
});
