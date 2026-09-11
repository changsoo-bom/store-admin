import { DataGrid } from "@/components/common";
import type { GridColumn } from "@/components/common";
import { VISIBILITY_LABEL } from "@/constants/visibility";
import type { FaqRow } from "@/types/faq";

const columns: GridColumn[] = [
  { field: "id", headerName: "번호", flex: 0, width: 96, cellClass: "font-mono text-[13px] tabular-nums text-slate" },
  { field: "category", headerName: "분류" },
  { field: "question", headerName: "질문", flex: 3, minWidth: 260 },
  {
    field: "visible",
    headerName: "노출",
    type: "badge",
    refData: VISIBILITY_LABEL,
    cellRendererParams: { tones: { shown: "teal" } },
  },
];

export function FaqList({ faqs, filtered }: { faqs: FaqRow[]; filtered: boolean }) {
  return (
    <DataGrid
      rows={faqs}
      columns={columns}
      emptyTitle={filtered ? "조건에 맞는 FAQ 가 없다" : "FAQ 가 없다"}
      emptyHint={filtered ? "검색어를 줄이거나 노출을 전체로 바꿔서 다시 찾는다." : "자주 받는 질문을 적어 두면 여기에 쌓인다."}
    />
  );
}
