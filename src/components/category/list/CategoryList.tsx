import { DataGrid } from "@/components/common";
import type { GridColumn } from "@/components/common";
import type { CategorySummary } from "@/types/category";

const columns: GridColumn[] = [
  { field: "name", headerName: "카테고리명", flex: 2, minWidth: 200 },
  { field: "productCount", headerName: "제품 수", type: "number" },
  { field: "activeCount", headerName: "판매 중", type: "number" },
];

export function CategoryList({ categories, filtered }: { categories: CategorySummary[]; filtered: boolean }) {
  return (
    <DataGrid
      rows={categories}
      columns={columns}
      emptyTitle={filtered ? "조건에 맞는 카테고리가 없습니다" : "등록된 카테고리가 없습니다"}
      emptyHint={filtered ? "검색어를 줄여서 다시 찾아 주세요." : "제품을 등록할 때 정한 카테고리가 여기에 모입니다."}
    />
  );
}
