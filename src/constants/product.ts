import type { Product } from "@/db/schema";

export const PRODUCT_STATUS_LABEL: Record<Product["status"], string> = {
  draft: "임시 저장",
  active: "판매 중",
  hidden: "숨김",
};
