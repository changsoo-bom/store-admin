import { CategoryFilter } from "@/components/category/list/CategoryFilter";
import { CategoryList } from "@/components/category/list/CategoryList";
import { PageTitle } from "@/components/ui/PageTitle";
import { keywordParamsSchema } from "@/lib/schemas/list";
import type { CategorySummary } from "@/types/category";

export const metadata = { title: "카테고리" };

export default async function CategoriesPage({ searchParams }: PageProps<"/categories">) {
  const params = keywordParamsSchema.parse(await searchParams);
  // ponytail: DB 가 아직 안 붙었다. 붙으면 products 를 category 로 묶는 조회로 바꾼다
  const categories: CategorySummary[] = [];

  return (
    <>
      <PageTitle>카테고리</PageTitle>
      <CategoryFilter params={params} />
      <CategoryList categories={categories} filtered={Boolean(params.q)} />
    </>
  );
}
