# store-admin

복싱 용품 스토어 **BoxingStore** 의 관리자 화면. 상품 등록, 주문 처리, 재고와 정산을 다룬다.

## 스택

| | |
|---|---|
| 프레임워크 | Next.js 16.3 (App Router, Turbopack, React Compiler) |
| 런타임 | React 19.2 |
| 언어 | TypeScript strict |
| 스타일 | Tailwind CSS v4 (`@theme inline`, `tailwind.config.js` 없음) |
| DB | **Neon** (PostgreSQL 서버리스) |
| ORM | **Drizzle ORM 0.45.2** (정확 버전 핀) + drizzle-kit 0.31 |
| 검증 | Zod 4 + drizzle-zod |
| 패키지 | pnpm |

**Prisma 를 쓰지 않는다.** 공통규칙 문서에 Prisma 로 적힌 부분은 전부 Drizzle 로 읽는다.

## 명령

```bash
pnpm dev              # 개발 서버
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit

pnpm db:generate      # 스키마 diff → drizzle/ 에 SQL 파일 생성
pnpm db:migrate       # 마이그레이션 적용
pnpm db:push          # SQL 파일 없이 바로 반영 (프로토타이핑 전용)
pnpm db:studio        # 브라우저 DB 뷰어
```

## 워크트리

**브랜치를 바꾸지 않고 옆에 디렉터리를 판다.** 규칙은 Obsidian `개발-공통규칙/git-worktree.md`.

```bash
./scripts/wt.sh add   fix/variant-stock   # ../store-admin-variant-stock 을 만들고 pnpm install 까지
./scripts/wt.sh close fix/variant-stock   # main 으로 ff-머지한 뒤 워크트리와 브랜치 삭제
./scripts/wt.sh ls
```

`add` 는 gitignore 대상이라 따라오지 않는 `.env.local` 과 `.claude/settings.local.json` 을 복사한다.
`close` 는 `--ff-only` 라 머지 커밋을 만들지 않고, 안 되면 그 자리에서 멈춘다. rebase 하라는 신호다.

**`node_modules` 를 심링크로 공유하지 않는다.** pnpm 은 전역 스토어에서 하드링크로 붙어서
워크트리마다 `pnpm install` 하는 게 더 빠르고 안전하다. 디스크도 거의 안 먹는다.

동시에 두 개를 띄울 땐 포트를 나눈다. `pnpm dev --port 3001`.

## 환경변수

`.env.local` 에 둔다. `.env.example` 을 복사해서 채운다.

| 이름 | 설명 |
|---|---|
| `DATABASE_URL` | Neon **Pooled connection** 문자열. `-pooler` 가 붙은 쪽을 쓴다 |

## 규칙

`.claude/rules/` 에 있다. 파일 경로에 맞춰 자동으로 붙는다.

- [코딩 컨벤션](.claude/rules/coding-conventions.md) — TypeScript, 네이밍, import, 경로 별칭
- [폴더 구조](.claude/rules/structure.md) — 레이어 방향, 컴포넌트 배치, 접미사 규칙
- [데이터 패턴](.claude/rules/data.md) — 읽기는 서버 컴포넌트, 쓰기는 Server Action, 소유권 검증
- [Drizzle](.claude/rules/drizzle.md) — 스키마 정의, 쿼리, 트랜잭션, 마이그레이션
- [상태 관리](.claude/rules/state.md) — 서버 데이터 / searchParams / Zustand / TanStack Query
- [스타일](.claude/rules/styling.md) — Tailwind v4, 다크 모드, 클래스 순서

## 프로토타입

`prototype/` 에 HTML 시안이 있다. 구현할 때 참조한다. 빌드에 포함되지 않는다.

| 파일 | 내용 |
|---|---|
| `dashboard.html` | 운영 대시보드 (Miro 디자인 언어) |
| `product-new.html` | 상품 등록 (Discord 디자인 언어) |
| `product-new-cinema.html` | 상품 등록 대안 시안 |

**디자인 언어는 아직 확정되지 않았다.** 실제 화면을 짜기 전에 어느 쪽으로 갈지 정한다.

## 아직 없는 것

의도적으로 비워 뒀다. 필요해질 때 만든다.

- 인증 (`users` 테이블도 아직 없다. Auth.js 를 쓸지 정한 뒤에 만든다)
- 이미지 업로드 대상 (S3, Vercel Blob 등)
- 판매 채널 연동 (네이버, 쿠팡)
