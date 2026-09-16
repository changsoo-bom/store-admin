#!/usr/bin/env bash
# git worktree 헬퍼.
# 규칙 출처: Obsidian 개발-공통규칙/git-worktree.md
#
#   1. add   워크트리를 판다
#   2. 작업하고 커밋한다
#   3. close ff-머지하고 지운다
#
# --ff-only 가 핵심이다. 머지 커밋이 안 생기고, 안 되면 그 자리에서 멈춘다.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NAME="$(basename "$ROOT")"
BASE="${WT_BASE:-main}"

# 워크트리는 저장소 옆이 아니라 플랫폼별 루트 아래, 프로젝트 이름으로 한 단계 내려간 곳에 판다.
# 루트를 여러 저장소가 같이 쓰므로 프로젝트 단계가 없으면 워크트리 이름이 부딪힌다.
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) DEFAULT_ROOT="/c/workspace/.boxingstore-worktrees" ;;
  *) DEFAULT_ROOT="$HOME/.boxingstore-worktrees" ;;
esac
WT_ROOT="${WT_ROOT:-$DEFAULT_ROOT}"

# gitignore 대상이라 새 워크트리에 안 따라오는 것들
CARRY=(".env.local" ".claude/settings.local.json")

usage() {
  cat <<'EOF'
사용법:
  ./scripts/wt.sh add   <브랜치>   워크트리와 브랜치를 만들고 의존성까지 깐다
  ./scripts/wt.sh close <브랜치>   ff-머지한 뒤 워크트리와 브랜치를 지운다
  ./scripts/wt.sh ls               현재 워크트리 목록

예:
  ./scripts/wt.sh add   fix/variant-stock
  ./scripts/wt.sh close fix/variant-stock

베이스 브랜치를 바꾸려면 WT_BASE=release/v1.x 를, 워크트리 루트를 바꾸려면
WT_ROOT=/다른/경로 를 앞에 붙인다.
EOF
}

# fix/variant-stock -> <루트>/store-admin/variant-stock
dir_for() { printf '%s/%s/%s' "$WT_ROOT" "$NAME" "${1##*/}"; }

case "${1:-}" in

add)
  [ -n "${2:-}" ] || { usage; exit 1; }
  BR="$2"
  DIR="$(dir_for "$BR")"

  # git fetch 는 로컬 main 을 갱신하지 않는다. origin/main 에서 분기해야 fetch 가 의미를 갖는다.
  # --no-track 이 없으면 upstream 이 origin/main 으로 박혀서 나중에 push 가 거절된다.
  if git -C "$ROOT" fetch --quiet origin "$BASE" 2>/dev/null \
     && git -C "$ROOT" rev-parse --verify --quiet "origin/$BASE" >/dev/null; then
    START="origin/$BASE"
    EXTRA="--no-track"
  else
    echo "  원격을 못 읽었다. 로컬 $BASE 로 판다."
    START="$BASE"
    EXTRA=""
  fi
  mkdir -p "$(dirname "$DIR")"
  git -C "$ROOT" worktree add "$DIR" -b "$BR" "$START" $EXTRA

  for f in "${CARRY[@]}"; do
    if [ -f "$ROOT/$f" ]; then
      mkdir -p "$(dirname "$DIR/$f")"
      cp "$ROOT/$f" "$DIR/$f"
      echo "  복사: $f"
    fi
  done

  # pnpm 의 node_modules 는 심링크로 공유하지 않는다.
  # 전역 스토어에서 하드링크로 붙기 때문에 그냥 install 하는 게 빠르고 안전하다.
  ( cd "$DIR" && pnpm install )

  echo
  echo "완료. cd \"$DIR\""
  ;;

close)
  [ -n "${2:-}" ] || { usage; exit 1; }
  BR="$2"
  DIR="$(dir_for "$BR")"

  CUR="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD)"
  if [ "$CUR" != "$BASE" ]; then
    echo "본체가 $CUR 에 있다. $BASE 로 옮기고 다시 실행한다." >&2
    exit 1
  fi

  # 머지하기 전에 확인한다. 머지해 놓고 멈추면 되돌리기 번거롭다.
  if [ -e "$DIR/.git" ] && [ -n "$(git -C "$DIR" status --porcelain --untracked-files=no)" ]; then
    echo "커밋 안 된 변경이 남아 있다: $DIR" >&2
    git -C "$DIR" status --short >&2
    exit 1
  fi

  BEFORE="$(git -C "$ROOT" rev-parse HEAD)"

  # 안 되면 여기서 멈춘다. rebase 하라는 신호다.
  git -C "$ROOT" merge --ff-only "$BR"

  # worktree remove 는 node_modules 를 못 지워서 "Directory not empty" 로 실패한다.
  # 워크트리마다 node_modules 가 항상 있으니 직접 지우고 등록만 정리한다.
  if ! rm -rf "$DIR" 2>/dev/null; then
    echo "디렉터리를 못 지웠다: $DIR" >&2
    echo "그 안에서 도는 서버나 열어 둔 터미널이 있는지 본다." >&2
    echo "머지는 끝났으니 정리한 뒤 close 를 다시 실행하면 이어서 지운다." >&2
    exit 1
  fi
  rmdir "$WT_ROOT/$NAME" 2>/dev/null || true
  rmdir "$WT_ROOT" 2>/dev/null || true
  git -C "$ROOT" worktree prune
  git -C "$ROOT" branch -d "$BR"

  # 락파일이 바뀐 브랜치를 머지했으면 본체 node_modules 가 뒤처진다.
  # 안 깔면 다음 pnpm dev 가 없는 모듈을 찾는다.
  if ! git -C "$ROOT" diff --quiet "$BEFORE" HEAD -- pnpm-lock.yaml; then
    echo "  락파일이 바뀌었다. 본체에 다시 설치한다."
    ( cd "$ROOT" && pnpm install )
    echo "  개발 서버가 떠 있으면 다시 시작한다. 모듈 해석이 캐시돼 있다."
  fi

  echo
  echo "머지하고 지웠다. 푸시는 따로 한다."
  ;;

ls)
  git -C "$ROOT" worktree list
  ;;

*)
  usage
  ;;
esac
