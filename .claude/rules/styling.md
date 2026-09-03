---
description: Tailwind v4 스타일 규칙
globs: ["src/**/*.tsx", "src/app/globals.css"]
---

# 스타일

## CSS 기반 설정

**`tailwind.config.js` 를 쓰지 않는다.** v4 는 CSS 에서 설정한다.
전역 토큰은 `src/app/globals.css` 의 `@theme inline` 에 정의한다.

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

커스텀 색상은 **CSS 변수로 정의하고 `@theme inline` 으로 등록**한다.

## 클래스 작성 순서

**레이아웃 → 크기 → 간격 → 타이포그래피 → 색상 → 기타**

```tsx
className="flex items-center w-full h-12 px-5 text-base font-medium text-foreground bg-background rounded-full transition-colors"
```

순서가 정해져 있으면 긴 클래스 문자열에서 원하는 걸 눈으로 빨리 찾는다.

## Sass 미사용

Tailwind 전용. `.scss` 파일이나 `styles/` 디렉터리를 두지 않는다.

## 폰트

`next/font` 로 로드한다. 별도 `@font-face` 를 쓰지 않는다.
CSS 변수로 노출해서 `@theme inline` 에서 참조한다.

**한글 폰트 스택을 반드시 챙긴다.** 영문 서체만 지정하면 한글이 통째로 무너진다.

```
본문·UI    'Pretendard Variable', Pretendard, ..., 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif
디스플레이  영문 서체를 먼저 두고 한글 폴백을 뒤에 붙인다
모노       'JetBrains Mono', 'D2Coding', monospace
```

## 한글 조판

- `word-break: keep-all` — 어절 중간에서 끊기는 걸 막는다
- `line-height` 를 영문 기준보다 0.1 올린다. 한글은 같은 값에서 답답해 보인다
- 음수 트래킹을 한글에 그대로 쓰지 않는다. 디스플레이 사이즈에서 `-0.025em` 까지만

## 숫자

금액·수량·SKU 처럼 자릿수가 맞아야 읽히는 값에는 `font-variant-numeric: tabular-nums` 를 준다.
관리자 화면의 표가 흔들리는 주된 원인이다.
