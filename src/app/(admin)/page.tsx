export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-wrap items-end gap-5">
        <h1 className="font-display text-[28px] font-medium leading-tight tracking-[-0.015em] max-md:text-2xl">
          오늘 매장
        </h1>
      </div>

      <div className="rounded-panel border border-hairline bg-canvas p-10 text-center">
        <p className="font-display text-[17px] font-medium">아직 화면이 없다</p>
        <p className="mt-1 text-steel">
          껍데기만 세웠다. 통계와 주문 표는 <code
            className="rounded-note bg-surface px-1.5 py-0.5 font-mono text-[13px] text-slate"
          >prototype/dashboard.html</code> 를 따라 채운다.
        </p>
      </div>
    </>
  );
}
