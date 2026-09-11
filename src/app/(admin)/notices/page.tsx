import { NoticeFilter } from "@/components/notice/list/NoticeFilter";
import { NoticeList } from "@/components/notice/list/NoticeList";
import { PageTitle } from "@/components/ui/PageTitle";
import { visibilityParamsSchema } from "@/lib/schemas/list";
import type { NoticeRow } from "@/types/notice";

export const metadata = { title: "공지사항" };

export default async function NoticesPage({ searchParams }: PageProps<"/notices">) {
  const params = visibilityParamsSchema.parse(await searchParams);
  // ponytail: notices 테이블이 아직 없다. 만들면 lib/queries/notice.ts 의 조회로 바꾼다
  const notices: NoticeRow[] = [];

  return (
    <>
      <PageTitle>공지사항</PageTitle>
      <NoticeFilter params={params} />
      <NoticeList notices={notices} filtered={Boolean(params.q || params.visible)} />
    </>
  );
}
