---
description: 데이터 읽기·쓰기 패턴과 Zod 검증
globs: ["src/app/**/*.tsx", "src/app/**/actions.ts", "src/lib/**/*.ts", "src/db/**/*.ts"]
---

# 데이터 패턴

**읽기는 서버 컴포넌트, 쓰기는 Server Action.** 이 두 문장이 전부다.

## 새 기능 추가 순서

```
1. src/db/schema.ts             — 테이블 (필요하면)
2. src/types/{domain}.ts        — 화면용 타입
3. src/lib/schemas/{domain}.ts  — Zod 스키마
4. src/lib/queries/{domain}.ts  — 읽기 쿼리
5. src/app/.../actions.ts       — Server Action (쓰기)
6. src/components/{domain}/...  — 컴포넌트
7. src/app/.../page.tsx         — 라우트 조립
```

아래에서 위로 쌓는다. 컴포넌트부터 만들면 타입이 나중에 따라오면서 `any` 가 스며든다.

## 읽기 — 서버 컴포넌트

```tsx
export default async function ProductsPage({ searchParams }: Props) {
  const params = productListParamsSchema.parse(await searchParams);
  const products = await getProducts(params);   // lib/queries/
  return <ProductList products={products} />;
}
```

**필터·정렬·페이지는 `searchParams` 로 받는다.** 클라이언트 state 로 들고 있지 않는다.
뒤로가기와 공유가 공짜로 따라온다.

## 쓰기 — Server Action

**Route Handler 를 새로 만들지 않는다.** (라이브러리가 요구하는 경우만 예외.)

```ts
"use server";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("로그인이 필요합니다");

  const parsed = productWithVariantsSchema.safeParse(toObject(formData));
  if (!parsed.success) throw new Error("입력값을 확인해주세요");

  await db.transaction(async (tx) => { /* ... */ });
  revalidatePath("/products");
}
```

**인증 → 검증 → 실행 → revalidate.** 순서를 지킨다. 세션 확인이 첫 줄이다.
액션 파일은 해당 라우트 폴더의 `actions.ts`.

## 인증은 서버에서 확인한다

**클라이언트에서 버튼을 숨긴 것은 인증이 아니다.** Server Action 은 URL 만 알면 직접 호출된다.
권한 판별 시 null·예외값은 **더 낮은 권한으로 폴백한다**(fail-closed). 판단 불가는 거부다.

소유권 조건은 → [Drizzle 규칙](drizzle.md)

## 어디서 검증하나

| 상황 | 검증 |
|---|---|
| Server Action 입력 (FormData) | **필수** |
| `searchParams` | **필수** |
| 외부 API 응답 (네이버, 쿠팡 등) | **필수** |
| DB → 서버 컴포넌트 | 불필요. Drizzle 스키마가 타입을 보장한다 |

**신뢰 경계를 넘는 곳에서만 검증한다.** DB 에서 온 걸 다시 검증하는 건 낭비다.

## 외부 응답에 `as` 금지

파싱 결과는 어떤 타입도 보장되지 않는다. `as` 단언은 거짓말이다.

```ts
const parsed = z.array(itemSchema).safeParse(raw);
if (!parsed.success) {
  console.error("[naver] 응답 스키마 불일치:", parsed.error.issues);
  throw new ApiError("정보를 불러올 수 없습니다");
}
return parsed.data;
```

**원본 에러는 `console.error` 에만. 사용자에겐 일반화된 메시지.**

## transform 안에서 throw 금지

`safeParse` 시 uncaught exception 이 난다. `ctx.addIssue` + `return z.NEVER` 를 쓴다.

## 배열 부분 실패

목록에서 일부 항목만 스키마에 안 맞으면 전체를 버리지 말고 유효한 것만 살린다.
**단, 조용히 버리지 않는다.** 몇 개가 걸러졌는지 `console.warn` 으로 남긴다.

## 에러 메시지는 유저 대면이다

```ts
z.string().min(1, "상품명을 입력해주세요")
```

Zod 메시지가 그대로 사용자에게 보인다. 개발자 메모가 아니다.

## 외부 API 실패는 국소화한다

판매 채널 API 가 죽어도 관리자 화면 전체가 죽으면 안 된다. 해당 섹션만 접히게 만든다.

- 외부 데이터를 읽는 서브트리에 자체 `error.tsx` 경계를 둔다
- 다른 영역 렌더 경로에서 외부 API 를 동기적으로 기다리지 않는다
- 캐시 키에 필터 파라미터를 빠짐없이 반영한다. 누락하면 캐시가 오염된다
