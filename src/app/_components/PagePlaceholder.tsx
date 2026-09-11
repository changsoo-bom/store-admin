import { PageTitle } from "@/components/ui/PageTitle";

type Props = {
  title: string;
  /** 이 화면이 무엇을 담을지. 아직 없다는 말만 남기지 않는다. */
  plan: string;
};

/** 껍데기만 있는 화면. 내용이 들어가면 이 컴포넌트를 걷어낸다. */
export function PagePlaceholder({ title, plan }: Props) {
  return (
    <>
      <PageTitle>{title}</PageTitle>

      <div className="rounded-panel border border-hairline bg-canvas p-10 text-center">
        <p className="font-display text-[17px] font-medium">아직 준비 중인 화면입니다</p>
        <p className="mt-1 text-steel">{plan}</p>
      </div>
    </>
  );
}
