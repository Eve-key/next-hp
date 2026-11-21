import Link from "next/link";
import type { ReactNode } from "react";
import { siteTitle } from "./site-content";
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
          <span aria-hidden="true">✿</span>{siteTitle}
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
        <div>
          <Link href="/" className={styles.brand}><span aria-hidden="true">✿</span>{siteTitle}</Link>
          <p>『ご注文はうさぎですか？』の非公式ファンサイト</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="https://gochiusa.com/bloom/">アニメ公式サイト <span aria-hidden="true">↗</span></a>
          <a href="#top">ページトップへ <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </>
  );
}
