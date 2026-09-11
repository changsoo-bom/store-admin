/** 공지사항과 FAQ 가 같이 쓰는 노출 상태 */
export const VISIBILITY_LABEL = {
  shown: "노출",
  hidden: "숨김",
};

export type Visibility = keyof typeof VISIBILITY_LABEL;
