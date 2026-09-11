import type { Visibility } from "@/constants/visibility";

/** 공지사항 목록 한 줄. 테이블이 생기면 $inferSelect 로 바꾼다 */
export type NoticeRow = {
  id: number;
  title: string;
  visible: Visibility;
  publishedAt: Date;
};
