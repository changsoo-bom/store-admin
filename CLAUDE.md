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

**브랜치를 바꾸지 않고 저장소 바깥에 디렉터리를 판다.** 규칙은 Obsidian `개발-공통규칙/git-worktree.md`.

**`feat` 이나 `fix` 성격의 작업은 본체에서 시작하지 않는다.** 워크트리를 먼저 파고 거기서 작업한다.
본체 `main` 은 항상 깨끗한 상태로 둔다. 오타 수정이나 문서 한 줄처럼 커밋 하나로 끝나는 건 예외다.

워크트리는 **플랫폼별 루트 아래 프로젝트 이름으로 한 단계 내려간 곳**에 만든다.
본체 옆에 형제로 두지 않는다. bare 패턴도 쓰지 않는다.

| 플랫폼 | 루트 |
|---|---|
| Windows | `C:\workspace\.boxingstore-worktrees\store-admin\` |
| macOS / Linux | `~/.boxingstore-worktrees/store-admin/` |

```
C:\workspace\
├── BoxingStore\store-admin\          ← 본체, main 이 항상 여기 체크아웃돼 있다
└── .boxingstore-worktrees\
    └── store-admin\
        ├── variant-stock\            ← wt.sh add 로 생긴다
        └── hotfix\
```

**이름은 디지몬으로 짓는다.** 이 프로젝트만의 규칙이다 (Obsidian 공통 문서는 `<type>/<무엇>`).
브랜치 이름이 곧 디렉터리 이름이 된다. 만들기 전에 `./scripts/wt.sh ls` 와 `git branch` 로 겹치는 이름을 피한다.

```bash
./scripts/wt.sh add   agumon   # <루트>/store-admin/agumon 을 만들고 pnpm install 까지
./scripts/wt.sh close agumon   # main 으로 ff-머지한 뒤 워크트리와 브랜치 삭제
./scripts/wt.sh ls
```

`add` 는 `origin/main` 을 fetch 한 뒤 거기서 분기한다. `git fetch` 는 로컬 `main` 을 갱신하지
않으므로 로컬에서 분기하면 fetch 가 의미가 없다. `--no-track` 을 붙여 upstream 이 `origin/main` 으로
박히는 것도 막는다. 박히면 나중에 `git push` 가 거절한다.
gitignore 대상이라 따라오지 않는 `.env.local` 과 `.claude/settings.local.json` 도 복사한다.

`close` 는 머지한 브랜치가 `pnpm-lock.yaml` 을 바꿨으면 본체에 다시 설치한다.
안 하면 다음 `pnpm dev` 가 없는 모듈을 찾는다. 개발 서버가 떠 있었다면 다시 시작한다.
커밋 안 된 변경이 있으면 머지 전에 멈춘다. `--ff-only` 라 머지 커밋을 만들지 않고,
ff 가 안 되면 그 자리에서 멈춘다. rebase 하라는 신호다.
정리는 `git worktree remove` 가 아니라 디렉터리를 직접 지우고 `prune` 한다.
`remove` 는 `node_modules` 를 못 지워서 항상 `Directory not empty` 로 실패한다.
마지막 워크트리를 지우면 빈 프로젝트 디렉터리와 루트도 같이 치운다.

루트를 바꾸려면 `WT_ROOT=/다른/경로 ./scripts/wt.sh add ...` 처럼 앞에 붙인다.

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
- [스타일](.claude/rules/styling.md) — Tailwind v4, 폰트, 한글 조판, 클래스 순서

## 디자인

**[DESIGN.md](DESIGN.md) 가 규칙이고 `prototype/dashboard.html` 이 원본이다.**
화면을 짜기 전에 DESIGN.md 를 읽는다. 둘이 어긋나면 시안을 믿고 DESIGN.md 를 고친다.

흰 캔버스 위의 관리자 도구다. `#050038` 하나가 모든 액션을 맡고,
카나리 옐로우는 워드마크 전용, 파스텔 다섯 개는 상태 구분에만 쓴다.

토큰은 `src/app/globals.css` 의 `@theme inline` 에 등록돼 있어 Tailwind 유틸리티로 바로 쓴다.

```tsx
<div className="rounded-panel border border-hairline bg-canvas p-5">
  <h2 className="font-display text-[17px] font-medium">패널 제목</h2>
  <p className="text-steel">보조 설명</p>
</div>
```

**새 색이나 반경은 DESIGN.md 표에 먼저 추가하고 `globals.css` 에 등록한 뒤 쓴다.**
컴포넌트에서 임의의 hex 나 `rounded-lg` 같은 Tailwind 기본 반경을 쓰지 않는다.

라이트 전용이다. `dark:` 를 쓰지 않는다. 이유는 DESIGN.md 하단에 있다.

## 아직 없는 것

의도적으로 비워 뒀다. 필요해질 때 만든다.

- 인증 (`users` 테이블도 아직 없다. Auth.js 를 쓸지 정한 뒤에 만든다)
- 이미지 업로드 대상 (S3, Vercel Blob 등)
- 판매 채널 연동 (네이버, 쿠팡)
