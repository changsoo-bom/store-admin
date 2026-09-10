import type { Icon } from "@phosphor-icons/react";
import {
  Megaphone,
  Package,
  Question,
  SquaresFour,
  TreeStructure,
} from "@phosphor-icons/react/dist/ssr";

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
};

/**
 * LNB 와 상단바 breadcrumb 이 이 목록 하나를 본다. 라벨이 갈라지지 않는다.
 * 다섯 개라 그룹으로 나누지 않았다. 늘어나면 그때 나눈다.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "대시보드", icon: SquaresFour },
  { href: "/categories", label: "카테고리", icon: TreeStructure },
  { href: "/products", label: "제품", icon: Package },
  { href: "/notices", label: "공지사항", icon: Megaphone },
  { href: "/faqs", label: "FAQ", icon: Question },
];

/**
 * 경로에 해당하는 LNB 항목. 하위 경로(`/products/new`)도 부모(`/products`)로 잡는다.
 * 루트는 모든 경로의 접두사라 완전 일치만 인정한다.
 */
export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find(
    (item) =>
      item.href === pathname ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
  );
}
