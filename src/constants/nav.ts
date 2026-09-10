import type { Icon } from "@phosphor-icons/react";
import {
  ArrowUUpLeft,
  ChartLineUp,
  Gear,
  Package,
  Receipt,
  SquaresFour,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
};

export type NavGroup = {
  caption: string;
  items: NavItem[];
};

/** LNB 와 상단바 breadcrumb 이 같은 목록을 본다. 라벨이 갈라지지 않는다. */
export const NAV_GROUPS: NavGroup[] = [
  {
    caption: "판매",
    items: [
      { href: "/", label: "대시보드", icon: SquaresFour },
      { href: "/products", label: "상품", icon: Package },
      { href: "/orders", label: "주문", icon: Receipt },
      { href: "/returns", label: "반품", icon: ArrowUUpLeft },
    ],
  },
  {
    caption: "운영",
    items: [
      { href: "/customers", label: "고객", icon: UsersThree },
      { href: "/settlements", label: "정산", icon: ChartLineUp },
      { href: "/settings", label: "설정", icon: Gear },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

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
