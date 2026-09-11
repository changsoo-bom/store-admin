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

const fieldClass =
  "h-[38px] w-full rounded-field border border-hairline bg-surface px-3 text-sm text-ink transition-colors duration-150 ease-brand placeholder:text-steel focus:border-brand-blue focus:bg-canvas";

type FieldProps = { label: string; name: string; defaultValue?: string };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex w-[220px] flex-col gap-1 text-[13px] text-steel max-md:w-full">
      {label}
      {children}
    </label>
  );
}

export function SearchText({ label, name, defaultValue, placeholder }: FieldProps & { placeholder?: string }) {
  return (
    <Field label={label}>
      <input type="search" name={name} defaultValue={defaultValue} placeholder={placeholder} className={fieldClass} />
    </Field>
  );
}

/** options 는 { 값: 라벨 }. 맨 앞에 '전체' 가 붙고 그 값은 빈 문자열이다 */
export function SearchSelect({ label, name, defaultValue, options }: FieldProps & { options: Record<string, string> }) {
  return (
    <Field label={label}>
      <select name={name} defaultValue={defaultValue ?? ""} className={fieldClass}>
        <option value="">전체</option>
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </Field>
  );
}
