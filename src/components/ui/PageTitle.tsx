import type { ReactNode } from "react";

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[28px] leading-tight font-medium tracking-[-0.015em] max-md:text-2xl">
      {children}
    </h1>
  );
}
