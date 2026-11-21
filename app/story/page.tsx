import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { assetPath } from "../asset-path";
import SiteFrame from "../site-frame";
import { episodes } from "../site-content";
import styles from "../subpage.module.scss";

export const metadata: Metadata = {
  title: "物語",
  description: "春の木組みの街を舞台にした、喫茶店の日常を描くファンエピソード。",
};

export default function Story() {
  return (
    <SiteFrame current="/story/">
      <main className={styles.page}>
        <header className={styles.title}>
          <p lang="en">STORY</p><h1>喫茶店からはじまる春。</h1>
          <div className={styles.intro}>桜の下を歩く午後も、春雨に足を止める帰り道も。<br />木組みの街には、ひと息つける場所がある。</div>
        </header>
        <div className={styles.episodes}>
          {episodes.map((episode) => (
            <article className={styles.episode} key={episode.id} id={episode.id}>
              <div className={styles.episodeArt}>
                <Image src={assetPath(episode.image)} alt={episode.alt} fill sizes="(max-width: 700px) 92vw, 650px" />
              </div>
              <div className={styles.episodeCopy}>
                <h2>{episode.title}</h2>
                <p className={styles.episodeTeaser}>{episode.teaser}</p>
                <p>{episode.text}</p>
              </div>
            </article>
          ))}
        </div>
        <Link className={styles.button} href="/characters/">登場人物を見る <span aria-hidden="true">→</span></Link>
      </main>
    </SiteFrame>
  );
}
