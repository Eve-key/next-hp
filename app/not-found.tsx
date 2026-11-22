import Link from "next/link";
import SiteFrame from "./site-frame";
import styles from "./subpage.module.scss";

export default function NotFound() {
  return (
    <SiteFrame>
      <main className={styles.page}>
        <header className={styles.title}>
          <p lang="en">404 NOT FOUND</p>
          <h1>ページが見つかりませんでした</h1>
          <p className={styles.intro}>
            住所が変わったか、入力の途中かもしれません。表紙からもう一度おたずねください。
          </p>
        </header>
        <div className={styles.pageEnd}>
          <div className={styles.endActions}>
            <Link className={styles.primary} href="/">トップへ戻る <span aria-hidden="true">→</span></Link>
            <Link className={styles.ghost} href="/gallery/">ギャラリーを見る <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </main>
    </SiteFrame>
  );
}
