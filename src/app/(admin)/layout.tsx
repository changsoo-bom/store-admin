import { Header } from "@/app/_components/Header";
import { Lnb } from "@/app/_components/Lnb";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid flex-1 grid-cols-[var(--side-width)_minmax(0,1fr)] max-lg:grid-cols-1">
      <Lnb />
      <div className="flex min-w-0 flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-5 p-6 max-md:gap-3 max-md:p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
