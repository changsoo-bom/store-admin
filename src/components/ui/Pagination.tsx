import { CaretDoubleLeft, CaretDoubleRight, CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

import { fieldClass } from "@/components/ui/field-class";

/** 번호는 현재 페이지를 가운데 두고 다섯 개까지 */
const WINDOW = 5;

type Props = {
  /** 0 부터 센다 */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageSizeProps = { value: number; sizes: number[]; onChange: (size: number) => void };

/** 표 위 '총 N건' 줄 오른쪽에 놓는다. 보이는 라벨은 없고 스크린리더에만 aria-label 로 읽힌다 */
export function PageSizeSelect({ value, sizes, onChange }: PageSizeProps) {
  return (
    <span className="relative block w-[84px] text-steel">
      <select
        aria-label="페이지당 행 수"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${fieldClass} pr-8 pl-3 tabular-nums`}
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <CaretDown size={14} aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
    </span>
  );
}

const roundButton =
  "inline-grid size-9 cursor-pointer place-items-center rounded-full text-sm tabular-nums transition-colors duration-150 ease-brand active:scale-[.98]";

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`${roundButton} text-slate hover:bg-surface disabled:cursor-not-allowed disabled:text-hairline-strong
        disabled:hover:bg-transparent disabled:active:scale-100`}
    >
      {children}
    </button>
  );
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  // 행이 없어도 1 페이지는 있는 것으로 그린다
  const last = Math.max(totalPages, 1) - 1;
  const start = Math.min(Math.max(page - Math.floor(WINDOW / 2), 0), Math.max(last - WINDOW + 1, 0));
  const numbers = Array.from({ length: Math.min(WINDOW, last + 1) }, (_, i) => start + i);

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-1">
      <StepButton label="첫 페이지" disabled={page === 0} onClick={() => onPageChange(0)}>
        <CaretDoubleLeft size={14} aria-hidden />
      </StepButton>
      <StepButton label="이전 페이지" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        <CaretLeft size={14} aria-hidden />
      </StepButton>

      {numbers.map((n) =>
        n === page ? (
          <span key={n} aria-current="page" className={`${roundButton} cursor-default bg-primary font-medium text-on-dark`}>
            {n + 1}
          </span>
        ) : (
          <button
            key={n}
            type="button"
            aria-label={`${n + 1} 페이지`}
            onClick={() => onPageChange(n)}
            className={`${roundButton} text-slate hover:bg-surface hover:text-ink`}
          >
            {n + 1}
          </button>
        ),
      )}

      <StepButton label="다음 페이지" disabled={page >= last} onClick={() => onPageChange(page + 1)}>
        <CaretRight size={14} aria-hidden />
      </StepButton>
      <StepButton label="마지막 페이지" disabled={page >= last} onClick={() => onPageChange(last)}>
        <CaretDoubleRight size={14} aria-hidden />
      </StepButton>
    </nav>
  );
}
