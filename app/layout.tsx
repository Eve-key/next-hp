import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/noto-serif-jp";
import { siteTitle } from "./site-content";
import "./globals.scss";

export const metadata: Metadata = {
  title: { default: siteTitle, template: `%s | ${siteTitle}` },
  description: "ココア、チノ、リゼ、千夜、シャロとめぐる春の喫茶店。『ご注文はうさぎですか？』の非公式ファンサイト。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
