import { SearchPanel, SearchSelect, SearchText } from "@/components/common";
import { PRODUCT_STATUS_LABEL } from "@/constants/product";
import type { ProductListParams } from "@/lib/schemas/product";

export function ProductFilter({ params }: { params: ProductListParams }) {
  return (
    <SearchPanel key={JSON.stringify(params)} action="/products">
      <SearchText label="제품명" name="q" defaultValue={params.q} placeholder="제품명으로 찾기" />
      <SearchText label="카테고리" name="category" defaultValue={params.category} placeholder="예: 글러브" />
      <SearchSelect label="상태" name="status" defaultValue={params.status} options={PRODUCT_STATUS_LABEL} />
    </SearchPanel>
  );
}
