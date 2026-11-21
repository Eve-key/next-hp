import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { assetPath } from "../asset-path";
import SiteFrame from "../site-frame";
import styles from "../subpage.module.css";

export const metadata: Metadata = {
  title: "物語 | 放課後、春を待つ。",
  description: "旧校舎に残された一通の手紙から始まる、桜ヶ丘学園の放課後。",
};

export default function Story() {
  return (
    <SiteFrame current="/story/">
      <main className={styles.page}>
        <header className={styles.title}>
          <p lang="en">STORY</p>
          <h1>桜が散るまで、あと少し。</h1>
        </header>
        <div className={styles.storyArt}>
          <Image src={assetPath("/spring-key-visual.jpg")} alt="" fill sizes="(max-width: 800px) 94vw, 1100px" />
        </div>
        <div className={styles.storyText}>
          <p>
            春休み明け、桜ヶ丘学園の旧校舎で、きみは差出人のない手紙を見つける。
            日付はかすれて読めない。末尾の一行だけが、やけにはっきりと残っていた。
          </p>
          <blockquote>最後の花びらが落ちる前に、またここで。</blockquote>
          <p>
            その一行を頼りに聞き込みを始めると、新聞部の凪紗が撮った写真に、
            手紙と同じ花の模様が見つかる。音楽室で蘭が弾く曲、琴葉が見つけた古い刺繍、
            理央が屋上でつけた天気の記録にも、少しずつ手がかりが重なっていく。
          </p>
          <p>
            旧校舎の扉は、今度の雨が来る前に閉じられる。四人と過ごせる放課後のうちに、
            きみは誰に、どんな言葉を届けるのだろう。
          </p>
          <Link className={styles.button} href="/characters/">登場人物を見る <span aria-hidden="true">→</span></Link>
        </div>
      </main>
    </SiteFrame>
  );
}
