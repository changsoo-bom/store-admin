"use client";

import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { findNavItem } from "@/constants/nav";

export function Header() {
  const pathname = usePathname();
  const current = findNavItem(pathname);

  return (
    <header
      className="sticky top-0 z-20 flex min-h-[60px] items-center gap-3 border-b border-hairline
        bg-canvas/90 px-6 backdrop-blur-md max-md:px-4"
    >
      <nav aria-label="현재 위치" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          href="/"
          className="whitespace-nowrap rounded-note px-1 py-0.5 text-steel no-underline
            transition-colors duration-150 ease-brand hover:bg-surface hover:text-ink max-md:hidden"
        >
          BoxingStore
        </Link>
        <CaretRight size={11} aria-hidden className="text-hairline-strong max-md:hidden" />
        <b aria-current="page" className="truncate font-medium">
          {current?.label ?? "관리자"}
        </b>
      </nav>

      <Link
        href="/products/new"
        className="ml-auto inline-flex min-h-[38px] flex-none items-center rounded-full bg-primary
          px-5 text-sm font-medium text-on-dark no-underline transition-colors duration-150
          ease-brand hover:bg-primary-hover"
      >
        상품 등록
      </Link>
    </header>
  );
}
