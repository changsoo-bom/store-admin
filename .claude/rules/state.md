---
description: 상태 관리 도구 선택 기준
globs: ["src/**/*.tsx", "src/hooks/**/*.ts", "src/lib/use-*.ts"]
---

# 상태 관리

**데이터 종류마다 사는 곳이 다르다.** 이 표가 핵심이다.

| 데이터 종류 | 도구 | 위치 |
|---|---|---|
| DB 데이터 | 서버 컴포넌트 + Drizzle | `lib/queries/` |
| 외부 API 데이터 | 서버 컴포넌트 + ISR | `lib/{api}/` |
| 목록 필터·정렬·페이지 | **URL `searchParams`** | 라우트 |
| 클라이언트 전용 UI (사이드바 열림 등) | **Zustand** | `lib/use-{domain}-store.ts` |
| 무한스크롤 페칭 | **TanStack Query** | `hooks/` |

## 기본은 서버 컴포넌트

목록·상세·조회는 서버 컴포넌트에서 직접 가져온다. 클라이언트 페칭이 기본이 아니다.

## 목록 상태는 URL 로

필터·정렬·페이지를 클라이언트 state 로 들고 있지 않는다. `searchParams` 로 다룬다.

## Zustand — 클라이언트 UI 상태만

- 스토어는 `src/lib/` 하위, 파일명 `use-{domain}-store.ts`, 이름 `use{Domain}Store`
- 인터페이스를 먼저 정의하고 `create<T>()` 제네릭 사용

**서버 데이터를 Zustand 에 복사하지 않는다.** 동기화 지옥의 원인이다.
스토어에 넣는 순간 언제 갱신할지, 무엇이 최신인지를 손으로 관리해야 한다.

## TanStack Query — 쓰는 자리가 좁다

- **무한스크롤처럼 클라이언트에서 이어붙이는 페칭에만** 쓴다
- 초기 렌더 데이터는 서버 컴포넌트가 준다
- 폼 상태를 위해 mutation 을 쓰지 않는다. 그건 Server Action 의 일이다
- 기본 `staleTime` 60초
- query key 는 배열 네임스페이스: `["products", params]`
- **응답을 가르는 값(필터·정렬)은 반드시 키에 포함.** 누락하면 캐시가 오염된다
- Zod 검증 실패는 `retry` 에서 제외한다. 재시도해도 해결되지 않는다

## 판단 흐름

```
데이터가 서버에서 온다        → 서버 컴포넌트 (기본값)
  └ URL 로 표현되는 상태다     → searchParams
  └ 클라이언트에서 이어붙인다  → TanStack Query
데이터가 서버와 무관하다      → Zustand
```
