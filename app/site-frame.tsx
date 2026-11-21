import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./page.module.scss";

const links = [
  { href: "/", label: "TOP" },
  { href: "/story/", label: "STORY" },
  { href: "/characters/", label: "CHARACTER" },
  { href: "/gallery/", label: "GALLERY" },
] as const;

export default function SiteFrame({
  children,
  current,
}: {
  children: ReactNode;
  current?: typeof links[number]["href"];
}) {
  return (
    <>
      <header className={styles.header} id="top">
        <Link href="/" className={styles.brand}>
          <span aria-hidden="true">✿</span> 放課後、春を待つ。
        </Link>
        <nav aria-label="メインナビゲーション" className={styles.nav} lang="en">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={current === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className={styles.footer}>
        <Link href="/">放課後、春を待つ。</Link>
        <a href="#top">ページトップへ <span aria-hidden="true">↑</span></a>
      </footer>
    </>
  );
}
