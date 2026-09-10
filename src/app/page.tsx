export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-panel border border-hairline bg-canvas p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-field bg-brand-yellow font-display text-[13px] font-semibold text-primary">
            BS
          </span>
          <b className="font-display text-base font-semibold tracking-[-0.01em]">
            BoxingStore 관리자
          </b>
        </div>

        <p className="mt-4 text-steel">
          디자인 토큰은{" "}
          <code className="rounded-note bg-surface px-1.5 py-0.5 font-mono text-[13px] text-slate">
            DESIGN.md
          </code>{" "}
          에 정리돼 있다. 화면은 아직 없다.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="inline-flex min-h-[38px] items-center rounded-full bg-primary px-5 font-medium text-on-dark transition-colors duration-150 ease-brand hover:bg-primary-hover"
          >
            상품 등록
          </button>
          <button
            type="button"
            className="inline-flex min-h-[38px] items-center rounded-full border border-hairline-strong bg-canvas px-5 font-medium text-ink transition-colors duration-150 ease-brand hover:bg-surface"
          >
            주문 보기
          </button>
        </div>
      </div>
    </main>
  );
}
