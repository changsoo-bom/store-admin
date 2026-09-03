---
description: 폴더 구조와 컴포넌트 배치 규칙
globs: ["src/**/*.ts", "src/**/*.tsx"]
---

# 폴더 구조

## 레이어를 세로로 통과한다

```
types → schemas → db/lib → components → app(route)
```

**각 단계는 아래 단계만 알고, 위 단계는 모른다.** 방향이 뒤집히면 순환 의존이 생긴다.

## 전체 구조

```
src/
├── app/                      # 라우팅 전용 (얇게 유지)
│   ├── (admin)/              # 라우트 그룹 — 관리자 영역
│   │   └── {domain}/
│   │       ├── page.tsx      #   목록 (필터는 searchParams)
│   │       ├── [id]/page.tsx #   상세
│   │       └── actions.ts    #   Server Action
│   ├── (auth)/               # 라우트 그룹 — 로그인
│   ├── _components/          # 라우트 전용 프로바이더/셸
│   └── api/                  # Route Handler — 라이브러리가 요구할 때만
│
├── components/
│   ├── ui/                   # 전역 프리미티브 (Button, Pagination…)
│   ├── common/               # 여러 도메인이 공유하는 조합 컴포넌트 (index.ts 배럴)
│   └── {domain}/{feature}/   # 도메인 컴포넌트
│
├── db/
│   ├── schema.ts             # Drizzle 스키마 (단일 파일)
│   └── index.ts              # db 인스턴스 (여기서만 만든다)
│
├── hooks/                    # use-*.ts — 클라이언트 훅
│
├── lib/
│   ├── schemas/{domain}.ts   # Zod 스키마 (+ index.ts 배럴)
│   ├── queries/{domain}.ts   # 읽기 쿼리 모음
│   ├── utils.ts              # cn() 등 공용 유틸
│   └── use-{domain}-store.ts # Zustand 스토어
│
├── types/                    # 도메인별 타입 ({domain}.ts 하나씩)
└── constants/
```

## 원칙

1. **`app/` 은 라우팅만.** 로직은 컴포넌트·액션·lib 에 있다
2. **DB 접근은 `db/` 와 `lib/queries/` 경유.** 컴포넌트에서 직접 쿼리하지 않는다
3. 파일이 많아져도 **도메인 → 기능 2단계**로 접힌다

## 컴포넌트 배치

```
src/components/{도메인}/{기능}/{PascalCase}.tsx
예) src/components/product/list/ProductList.tsx
```

한 페이지를 통짜 컴포넌트로 만들지 않고 **일관된 접미사**로 쪼갠다.

| 접미사 | 역할 | 예시 |
|---|---|---|
| `List` | 목록·그리드 | `ProductList.tsx` |
| `Filter` | 검색·필터 영역 | `ProductFilter.tsx` |
| `Card` | 목록의 한 항목 | `ProductCard.tsx` |
| `Detail` | 상세 조회 | `OrderDetail.tsx` |
| `Form` | 생성·편집 폼 | `ProductForm.tsx` |
| `Pop` | 팝업·모달 | `StockAdjustPop.tsx` |

파일 이름만 봐도 역할이 드러나고, 한 파일이 300줄 넘게 비대해지지 않는다.

## UI 계층

- `components/ui/` — 앱 전역 **프리미티브**
- `components/common/` — 여러 도메인이 공유하는 **조합 컴포넌트**
- **도메인 전용 컴포넌트는 절대 `ui/` 에 두지 않는다.** 경계가 무너지면 `ui/` 가 잡동사니 서랍이 된다

## `"use client"` 는 leaf 에

- **실제로 상호작용하는 말단에만** 붙인다 (입력, 폼, 모달, 필터 컨트롤)
- 페이지·레이아웃·목록 컨테이너는 **서버 컴포넌트로 유지**

목록을 통째로 클라이언트 컴포넌트로 만들면 초기 로딩을 통째로 버린다.
