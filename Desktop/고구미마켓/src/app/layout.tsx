import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "고구마마켓 - 동네 중고거래",
  description: "고구마마켓에서 가까운 이웃과 중고 거래를 시작해보세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/fonts-archive/Paperlogy/subsets/Paperlogy-dynamic-subset.css"
        />
      </head>
      <body className="bg-background min-h-screen">{children}</body>
    </html>
  );
}
