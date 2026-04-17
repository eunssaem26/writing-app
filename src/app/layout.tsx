import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "글쓰기 커리큘럼",
  description: "질문연구소 글쓰기 커리큘럼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-amber-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
