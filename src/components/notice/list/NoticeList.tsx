import { DataGrid } from "@/components/common";
import type { GridColumn } from "@/components/common";
import { VISIBILITY_LABEL } from "@/constants/visibility";
import type { NoticeRow } from "@/types/notice";

const columns: GridColumn[] = [
  { field: "id", headerName: "번호", flex: 0, width: 96, cellClass: "font-mono text-[13px] tabular-nums text-slate" },
  { field: "title", headerName: "제목", flex: 3, minWidth: 260 },
  {
    field: "visible",
    headerName: "노출",
    type: "badge",
    refData: VISIBILITY_LABEL,
    cellRendererParams: { tones: { shown: "teal" } },
  },
  { field: "publishedAt", headerName: "게시일", type: "date" },
];

export function NoticeList({ notices, filtered }: { notices: NoticeRow[]; filtered: boolean }) {
  return (
    <DataGrid
      rows={notices}
      columns={columns}
      emptyTitle={filtered ? "조건에 맞는 공지사항이 없다" : "공지사항이 없다"}
      emptyHint={filtered ? "검색어를 줄이거나 노출을 전체로 바꿔서 다시 찾는다." : "첫 공지사항을 쓰면 여기에 쌓인다."}
    />
  );
}
