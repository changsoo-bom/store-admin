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

베이스 브랜치를 바꾸려면 WT_BASE=release/v1.x 를 앞에 붙인다.
EOF
}

# fix/variant-stock -> ../store-admin-variant-stock
dir_for() { printf '%s/../%s-%s' "$ROOT" "$NAME" "${1##*/}"; }

case "${1:-}" in

add)
  [ -n "${2:-}" ] || { usage; exit 1; }
  BR="$2"
  DIR="$(dir_for "$BR")"

  git -C "$ROOT" fetch --quiet origin "$BASE" || echo "  원격을 못 가져왔다. 로컬 $BASE 로 판다."
  git -C "$ROOT" worktree add "$DIR" -b "$BR" "$BASE"

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

  # 안 되면 여기서 멈춘다. rebase 하라는 신호다.
  git -C "$ROOT" merge --ff-only "$BR"

  # 커밋 안 된 게 남아 있으면 remove 가 거절한다. 그게 맞는 동작이다.
  git -C "$ROOT" worktree remove "$DIR"
  git -C "$ROOT" branch -d "$BR"

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
