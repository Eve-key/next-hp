import Link from "next/link";
import type { ReactNode } from "react";
import { fanNotice, siteTitle } from "./site-content";
import styles from "./frame.module.scss";

const links = [
  { href: "/", label: "TOP", reading: "表紙" },
  { href: "/story/", label: "STORY", reading: "物語" },
  { href: "/characters/", label: "CHARACTER", reading: "登場人物" },
  { href: "/gallery/", label: "GALLERY", reading: "イラスト" },
] as const;

function Brand() {
  return (
    <Link href="/" className={styles.brand}>
      <span className={styles.mark} aria-hidden="true">✿</span>
      {siteTitle}
    </Link>
  );
}

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
        <Brand />
        <nav aria-label="メインナビゲーション" className={styles.nav}>
          {links.map(({ href, label, reading }) => (
            <Link key={href} href={href} aria-current={current === href ? "page" : undefined} lang="en">
              {label}
              <span aria-hidden="true" lang="ja">{reading}</span>
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Brand />
            <p>{fanNotice}</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="https://gochiusa.com/bloom/">アニメ公式サイト <span aria-hidden="true">↗</span></a>
            <a href="#top">ページトップへ <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </>
  );
}
