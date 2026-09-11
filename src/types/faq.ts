import type { Visibility } from "@/constants/visibility";

/** FAQ 목록 한 줄. 테이블이 생기면 $inferSelect 로 바꾼다 */
export type FaqRow = {
  id: number;
  category: string;
  question: string;
  visible: Visibility;
};
