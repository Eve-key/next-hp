import Link from "next/link";
import SiteFrame from "./site-frame";
import styles from "./subpage.module.scss";

export default function NotFound() {
  return (
    <SiteFrame>
      <main className={styles.page}>
        <header className={styles.title}>
          <p>404</p>
          <h1>ページが見つかりませんでした</h1>
        </header>
        <Link className={styles.button} href="/">トップへ戻る</Link>
      </main>
    </SiteFrame>
  );
}
