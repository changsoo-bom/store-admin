/** 목록 화면이 뜨기 전 자리. 최종 레이아웃과 같은 모양이라 데이터가 와도 자리가 안 튄다 */
export function ListSkeleton({ fields = 2, rows = 6 }: { fields?: number; rows?: number }) {
  return (
    <div className="animate-pulse-soft flex flex-col gap-3" aria-hidden>
      <div className="h-8 w-40 rounded-field bg-surface" />

      <div className="overflow-hidden rounded-panel border border-hairline">
        {Array.from({ length: fields }, (_, i) => (
          <div
            key={i}
            className="flex h-[58px] items-center gap-3 px-4 not-last:border-b not-last:border-hairline-soft"
          >
            <div className="h-4 w-20 rounded-note bg-surface" />
            <div className="h-[38px] flex-1 rounded-field bg-surface" />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <div className="h-[38px] w-24 rounded-full bg-surface" />
        <div className="h-[38px] w-24 rounded-full bg-surface" />
      </div>

      <div className="overflow-hidden rounded-panel border border-hairline">
        <div className="h-[38px] bg-surface-soft" />
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex h-12 items-center gap-6 border-t border-hairline-soft px-5">
            <div className="h-3.5 w-10 rounded-note bg-surface" />
            <div className="h-3.5 flex-1 rounded-note bg-surface" />
            <div className="h-3.5 w-24 rounded-note bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
