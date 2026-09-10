type Props = {
  title: string;
  /** 이 화면이 무엇을 담을지. 아직 없다는 말만 남기지 않는다. */
  plan: string;
};

/** 껍데기만 있는 화면. 내용이 들어가면 이 컴포넌트를 걷어낸다. */
export function PagePlaceholder({ title, plan }: Props) {
  return (
    <>
      <h1 className="font-display text-[28px] font-medium leading-tight tracking-[-0.015em] max-md:text-2xl">
        {title}
      </h1>

      <div className="rounded-panel border border-hairline bg-canvas p-10 text-center">
        <p className="font-display text-[17px] font-medium">아직 화면이 없다</p>
        <p className="mt-1 text-steel">{plan}</p>
      </div>
    </>
  );
}
