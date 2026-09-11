import { FaqFilter } from "@/components/faq/list/FaqFilter";
import { FaqList } from "@/components/faq/list/FaqList";
import { PageTitle } from "@/components/ui/PageTitle";
import { visibilityParamsSchema } from "@/lib/schemas/list";
import type { FaqRow } from "@/types/faq";

export const metadata = { title: "FAQ" };

export default async function FaqsPage({ searchParams }: PageProps<"/faqs">) {
  const params = visibilityParamsSchema.parse(await searchParams);
  // ponytail: faqs 테이블이 아직 없다. 만들면 lib/queries/faq.ts 의 조회로 바꾼다
  const faqs: FaqRow[] = [];

  return (
    <>
      <PageTitle>FAQ</PageTitle>
      <FaqFilter params={params} />
      <FaqList faqs={faqs} filtered={Boolean(params.q || params.visible)} />
    </>
  );
}
