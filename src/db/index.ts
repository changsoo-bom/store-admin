import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// neon-http 가 아니라 WebSocket Pool 을 쓰는 이유는 db.transaction() 때문이다.
// 상품 등록은 products 와 product_variants 를 함께 넣어야 해서 대화형 트랜잭션이 필요하다.
// Node 22+ 와 Vercel Node 런타임에는 전역 WebSocket 이 있다.
// ponytail: 전역 WebSocket 이 없는 런타임을 만나면 `ws` 를 설치하고 여기서 주입한다.
if (!neonConfig.webSocketConstructor && typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL 이 없습니다. .env.local 을 확인하세요.");
}

// 개발 중 HMR 이 커넥션 풀을 계속 새로 만들지 않도록 전역에 붙여 둔다.
const globalForDb = globalThis as unknown as { pool?: Pool };

const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema, casing: "snake_case" });
export { schema };
