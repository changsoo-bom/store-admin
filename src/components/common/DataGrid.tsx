"use client";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { AllCommunityModule, themeQuartz } from "ag-grid-community";
import type { ColDef, ColTypeDef, ValueFormatterParams } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import type { CustomCellRendererProps, CustomNoRowsOverlayProps } from "ag-grid-react";

/**
 * 목록 화면의 표. 컬럼 정의는 서버 컴포넌트에서 넘어오므로 함수를 담을 수 없다.
 * 서식은 전부 여기 `type` 으로 모아 두고 컬럼은 `type: "number"` 처럼 이름만 고른다.
 */
export type GridColumn = Omit<ColDef, "type"> & { type?: "number" | "date" | "badge" };

/** 파스텔 짝. DESIGN.md 의 표와 같다. 짝을 바꾸지 않는다 */
const TONES = {
  lavender: "bg-lavender text-blue-deep",
  yellow: "bg-yellow-light text-yellow-dark",
  teal: "bg-teal-light text-moss-dark",
  coral: "bg-coral-light text-coral-dark",
  rose: "bg-rose-light text-coral-dark",
};
export type BadgeTone = keyof typeof TONES;

type BadgeProps = CustomCellRendererProps & { tones?: Record<string, BadgeTone> };

function Badge({ value, valueFormatted, tones }: BadgeProps) {
  if (value == null) return null;
  const tone = tones?.[value];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[13px] leading-normal font-semibold
        whitespace-nowrap ${tone ? TONES[tone] : "bg-surface text-slate"}`}
    >
      {valueFormatted ?? value}
    </span>
  );
}

type EmptyProps = CustomNoRowsOverlayProps & { title: string; hint: string };

function Empty({ title, hint }: EmptyProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 text-center">
      <MagnifyingGlass size={24} aria-hidden className="text-hairline-strong" />
      <b className="mt-1 text-[15px] font-medium text-ink">{title}</b>
      <p className="text-[13px] text-steel">{hint}</p>
    </div>
  );
}

const dateFormat = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
/** "2026. 09. 02." 는 모노 서체에서 칸을 넘친다. "2026.09.02" 로 줄인다 */
const formatDate = (v: string | number | Date) => dateFormat.format(new Date(v)).replace(/\s/g, "").replace(/\.$/, "");

const columnTypes: Record<string, ColTypeDef> = {
  number: {
    headerClass: "ag-right-aligned-header",
    cellClass: "ag-right-aligned-cell font-mono tabular-nums",
    valueFormatter: (p: ValueFormatterParams) => (p.value == null ? "" : p.value.toLocaleString("ko-KR")),
  },
  date: {
    minWidth: 130,
    cellClass: "font-mono text-[13px] tabular-nums text-slate",
    valueFormatter: (p: ValueFormatterParams) => (p.value == null ? "" : formatDate(p.value)),
  },
  badge: { cellRenderer: Badge },
};

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 120,
  sortable: true,
  resizable: true,
  headerClass: "tracking-[0.5px]",
};

const theme = themeQuartz.withParams({
  fontFamily: "inherit",
  fontSize: 14,
  foregroundColor: "var(--ink)",
  backgroundColor: "var(--canvas)",
  borderColor: "var(--hairline)",
  accentColor: "var(--brand-blue)",
  headerBackgroundColor: "var(--surface-soft)",
  headerTextColor: "var(--steel)",
  headerFontSize: 11,
  headerFontWeight: 600,
  headerHeight: 38,
  rowHeight: 48,
  rowBorder: { color: "var(--hairline-soft)" },
  rowHoverColor: "var(--surface-soft)",
  columnBorder: false,
  headerColumnBorder: false,
  // 시안의 표에는 칸 사이 세로줄이 없다. 끌어서 넓히는 기능은 그대로 남는다
  headerColumnResizeHandleColor: "transparent",
  cellHorizontalPadding: 20,
  wrapperBorderRadius: 16,
  // 페이지 크기 선택과 페이지 번호 칸도 검색 영역 입력칸과 같은 모양으로
  inputBackgroundColor: "var(--surface)",
  inputBorder: { color: "var(--hairline)" },
  inputBorderRadius: 8,
  inputFocusBackgroundColor: "var(--canvas)",
  inputFocusBorder: { color: "var(--brand-blue)" },
  inputFocusShadow: "0 0 0 1px var(--brand-blue)",
  inputPlaceholderTextColor: "var(--steel)",
  pickerButtonBackgroundColor: "var(--surface)",
  pickerButtonBorder: { color: "var(--hairline)" },
  pickerButtonBorderRadius: 8,
  pickerButtonFocusBorder: { color: "var(--brand-blue)" },
  pickerListBorder: { color: "var(--hairline)" },
});

const localeText = {
  noRowsToShow: "보여줄 항목이 없다",
  loadingOoo: "불러오는 중",
  page: "페이지",
  of: "/",
  to: "~",
  more: "이상",
  firstPage: "첫 페이지",
  previousPage: "이전 페이지",
  nextPage: "다음 페이지",
  lastPage: "마지막 페이지",
  pageSizeSelectorLabel: "페이지당",
  ariaPageSizeSelectorLabel: "페이지당 행 수",
};

const modules = [AllCommunityModule];

type Props<T> = {
  rows: T[];
  columns: GridColumn[];
  /** 비어 있을 때: 무엇이 없는지 */
  emptyTitle: string;
  /** 비어 있을 때: 다음에 할 것 */
  emptyHint: string;
};

export function DataGrid<T>({ rows, columns, emptyTitle, emptyHint }: Props<T>) {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-[13px] text-steel">
        총 <b className="font-mono font-medium text-ink tabular-nums">{rows.length.toLocaleString("ko-KR")}</b>건
      </p>
      <AgGridProvider modules={modules}>
        {/* ponytail: 페이지를 클라이언트에서 나눈다. 수천 건을 넘기면 searchParams 의 page 로 서버에서 자른다 */}
        <AgGridReact<T>
          theme={theme}
          rowData={rows}
          columnDefs={columns as ColDef<T>[]}
          columnTypes={columnTypes}
          defaultColDef={defaultColDef}
          localeText={localeText}
          domLayout="autoHeight"
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          noRowsOverlayComponent={Empty}
          noRowsOverlayComponentParams={{ title: emptyTitle, hint: emptyHint }}
        />
      </AgGridProvider>
    </section>
  );
}
