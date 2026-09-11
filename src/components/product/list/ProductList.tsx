import { DataGrid } from "@/components/common";
import type { BadgeTone, GridColumn } from "@/components/common";
import { PRODUCT_STATUS_LABEL } from "@/constants/product";
import type { Product } from "@/db/schema";

const STATUS_TONE: Partial<Record<Product["status"], BadgeTone>> = { draft: "yellow", active: "teal" };

const columns: GridColumn[] = [
  { field: "id", headerName: "번호", flex: 0, width: 96, cellClass: "font-mono text-[13px] tabular-nums text-slate" },
  { field: "name", headerName: "제품명", flex: 2, minWidth: 220 },
  { field: "brand", headerName: "브랜드" },
  { field: "category", headerName: "카테고리" },
  { field: "priceKrw", headerName: "판매가", type: "number" },
  {
    field: "status",
    headerName: "상태",
    type: "badge",
    refData: PRODUCT_STATUS_LABEL,
    cellRendererParams: { tones: STATUS_TONE },
  },
  { field: "createdAt", headerName: "등록일", type: "date" },
];

export function ProductList({ products, filtered }: { products: Product[]; filtered: boolean }) {
  return (
    <DataGrid
      rows={products}
      columns={columns}
      emptyTitle={filtered ? "조건에 맞는 제품이 없습니다" : "등록된 제품이 없습니다"}
      emptyHint={filtered ? "검색어를 줄이거나 상태를 전체로 바꿔서 다시 찾아 주세요." : "오른쪽 위 제품 등록에서 첫 제품을 올려 주세요."}
    />
  );
}
