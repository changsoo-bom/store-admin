"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS, findNavItem } from "@/constants/nav";

export function Lnb() {
  const pathname = usePathname();
  const current = findNavItem(pathname);

  return (
    <nav
      aria-label="관리 메뉴"
      className="sticky top-0 flex h-dvh flex-col gap-5 border-r border-hairline bg-canvas p-4 px-3
        max-lg:static max-lg:h-auto max-lg:flex-row max-lg:items-center max-lg:gap-4
        max-lg:overflow-x-auto max-lg:border-r-0 max-lg:border-b max-lg:px-4 max-lg:py-3"
    >
      <Link
        href="/"
        className="flex flex-none items-center gap-2.5 px-2 pt-2 text-ink no-underline max-lg:p-0"
      >
        <span
          aria-hidden
          className="grid size-8 flex-none place-items-center rounded-field bg-brand-yellow
            font-display text-[13px] font-semibold text-primary"
        >
          BS
        </span>
        <b className="font-display text-base font-semibold tracking-[-0.01em]">
          BoxingStore
        </b>
      </Link>

      <div className="flex flex-col gap-0.5 max-lg:flex-none max-lg:flex-row">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = current?.href === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-10 items-center gap-2.5 whitespace-nowrap rounded-field px-3
                text-[15px] font-medium no-underline transition-colors duration-150 ease-brand
                ${
                  active
                    ? "bg-primary text-on-dark"
                    : "text-slate hover:bg-surface hover:text-ink"
                }`}
            >
              <Icon size={18} aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
