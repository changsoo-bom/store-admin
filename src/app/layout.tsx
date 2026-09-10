import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

// Outfit 은 라틴만 커버한다. 한글은 Pretendard 로 떨어진다.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Pretendard 는 Google Fonts 에 없어서 파일을 직접 둔다.
// 2MB 가변 폰트라 swap 으로 첫 렌더를 막지 않는다.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "400 600",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BoxingStore 관리자",
    template: "%s · BoxingStore 관리자",
  },
  description: "복싱 용품 스토어 운영 도구. 제품과 카테고리, 공지사항을 다룬다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
