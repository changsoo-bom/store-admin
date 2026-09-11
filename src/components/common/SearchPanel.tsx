import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";

type PanelProps = {
  /** 목록 경로. 검색은 여기로 GET 을 보내고 초기화는 여기로 돌아온다 */
  action: string;
  children: ReactNode;
};

/**
 * 목록 위 검색 영역. 조건이 URL 에 남아서 뒤로가기와 공유가 된다.
 * 입력칸이 defaultValue 를 쓰므로 부모가 `key` 에 현재 조건을 넣어야 초기화가 칸을 비운다.
 */
export function SearchPanel({ action, children }: PanelProps) {
  return (
    <Form
      action={action}
      role="search"
      className="flex flex-wrap items-end gap-3 rounded-panel border border-hairline bg-canvas p-5 max-md:p-4"
    >
      {children}
      <div className="ml-auto flex gap-2 max-md:w-full">
        <Link
          href={action}
          className="inline-flex min-h-[38px] items-center justify-center rounded-full border
            border-hairline-strong bg-canvas px-5 text-sm font-medium text-ink no-underline
            transition-colors duration-150 ease-brand hover:bg-surface active:scale-[.98] max-md:flex-1"
        >
          초기화
        </Link>
        <button
          type="submit"
          className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full
            bg-primary px-5 text-sm font-medium text-on-dark transition-colors duration-150 ease-brand
            hover:bg-primary-hover active:scale-[.98] max-md:flex-1"
        >
          검색
        </button>
      </div>
    </Form>
  );
}

/**
 * 네 상태를 칸 모양으로 구분한다.
 * 비어 있음  surface 바탕, hairline 테두리
 * 조건 걸림  canvas 바탕, hairline-strong 테두리. 어떤 조건이 걸렸는지 훑어서 보인다
 * 포커스     canvas 바탕, brand-blue 테두리 + 1px 링. 바깥 윤곽선은 겹치지 않게 끈다
 * 비활성     hairline-soft 바탕, steel 글자
 */
const fieldClass =
  "h-[38px] w-full cursor-pointer appearance-none rounded-field border border-hairline bg-surface text-sm text-ink outline-hidden transition-[background-color,border-color,box-shadow] duration-150 ease-brand hover:border-hairline-strong focus:border-brand-blue focus:bg-canvas focus:shadow-[0_0_0_1px_var(--brand-blue)] disabled:cursor-not-allowed disabled:border-hairline-soft disabled:bg-hairline-soft disabled:text-steel";

type FieldProps = { label: string; name: string; defaultValue?: string };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex w-[220px] flex-col gap-1 text-[13px] text-steel max-md:w-full">
      {label}
      <span className="relative block text-steel">{children}</span>
    </label>
  );
}

export function SearchText({ label, name, defaultValue, placeholder }: FieldProps & { placeholder: string }) {
  return (
    <Field label={label}>
      <MagnifyingGlass size={16} aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" />
      <input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`${fieldClass} cursor-text pr-3 pl-9 placeholder:text-steel not-placeholder-shown:border-hairline-strong
          not-placeholder-shown:bg-canvas [&::-webkit-search-cancel-button]:appearance-none`}
      />
    </Field>
  );
}

/** options 는 { 값: 라벨 }. 맨 앞에 '전체' 가 붙고 그 값은 빈 문자열이다 */
export function SearchSelect({ label, name, defaultValue, options }: FieldProps & { options: Record<string, string> }) {
  return (
    <Field label={label}>
      {/* '전체' 는 조건이 없다는 뜻이라 자리 표시 글자처럼 옅게, 값을 고르면 조건 걸림 모양으로 */}
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className={`${fieldClass} pr-9 pl-3 has-[option[value='']:checked]:text-steel
          not-has-[option[value='']:checked]:border-hairline-strong not-has-[option[value='']:checked]:bg-canvas`}
      >
        <option value="">전체</option>
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      <CaretDown size={14} aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
    </Field>
  );
}
