/** 카테고리 목록 한 줄. 카테고리 테이블이 아직 없어서 products.category 를 묶어 만든다 */
export type CategorySummary = {
  name: string;
  productCount: number;
  activeCount: number;
};
