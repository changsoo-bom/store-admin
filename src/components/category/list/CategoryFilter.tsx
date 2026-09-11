import { SearchPanel, SearchText } from "@/components/common";
import type { KeywordParams } from "@/lib/schemas/list";

export function CategoryFilter({ params }: { params: KeywordParams }) {
  return (
    <SearchPanel key={JSON.stringify(params)} action="/categories">
      <SearchText label="카테고리명" name="q" defaultValue={params.q} placeholder="카테고리명으로 찾기" />
    </SearchPanel>
  );
}
