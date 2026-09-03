---
description: TypeScript 컨벤션, 네이밍, import 규칙
globs: ["src/**/*.ts", "src/**/*.tsx", "*.ts", "*.mjs"]
---

# 코딩 컨벤션

## 기본

- `strict: true`
- **`any` 금지.** 불가피하면 `unknown` + 타입 가드
- 인터페이스에 `I` 접두사 붙이지 않는다 (`AppState`, ~~`IAppState`~~)
- 타입 import 는 `import type`

```tsx
import type { Metadata } from "next";   // Good
import { Metadata } from "next";        // Bad
```

## 파일과 폴더 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 페이지·레이아웃 | 프레임워크 규칙 | `page.tsx`, `layout.tsx`, `loading.tsx` |
| 컴포넌트 (`components/` 하위) | **PascalCase** | `ProductList.tsx`, `OrderTable.tsx` |
| 유틸·라이브러리·프로바이더 | kebab-case | `query-provider.tsx`, `date-utils.ts` |
| Server Action | 라우트 폴더의 `actions.ts` | `app/(admin)/products/actions.ts` |
| Zustand 스토어 | `use-{domain}-store.ts` | `use-ui-store.ts` |
| 타입 정의 | kebab-case | `product.ts` |

**컴포넌트만 PascalCase, 나머지는 전부 kebab-case.** 폴더도 kebab-case.

## export

- 페이지·레이아웃: `export default function`
- 재사용 컴포넌트: **named export**

## Import 순서

1. 외부 라이브러리 (`next`, `react`, 3rd-party)
2. 내부 모듈 (`@/db/*`, `@/lib/*`, `@/components/*`)
3. 상대 경로 (CSS, 로컬 파일)

## 경로 별칭

**항상 `@/` 를 쓴다. 상대 경로 `../` 금지.**

```tsx
import { db } from "@/db";                    // Good
import { db } from "../../db";                // Bad
```

`../` 가 나오는 순간 파일을 옮길 때마다 import 가 깨진다.

## React Compiler

`next.config.ts` 에서 `reactCompiler` 를 켜면 아래 규칙이 린트로 잡힌다.

- **`useEffect` 안에서 `setState` 금지** (`set-state-in-effect`)
  - 읽기 전용 값이면 state 대신 **파생 값으로 직접 계산**
  - 로컬 편집 state 가 필요하면 부모에서 **`key` prop 으로 리마운트**
- 렌더링 중 `setState` 금지 (`set-state-in-render`)

**`eslint-disable` 로 덮지 않는다.** 컴파일러는 규칙 준수를 전제로 메모이제이션을 넣는다.
덮으면 잘못된 전제로 최적화하고 증상은 엉뚱한 곳에서 나온다. 린트가 나는 지점이 고칠 지점이다.
