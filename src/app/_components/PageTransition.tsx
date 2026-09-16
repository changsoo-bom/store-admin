"use client";

import { usePathname } from "next/navigation";

/**
 * 라우트가 바뀔 때만 콘텐츠를 다시 그린다. key 가 바뀌면 React 가 새로 붙이고
 * CSS 애니메이션이 한 번 돈다. 검색은 경로가 그대로라 깜빡이지 않는다.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-in flex flex-1 flex-col gap-5 max-md:gap-3">
      {children}
    </div>
  );
}
