import { ProductFilter } from "@/components/product/list/ProductFilter";
import { ProductList } from "@/components/product/list/ProductList";
import { PageTitle } from "@/components/ui/PageTitle";
import type { Product } from "@/db/schema";
import { productListParamsSchema } from "@/lib/schemas/product";

export const metadata = { title: "제품" };

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = productListParamsSchema.parse(await searchParams);
  // ponytail: DB 가 아직 안 붙었다(.env.local 없음). 붙으면 lib/queries/product.ts 의 조회로 바꾼다
  const products: Product[] = [];

  return (
    <>
      <PageTitle>제품</PageTitle>
      <ProductFilter params={params} />
      <ProductList products={products} filtered={Boolean(params.q || params.category || params.status)} />
    </>
  );
}
