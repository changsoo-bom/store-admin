import { SearchPanel, SearchSelect, SearchText } from "@/components/common";
import { VISIBILITY_LABEL } from "@/constants/visibility";
import type { VisibilityParams } from "@/lib/schemas/list";

export function NoticeFilter({ params }: { params: VisibilityParams }) {
  return (
    <SearchPanel key={JSON.stringify(params)} action="/notices">
      <SearchText label="제목" name="q" defaultValue={params.q} placeholder="제목으로 찾기" />
      <SearchSelect label="노출" name="visible" defaultValue={params.visible} options={VISIBILITY_LABEL} />
    </SearchPanel>
  );
}
