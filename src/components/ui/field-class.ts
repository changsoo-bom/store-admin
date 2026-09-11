/**
 * 입력칸과 셀렉트의 공통 모양. 검색 영역과 페이지 크기 선택이 같이 쓴다.
 * 비어 있음  surface 바탕, hairline 테두리
 * 포커스     canvas 바탕, brand-blue 테두리 + 1px 링. 바깥 윤곽선은 겹치지 않게 끈다
 * 비활성     hairline-soft 바탕, steel 글자
 * 조건 걸림 모양은 쓰는 쪽에서 덧붙인다
 */
export const fieldClass =
  "h-[38px] w-full cursor-pointer appearance-none rounded-field border border-hairline bg-surface text-sm text-ink outline-hidden transition-[background-color,border-color,box-shadow] duration-150 ease-brand hover:border-hairline-strong focus:border-brand-blue focus:bg-canvas focus:shadow-[0_0_0_1px_var(--brand-blue)] disabled:cursor-not-allowed disabled:border-hairline-soft disabled:bg-hairline-soft disabled:text-steel";
