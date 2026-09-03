---
description: Drizzle ORM 과 Neon 사용 규칙
globs: ["src/db/**/*.ts", "drizzle.config.ts", "src/app/**/actions.ts", "src/lib/**/*.ts"]
---

# Drizzle · Neon

## 버전을 고정한다

`drizzle-orm` 은 `^` 없이 **정확 버전**으로 박는다. 0.x 시절부터 마이너마다 breaking change 가 잦았다.
v1 은 아직 베타이므로 올리지 않는다. 올릴 때는 RQBv1 → v2 마이그레이션 가이드를 먼저 읽는다.

## 커넥션은 하나다

`src/db/index.ts` 의 `db` 만 쓴다. 다른 곳에서 `drizzle()` 을 새로 호출하지 않는다.

`neon-http` 가 아니라 **`neon-serverless` 의 WebSocket Pool** 을 쓴다.
상품 등록처럼 `products` 와 `product_variants` 를 함께 넣는 작업에 대화형 트랜잭션이 필요하기 때문이다.
`neon-http` 는 `db.batch()` 만 되고 방금 넣은 행의 id 를 받아 이어 쓸 수 없다.

## 스키마

`src/db/schema.ts` **한 파일**이다. 스키마가 DSL 파일이 아니라 TypeScript 코드다.

- 테이블명은 **snake_case 복수형** (`product_variants`), TS 변수는 camelCase 복수형 (`productVariants`)
- 컬럼은 TS 에서 camelCase, DB 에서 snake_case. `casing: "snake_case"` 가 변환한다
- **금액은 원 단위 `integer`.** 원은 소수점이 없다. `numeric` 도 float 도 쓰지 않는다
- 타임스탬프는 `{ withTimezone: true }`. 안 붙이면 서버(UTC)와 한국 시간이 어긋난다
- 과거 주문의 단가처럼 **시점에 고정돼야 하는 값은 복사해서 저장한다.** 상품 가격이 바뀌어도 주문서는 그대로여야 한다
- FK 와 `relations()` 는 **둘 다** 선언한다. FK 는 DB 제약, `relations()` 는 Relational Query 용이라 별개다
- 타입은 `$inferSelect` / `$inferInsert` 로 뽑아 `schema.ts` 하단에 모아 export 한다

## 쿼리

두 스타일을 섞어 쓰되 목적이 다르다.

| 상황 | 스타일 |
|---|---|
| 관계를 따라가는 조회 (상품 + 옵션 + 이미지) | `db.query.*.findMany({ with })` — 단일 쿼리로 나간다 |
| 집계, 통계, 부분 컬럼 선택, 복잡한 조건 | `db.select({...}).from().leftJoin()` |

`select()` 로 조인할 때는 필요한 컬럼만 매핑한다. `select()` 를 빈 채로 두면 조인한 테이블이 통째로 딸려온다.

## 트랜잭션

**여러 테이블에 걸친 쓰기는 반드시 `db.transaction()` 안에서 한다.**

```ts
await db.transaction(async (tx) => {
  const [product] = await tx.insert(products).values(input).returning();
  await tx.insert(productVariants).values(
    variants.map((v) => ({ ...v, productId: product.id })),
  );
});
```

중간에 throw 하면 전부 롤백된다. 상품만 들어가고 옵션이 빠진 상태를 만들지 않는다.

## 소유권과 조건

수정·삭제 쿼리의 `where` 에 **범위를 좁히는 조건을 반드시 포함한다.**

```ts
// ❌ id 만 — 다른 매장 상품도 지워진다
await db.delete(products).where(eq(products.id, id));

// ✅ 소유 조건 포함
await db.delete(products).where(and(eq(products.id, id), eq(products.storeId, storeId)));
```

화면상 티가 안 나고 에러도 안 난다. 테스트가 없으면 사고 날 때까지 모른다.

## 마이그레이션

```
개발 초기        pnpm db:push      SQL 파일 없이 바로 반영
스키마 확정 후   pnpm db:generate  → drizzle/ 에 SQL 생성 → 리뷰 → pnpm db:migrate
```

**`drizzle/` 의 SQL 파일은 커밋한다.** 열어서 읽고 고칠 수 있는 게 Drizzle 을 쓰는 이유 중 하나다.
프로덕션에는 `db:push` 를 쓰지 않는다.

## 검증

DB 에서 온 데이터는 **다시 검증하지 않는다.** 스키마가 타입을 보장한다.
검증은 신뢰 경계에서만 한다. → [데이터 패턴](data.md)

폼 입력 스키마는 `createInsertSchema()` 로 DB 스키마에서 뽑고 `.pick()` 으로 좁힌다.
DB 컬럼이 바뀌면 검증 스키마도 같이 깨져서 빠뜨릴 수 없다.
