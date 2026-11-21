import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/noto-serif-jp";
import "./globals.scss";

export const metadata: Metadata = {
  title: "放課後、春を待つ。",
  description: "桜ヶ丘学園を舞台に、四人の少女との放課後を描く学園恋愛ノベル。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
