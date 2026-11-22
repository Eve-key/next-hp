import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { assetPath } from "../asset-path";
import SiteFrame from "../site-frame";
import { episodes, storyIntro } from "../site-content";
import styles from "../subpage.module.scss";

export const metadata: Metadata = {
  title: "物語",
  description: "春の木組みの街を舞台にした、喫茶店の日常を描くファンエピソード。",
};

export default function Story() {
  return (
    <SiteFrame current="/story/">
      <main>
        <div className={styles.page}>
          <header className={styles.title}>
            <p lang="en">STORY</p>
            <h1>喫茶店からはじまる春。</h1>
            <p className={styles.intro}>{storyIntro}</p>
          </header>
        </div>

        <div className={styles.episodes}>
          {episodes.map((episode) => (
            <article className={styles.episode} key={episode.id} id={episode.id}>
              <figure className={styles.episodeArt}>
                <div className={styles.episodeFrame}>
                  <Image
                    src={assetPath(episode.image)}
                    alt={episode.alt}
                    fill
                    sizes="(max-width: 900px) 94vw, 720px"
                  />
                </div>
                <figcaption>{episode.caption}</figcaption>
              </figure>

              <div className={styles.episodeCopy}>
                <p className={styles.episodeIndex}>
                  <b lang="en">{episode.number}</b>
                  <span lang="en">{episode.label}</span>
                </p>
                <h2>{episode.title}</h2>
                <p className={styles.episodeTeaser}>{episode.teaser}</p>
                {episode.body.map((paragraph) => (
                  <p className={styles.episodeText} key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.page}>
          <div className={styles.pageEnd}>
            <p>読んだあとは、5人の春の制服姿もどうぞ。</p>
            <div className={styles.endActions}>
              <Link className={styles.primary} href="/characters/">登場人物を見る <span aria-hidden="true">→</span></Link>
              <Link className={styles.ghost} href="/gallery/">ギャラリーを見る <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </main>
    </SiteFrame>
  );
}
