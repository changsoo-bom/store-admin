import { SearchPanel, SearchSelect, SearchText } from "@/components/common";
import { VISIBILITY_LABEL } from "@/constants/visibility";
import type { VisibilityParams } from "@/lib/schemas/list";

export function FaqFilter({ params }: { params: VisibilityParams }) {
  return (
    <SearchPanel key={JSON.stringify(params)} action="/faqs">
      <SearchText label="질문" name="q" defaultValue={params.q} placeholder="질문으로 찾기" />
      <SearchSelect label="노출" name="visible" defaultValue={params.visible} options={VISIBILITY_LABEL} />
    </SearchPanel>
  );
}
